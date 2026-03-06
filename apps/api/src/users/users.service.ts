import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                isActive: true,
                referralCount: true,
                createdAt: true,
            },
        });
    }

    async findOne(id: string) {
        return this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                isActive: true,
                referralCode: true,
                referralCount: true,
                createdAt: true,
            },
        });
    }

    async findByEmail(email: string) {
        return this.prisma.user.findUnique({ where: { email } });
    }

    /** Return the current user's profile (safe — no passwordHash) */
    async getMe(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                referralCode: true,
                referralCount: true,
                createdAt: true,
            },
        });
        if (!user) throw new NotFoundException('المستخدم غير موجود');
        return user;
    }

    /** Update profile (name, phone) */
    async updateMe(userId: string, data: { name?: string; phone?: string }) {
        return this.prisma.user.update({
            where: { id: userId },
            data,
            select: { id: true, name: true, email: true, phone: true, role: true, referralCode: true, referralCount: true },
        });
    }

    /** Change password — verifies old password first */
    async changePassword(userId: string, currentPassword: string, newPassword: string) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new NotFoundException('المستخدم غير موجود');

        const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!isMatch) throw new BadRequestException('كلمة المرور الحالية غير صحيحة');

        const passwordHash = await bcrypt.hash(newPassword, 12);
        await this.prisma.user.update({ where: { id: userId }, data: { passwordHash } });
        return { message: 'تم تغيير كلمة المرور بنجاح' };
    }

    /**
     * Full referral status for the banner:
     * - referralCode, referralCount, progress toward next coupon, available coupons
     */
    async getReferralStatus(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { referralCode: true, referralCount: true },
        });
        if (!user) throw new NotFoundException('المستخدم غير موجود');

        const coupons = await this.prisma.coupon.findMany({
            where: { userId, isUsed: false, expiresAt: { gte: new Date() } },
            select: { code: true, discountPct: true, expiresAt: true },
            orderBy: { createdAt: 'desc' },
        });

        const countTowardNext = user.referralCount % 5; // 0–4
        const neededForNext = 5 - countTowardNext;

        return {
            referralCode: user.referralCode,
            referralCount: user.referralCount,
            countTowardNext,
            neededForNext,
            availableCoupons: coupons,
        };
    }
}
