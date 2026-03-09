import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LuckyWheelService {
    constructor(private readonly prisma: PrismaService) { }

    // List of possible rewards logic. In a real scenario, this would come from the database.
    // We'll seed the probability on the fly or just use hardcoded constants for now if no DB rewards exist.
    private DEFAULT_REWARDS = [
        { type: 'DISCOUNT', value: '1', probability: 0.15 },
        { type: 'DISCOUNT', value: '2', probability: 0.15 },
        { type: 'DISCOUNT', value: '3', probability: 0.10 },
        { type: 'DISCOUNT', value: '4', probability: 0.05 },
        { type: 'DISCOUNT', value: '5', probability: 0.05 },
        { type: 'NO_WIN', value: 'Better luck next time', probability: 0.25 },
        { type: 'TRY_AGAIN', value: 'Try again', probability: 0.15 },
        { type: 'MYSTERY', value: 'Mystery reward', probability: 0.10 },
    ];

    async canUserSpin(userId: string): Promise<boolean> {
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const lastSpin = await this.prisma.luckyWheelSpin.findFirst({
            where: {
                userId,
                createdAt: { gte: twentyFourHoursAgo },
            },
            orderBy: { createdAt: 'desc' },
        });

        return !lastSpin;
    }

    async spin(userId: string) {
        if (!(await this.canUserSpin(userId))) {
            throw new BadRequestException('لقد قمت بتدوير العجلة بالفعل خلال آخر 24 ساعة.'); // "You already spun in the last 24h"
        }

        // Attempt to load from DB, or fallback to default
        let rewards = await this.prisma.luckyWheelReward.findMany({ where: { isActive: true } });

        if (rewards.length === 0) {
            // Create defaults in DB if missing
            await this.prisma.luckyWheelReward.createMany({
                data: this.DEFAULT_REWARDS,
            });
            rewards = await this.prisma.luckyWheelReward.findMany({ where: { isActive: true } });
        }

        const selectedReward = this.getWeightedRandomReward(rewards);
        let couponCode = null;

        if (selectedReward.type === 'DISCOUNT') {
            const dbCoupon = await this.generateCoupon(userId, parseInt(selectedReward.value, 10));
            couponCode = dbCoupon.code;
        }

        // Record the spin
        const spinRecord = await this.prisma.luckyWheelSpin.create({
            data: {
                userId,
                rewardId: selectedReward.id,
                rewardType: selectedReward.type,
                rewardValue: selectedReward.value,
                couponCode,
            },
        });

        return {
            type: selectedReward.type,
            value: selectedReward.value,
            couponCode,
        };
    }

    private getWeightedRandomReward(rewards: any[]) {
        // Math.random() gives 0 to 1
        const rand = Math.random();
        let cumulative = 0;

        for (const reward of rewards) {
            cumulative += reward.probability;
            if (rand < cumulative) {
                return reward;
            }
        }
        // Fallback if probabilities don't sum to exactly 1
        return rewards[rewards.length - 1];
    }

    private async generateCoupon(userId: string, discountPct: number) {
        // e.g. LUCKY5-ABC12
        const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
        const code = `LUCKY${discountPct}-${randomSuffix}`;
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // Code valid for 7 days

        return this.prisma.coupon.create({
            data: {
                userId,
                code,
                discountPct,
                expiresAt,
                usageLimit: 1,
                usedCount: 0,
            },
        });
    }
}
