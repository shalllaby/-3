import { Module } from '@nestjs/common';
import { LuckyWheelService } from './lucky-wheel.service';
import { LuckyWheelController } from './lucky-wheel.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [LuckyWheelController],
    providers: [LuckyWheelService],
})
export class LuckyWheelModule { }
