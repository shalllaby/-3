import { Controller, Post, Get, UseGuards, Req, BadRequestException } from '@nestjs/common';
import { LuckyWheelService } from './lucky-wheel.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('lucky-wheel')
export class LuckyWheelController {
    constructor(private readonly luckyWheelService: LuckyWheelService) { }

    @UseGuards(JwtAuthGuard)
    @Get('status')
    async getStatus(@Req() req) {
        const canSpin = await this.luckyWheelService.canUserSpin(req.user.id);
        return { canSpin };
    }

    @UseGuards(JwtAuthGuard)
    @Post('spin')
    async spin(@Req() req) {
        try {
            const result = await this.luckyWheelService.spin(req.user.id);
            return { success: true, reward: result };
        } catch (error) {
            if (error instanceof BadRequestException) {
                return { success: false, message: error.message };
            }
            throw error;
        }
    }
}
