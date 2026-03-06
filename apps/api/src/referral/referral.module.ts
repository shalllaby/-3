import { Module } from '@nestjs/common';
import { ReferralController } from './referral.controller';
import { ReferralService } from './referral.service';
import { PrismaModule } from '../prisma/prisma.module'; // Assume PrismaModule is exported from here

@Module({
    imports: [PrismaModule],
    controllers: [ReferralController],
    providers: [ReferralService],
    exports: [ReferralService],
})
export class ReferralModule { }
