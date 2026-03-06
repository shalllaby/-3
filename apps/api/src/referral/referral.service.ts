import {
    Injectable, BadRequestException, NotFoundException, ConflictException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

const REFERRAL_MILESTONE = 5;
const DISCOUNT_PCT = 5;
const COUPON_VALIDITY_DAYS = 90;

/** Generate a unique, unambiguous 8-char referral code (no 0/O/1/I) */
function generateCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
}

/** Generate a 5% coupon code */
function generateCouponCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const seg = (n: number) =>
        Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    return `AHD5-${seg(4)}-${seg(4)}`;
}

@Injectable()
export class ReferralService {
    constructor(private readonly prisma: PrismaService) { }

    // ──────────────────────────────────────────────────────────
    // GET OR GENERATE REFERRAL LINK
    // ──────────────────────────────────────────────────────────

    async getMyLink(userId: string): Promise<{ link: string; code: string }> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { referralCode: true, referralLink: true },
        });
        if (!user) throw new NotFoundException('User not found');

        if (user.referralCode && user.referralLink) {
            return { link: user.referralLink, code: user.referralCode };
        }

        // Generate a unique code (retry on collision)
        let code = generateCode();
        for (let i = 0; i < 5; i++) {
            const taken = await this.prisma.user.findUnique({ where: { referralCode: code } });
            if (!taken) break;
            code = generateCode();
        }

        const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        const link = `${baseUrl}/register?ref=${code}`;

        await this.prisma.user.update({
            where: { id: userId },
            data: { referralCode: code, referralLink: link },
        });

        return { link, code };
    }

    // ──────────────────────────────────────────────────────────
    // CREATE REFERRAL (called at registration)
    // ──────────────────────────────────────────────────────────

    async createReferral(referredUserId: string, referralCode: string): Promise<void> {
        if (!referralCode) return;

        const referrer = await this.prisma.user.findUnique({
            where: { referralCode },
            select: { id: true },
        });

        if (!referrer) return; // Invalid code — silently ignore

        // Security: prevent self-referral
        if (referrer.id === referredUserId) {
            throw new BadRequestException('لا يمكنك استخدام رابط الإحالة الخاص بك');
        }

        // Security: one Referral per referred user (unique DB constraint handles duplicate too)
        const existing = await this.prisma.referral.findUnique({
            where: { referredId: referredUserId },
        });
        if (existing) return; // Already referred — no-op

        // Create PENDING referral and link referred user to referrer
        await this.prisma.$transaction([
            this.prisma.referral.create({
                data: {
                    referrerId: referrer.id,
                    referredId: referredUserId,
                    status: 'PENDING',
                },
            }),
            this.prisma.user.update({
                where: { id: referredUserId },
                data: { referredBy: referrer.id },
            }),
        ]);
    }

    // ──────────────────────────────────────────────────────────
    // CONFIRM REFERRAL (called on first successful paid order)
    // ──────────────────────────────────────────────────────────

    async confirmReferral(referredUserId: string): Promise<void> {
        // Find PENDING referral for this user
        const referral = await this.prisma.referral.findUnique({
            where: { referredId: referredUserId },
            include: { referrer: { select: { id: true, discountEligible: true, discountUsed: true } } },
        });

        if (!referral || referral.status !== 'PENDING') return; // Already confirmed or no referral

        // Count how many confirmed referrals the referrer will have after this one
        const confirmedCount = await this.prisma.referral.count({
            where: { referrerId: referral.referrerId, status: 'CONFIRMED' },
        });
        const newCount = confirmedCount + 1;

        await this.prisma.$transaction(async (tx) => {
            // Mark this referral as confirmed
            await tx.referral.update({
                where: { id: referral.id },
                data: { status: 'CONFIRMED', confirmedAt: new Date() },
            });

            // If milestone reached and discount not yet issued
            if (newCount >= REFERRAL_MILESTONE
                && !referral.referrer.discountEligible
                && !referral.referrer.discountUsed) {

                const couponCode = generateCouponCode();
                const expiresAt = new Date();
                expiresAt.setDate(expiresAt.getDate() + COUPON_VALIDITY_DAYS);

                // Set discountEligible on referrer
                await tx.user.update({
                    where: { id: referral.referrerId },
                    data: {
                        discountEligible: true,
                        referralDiscountCode: couponCode,
                        referralDiscountUsed: false,
                    },
                });

                // Create coupon record for checkout validation
                await tx.coupon.create({
                    data: {
                        userId: referral.referrerId,
                        code: couponCode,
                        discountPct: DISCOUNT_PCT,
                        expiresAt,
                    },
                });
            }
        });
    }

    // ──────────────────────────────────────────────────────────
    // APPLY REFERRAL DISCOUNT AT CHECKOUT
    // ──────────────────────────────────────────────────────────

    /**
     * Called inside the OrdersService create() transaction when the user opts to use their referral discount.
     * Returns the discount percentage if eligible, otherwise 0.
     */
    async applyReferralDiscount(userId: string, tx: Prisma.TransactionClient): Promise<number> {
        const user = await tx.user.findUnique({
            where: { id: userId },
            select: { discountEligible: true, discountUsed: true },
        });

        if (!user || !user.discountEligible || user.discountUsed) return 0;

        // Mark discount as used atomically
        await tx.user.update({
            where: { id: userId },
            data: { discountEligible: false, discountUsed: true, referralDiscountUsed: true },
        });

        return DISCOUNT_PCT;
    }

    // ──────────────────────────────────────────────────────────
    // BACKWARD-COMPAT: generateDiscount (kept for admin use)
    // ──────────────────────────────────────────────────────────

    async generateDiscount(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { discountEligible: true, discountUsed: true, referralDiscountCode: true },
        });
        if (!user) throw new NotFoundException('User not found');
        if (!user.discountEligible) throw new BadRequestException('المستخدم غير مؤهل للخصم بعد');
        if (user.referralDiscountCode) throw new ConflictException('تم إصدار كود الخصم مسبقاً');

        const code = generateCouponCode();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + COUPON_VALIDITY_DAYS);

        await this.prisma.$transaction([
            this.prisma.user.update({
                where: { id: userId },
                data: { referralDiscountCode: code, referralDiscountUsed: false },
            }),
            this.prisma.coupon.create({
                data: { userId, code, discountPct: DISCOUNT_PCT, expiresAt },
            }),
        ]);

        return { code };
    }

    // ──────────────────────────────────────────────────────────
    // STATUS — for the /referral frontend page
    // ──────────────────────────────────────────────────────────

    async getStatus(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                referralCode: true,
                referralLink: true,
                discountEligible: true,
                discountUsed: true,
                referralDiscountCode: true,
                referralDiscountUsed: true,
            },
        });
        if (!user) throw new NotFoundException('User not found');

        // Count confirmed referrals from the Referral table (never trusts cached counter)
        const confirmed = await this.prisma.referral.count({
            where: { referrerId: userId, status: 'CONFIRMED' },
        });
        const pending = await this.prisma.referral.count({
            where: { referrerId: userId, status: 'PENDING' },
        });

        // Ensure link exists
        let link = user.referralLink;
        let code = user.referralCode;
        if (!link || !code) {
            const generated = await this.getMyLink(userId);
            link = generated.link;
            code = generated.code;
        }

        return {
            code,
            link,
            confirmedCount: confirmed,
            pendingCount: pending,
            target: REFERRAL_MILESTONE,
            progressPct: Math.min(Math.round((confirmed / REFERRAL_MILESTONE) * 100), 100),
            discountEligible: user.discountEligible,
            discountUsed: user.discountUsed,
            discountCode: user.referralDiscountCode,
        };
    }

    // Kept for legacy controller endpoint compatibility
    async trackReferral(referredUserId: string, referralCode: string): Promise<void> {
        return this.createReferral(referredUserId, referralCode);
    }
}
