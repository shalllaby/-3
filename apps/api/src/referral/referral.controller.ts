import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReferralService } from './referral.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

/** Custom interface for request to include user data from JwtAuthGuard */
interface RequestWithUser {
    user: {
        userId: string;
        role: string;
    };
}

@ApiTags('Referral - نظام الإحالة')
@Controller('referral')
export class ReferralController {
    constructor(private readonly referralService: ReferralService) { }

    @Get('my-link')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'الجصول على رابط الإحالة الخاص بالمستخدم' })
    async getMyLink(@Req() req: RequestWithUser) {
        return this.referralService.getMyLink(req.user.userId);
    }

    @Get('status')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'معرفة حالة العداد وكود الخصم إن وجد' })
    async getStatus(@Req() req: RequestWithUser) {
        return this.referralService.getStatus(req.user.userId);
    }

    @Post('track')
    // Open endpoint: called without auth when a user signs up using a referral link
    @ApiOperation({ summary: 'تسجيل تسجيل جديد عبر رابط إحالة' })
    async track(@Body('referredUserId') referredUserId: string, @Body('referralCode') referralCode: string) {
        await this.referralService.trackReferral(referredUserId, referralCode);
        return { success: true };
    }

    @Post('generate-discount')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'إصدار كود الخصم 5% يدوياً إذا اكتمل العداد' })
    async generateDiscount(@Req() req: RequestWithUser) {
        return this.referralService.generateDiscount(req.user.userId);
    }
}
