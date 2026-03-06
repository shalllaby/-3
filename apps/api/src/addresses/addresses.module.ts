import { Module } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { AddressesController } from './addresses.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [AddressesController],
    providers: [AddressesService],
    exports: [AddressesService], // exported so OrdersService can use verifyOwnership
})
export class AddressesModule { }
