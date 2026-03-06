import { Body, Controller, Get, Post, Headers, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PaymentsService, PaymentInitiationRequest } from './payments.service';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) { }

    /**
     * GET /payments/methods
     * Returns all supported Kuwait payment methods for UI display.
     */
    @Get('methods')
    @ApiOperation({ summary: 'قائمة طرق الدفع المتاحة في الكويت' })
    getMethods() {
        return this.paymentsService.getSupportedMethods();
    }

    /**
     * POST /payments/initiate
     * Initiates a payment via the specified Kuwait gateway.
     * method: KNET | PAY_DEEMA | APPLE_PAY | VISA_MASTERCARD | CASH_ON_DELIVERY
     */
    @Post('initiate')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'بدء عملية دفع (كي نت، ديما، أبل باي، فيزا، COD)' })
    initiate(@Body() req: PaymentInitiationRequest) {
        return this.paymentsService.initiate(req);
    }

    /**
     * POST /payments/tap/webhook
     * Receives Tap Payments webhook callbacks (KNET, Apple Pay, Visa/MC).
     */
    @Post('tap/webhook')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Webhook — Tap Payments (KNET / Apple Pay / Visa)' })
    tapWebhook(
        @Body() payload: Record<string, unknown>,
        @Headers('tap-signature') signature: string,
    ) {
        return this.paymentsService.verifyTapWebhook(payload, signature);
    }

    /**
     * POST /payments/deema/webhook
     * Receives Pay Deema BNPL webhook callbacks.
     */
    @Post('deema/webhook')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Webhook — Pay Deema' })
    deemaWebhook(
        @Body() payload: Record<string, unknown>,
        @Headers('x-deema-signature') signature: string,
    ) {
        return this.paymentsService.verifyDeemaWebhook(payload, signature);
    }
}
