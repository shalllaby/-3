import { Body, Controller, Get, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ShippingService, KuwaitGovernorate, DeliveryType } from './shipping.service';
import { IsEnum, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

class CalculateShippingDto {
    @IsEnum(
        ['ASIMAH', 'HAWALLI', 'FARWANIYA', 'JAHRA', 'MUBARAK_AL_KABEER', 'AHMADI'],
        { message: 'governorate يجب أن يكون إحدى محافظات الكويت الست' },
    )
    governorate: KuwaitGovernorate;

    @IsEnum(
        ['STANDARD', 'SAME_DAY', 'INSTANT', 'SELF_PICKUP'],
        { message: 'deliveryType يجب أن يكون: STANDARD | SAME_DAY | INSTANT | SELF_PICKUP' },
    )
    deliveryType: DeliveryType;

    @Type(() => Number)
    @IsNumber()
    @Min(0)
    orderSubtotalKwd: number;
}

@ApiTags('Shipping')
@Controller('shipping')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class ShippingController {
    constructor(private readonly shippingService: ShippingService) { }

    /**
     * POST /shipping/calculate
     * Calculate delivery fee + ETA for a Kuwait governorate.
     */
    @Post('calculate')
    @ApiOperation({ summary: 'حساب رسوم التوصيل حسب المحافظة وطريقة التسليم' })
    calculate(@Body() dto: CalculateShippingDto) {
        return this.shippingService.calculate(
            dto.governorate,
            dto.deliveryType,
            dto.orderSubtotalKwd,
        );
    }

    /**
     * GET /shipping/governorates
     * Returns all 6 Kuwait governorates with Arabic/English names for UI dropdowns.
     */
    @Get('governorates')
    @ApiOperation({ summary: 'قائمة المحافظات الكويتية الست' })
    getGovernorates() {
        return this.shippingService.getGovernorates();
    }

    /**
     * GET /shipping/delivery-types
     * Returns all delivery types with Arabic labels.
     */
    @Get('delivery-types')
    @ApiOperation({ summary: 'أنواع التوصيل المتاحة' })
    getDeliveryTypes() {
        return this.shippingService.getDeliveryTypes();
    }
}
