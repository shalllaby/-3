import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { ShippingModule } from './shipping/shipping.module';
import { PaymentsModule } from './payments/payments.module';
import { ReferralModule } from './referral/referral.module';
import { AddressesModule } from './addresses/addresses.module';
import { PackagesModule } from './packages/packages.module';
import { ReviewsModule } from './reviews/reviews.module';

@Module({
    imports: [
        // Load .env globally
        ConfigModule.forRoot({ isGlobal: true }),

        // Rate limiting: 100 requests/minute per IP
        ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),

        // Core modules
        PrismaModule,
        AuthModule,
        UsersModule,
        CategoriesModule,
        ProductsModule,
        OrdersModule,
        ShippingModule,
        PaymentsModule,
        // Referral Module
        ReferralModule,
        AddressesModule,
        PackagesModule,
        ReviewsModule,
    ],
})
export class AppModule { }
