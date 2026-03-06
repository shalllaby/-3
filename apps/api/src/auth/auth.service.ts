import {
    Injectable,
    UnauthorizedException,
    ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ReferralService } from '../referral/referral.service';

/** Generate a unique referral code like AHD-A1B2C3 (no ambiguous 0,O,1,I) */
function generateReferralCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'AHD-';
    for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
    return code;
}

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
        private readonly referralService: ReferralService,
    ) { }

    /**
     * Register a new customer account.
     * Hashes password with bcrypt (12 rounds) before storing.
     * Automatically generates a unique referralCode for the new user.
     * If a referralCode from ?ref=CODE is provided, creates a PENDING Referral record.
     */
    async register(dto: RegisterDto) {
        // Check if email already exists
        const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (existing) throw new ConflictException('البريد الإلكتروني مستخدم بالفعل');

        const passwordHash = await bcrypt.hash(dto.password, 12);

        // Generate a unique referral code (retry on collision, max 5 attempts)
        let referralCode = generateReferralCode();
        for (let attempt = 0; attempt < 5; attempt++) {
            const taken = await this.prisma.user.findUnique({ where: { referralCode } });
            if (!taken) break;
            referralCode = generateReferralCode();
        }

        const user = await this.prisma.user.create({
            data: {
                name: dto.name,
                email: dto.email,
                passwordHash,
                role: 'CUSTOMER',
                referralCode,
            },
            select: { id: true, name: true, email: true, role: true, referralCode: true, createdAt: true },
        });

        // Track referral if a referrer code was provided (fire-and-forget, non-blocking)
        if (dto.referralCode) {
            this.referralService.createReferral(user.id, dto.referralCode)
                .then(() => this.referralService.confirmReferral(user.id))
                .catch(() => { /* no-op */ });
        }

        const token = this.signToken(user.id, user.role);
        return { user, token };
    }

    /**
     * Authenticate and return a JWT token.
     */
    async login(dto: LoginDto) {
        const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (!user) throw new UnauthorizedException('بيانات الدخول غير صحيحة');

        const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
        if (!isMatch) throw new UnauthorizedException('بيانات الدخول غير صحيحة');

        if (!user.isActive) throw new UnauthorizedException('الحساب معطل');

        const { passwordHash, ...safeUser } = user;
        const token = this.signToken(user.id, user.role);

        // Confirm referral on login (fire-and-forget)
        this.referralService.confirmReferral(user.id).catch(() => { /* no-op */ });

        return { user: safeUser, token };
    }

    private signToken(userId: string, role: string): string {
        return this.jwtService.sign({ sub: userId, role });
    }
}
