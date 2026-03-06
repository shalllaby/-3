import {
    Controller, Get, Patch, Post, Body, Param,
    UseGuards, Request, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    // ─── Admin: list all users ───────────────────────────────────────
    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Admin: list all users' })
    findAll() {
        return this.usersService.findAll();
    }

    // ─── Me: profile ──────────────────────────────────────────────────
    @Get('me')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get current user profile' })
    getMe(@Request() req: any) {
        return this.usersService.getMe(req.user.userId);
    }

    @Patch('me')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update profile (name, phone)' })
    updateMe(@Request() req: any, @Body() body: { name?: string; phone?: string }) {
        return this.usersService.updateMe(req.user.userId, body);
    }

    @Patch('me/password')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Change password' })
    changePassword(
        @Request() req: any,
        @Body() body: { currentPassword: string; newPassword: string },
    ) {
        return this.usersService.changePassword(
            req.user.userId,
            body.currentPassword,
            body.newPassword,
        );
    }

    // ─── Me: referral status ─────────────────────────────────────────
    @Get('me/referral')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get referral status: count, progress, available coupons' })
    getReferralStatus(@Request() req: any) {
        return this.usersService.getReferralStatus(req.user.userId);
    }

    // ─── Admin: single user ───────────────────────────────────────────
    @Get(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Admin: get user by ID' })
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }
}
