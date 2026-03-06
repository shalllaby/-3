/**
 * PaymentsService — Kuwait Market Payment Gateway Adapters
 *
 * الديرة باك — Aldeera Pack
 *
 * Supported gateways:
 *  - KNET       → via Tap Payments redirect flow (primary Kuwaiti method)
 *  - Pay Deema  → via Deema REST API (BNPL)
 *  - Apple Pay  → via Tap Payments Apple Pay session
 *  - Visa/MC    → via Tap Payments tokenized charge
 *  - COD        → internal — confirmed immediately + optional COD fee
 *
 * All amounts are in KWD fils (1 KWD = 1000 fils).
 * To add a new gateway: create a method + register in `initiate()`.
 */
import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// ── Types ─────────────────────────────────────────────────────────────────

export type KuwaitPaymentMethod =
    | 'KNET'
    | 'PAY_DEEMA'
    | 'APPLE_PAY'
    | 'VISA_MASTERCARD'
    | 'CASH_ON_DELIVERY';

export interface PaymentInitiationRequest {
    method: KuwaitPaymentMethod;
    amountFils: number;       // Amount in KWD fils (KWD × 1000)
    orderId: string;
    description: string;
    callbackUrl: string;
    customerEmail?: string;
    customerName?: string;
    customerPhone?: string;
    /** Tokenized card or wallet token (not needed for KNET redirect / COD) */
    token?: string;
}

export interface PaymentInitiationResult {
    method: KuwaitPaymentMethod;
    transactionId: string;
    status: 'initiated' | 'pending' | 'succeeded' | 'failed';
    /** Redirect URL for KNET / Deema hosted pages */
    redirectUrl?: string;
    amountFils: number;
    amountKwd: number;   // amountFils / 1000
}

// ── Kuwait COD fee constant ────────────────────────────────────────────────
export const COD_FEE_FILS = 500; // 0.500 KWD

// ─────────────────────────────────────────────────────────────────────────

@Injectable()
export class PaymentsService {
    private readonly logger = new Logger(PaymentsService.name);

    /** Tap Payments secret key (used for KNET, Apple Pay, Visa/MC) */
    private readonly tapSecretKey: string;

    /** Pay Deema API key */
    private readonly deemaApiKey: string;

    constructor(private readonly config: ConfigService) {
        this.tapSecretKey = config.get<string>('TAP_SECRET_KEY', '');
        this.deemaApiKey = config.get<string>('DEEMA_API_KEY', '');

        // Warn on startup if keys are missing — catches misconfigured deployments early
        if (!this.tapSecretKey) {
            this.logger.warn('TAP_SECRET_KEY is not set — KNET, Apple Pay, Visa/MC will use stubs only');
        }
        if (!this.deemaApiKey) {
            this.logger.warn('DEEMA_API_KEY is not set — Pay Deema will use stub only');
        }
    }

    // ── Unified entry point ──────────────────────────────────────────────

    async initiate(req: PaymentInitiationRequest): Promise<PaymentInitiationResult> {
        this.logger.log(
            `Payment initiation: method=${req.method} order=${req.orderId} fils=${req.amountFils}`,
        );

        switch (req.method) {
            case 'KNET': return this.initiateKnet(req);
            case 'PAY_DEEMA': return this.initiatePayDeema(req);
            case 'APPLE_PAY': return this.initiateApplePay(req);
            case 'VISA_MASTERCARD': return this.initiateCreditCard(req);
            case 'CASH_ON_DELIVERY': return this.initiateCod(req);
            default:
                throw new BadRequestException(`Unsupported payment method: ${(req as any).method}`);
        }
    }

    // ── KNET ──────────────────────────────────────────────────────────────
    /**
     * KNET is Kuwait's national debit card network.
     * Integration via Tap Payments hosted page (redirect flow).
     *
     * Production: POST https://api.tap.company/v2/charges
     * with source.id = "src_kw.knet"
     */
    private async initiateKnet(req: PaymentInitiationRequest): Promise<PaymentInitiationResult> {
        this.logger.log(`[KNET] Initiating for order ${req.orderId}`);

        // ── Production implementation ──────────────────────────────────────
        // const response = await fetch('https://api.tap.company/v2/charges', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //     Authorization: `Bearer ${this.tapSecretKey}`,
        //   },
        //   body: JSON.stringify({
        //     amount: req.amountFils / 1000,
        //     currency: 'KWD',
        //     customer: { email: req.customerEmail, name: req.customerName, phone: req.customerPhone },
        //     source: { id: 'src_kw.knet' },
        //     redirect: { url: req.callbackUrl },
        //     description: req.description,
        //     metadata: { order_id: req.orderId },
        //   }),
        // });
        // const data = await response.json();
        // return {
        //   method: 'KNET',
        //   transactionId: data.id,
        //   status: 'initiated',
        //   redirectUrl: data.transaction.url,
        //   amountFils: req.amountFils,
        //   amountKwd: req.amountFils / 1000,
        // };
        // ──────────────────────────────────────────────────────────────────

        // Scaffold stub:
        return {
            method: 'KNET',
            transactionId: `knet_${Date.now()}_${req.orderId}`,
            status: 'initiated',
            redirectUrl: `https://checkout.tap.company/knet/${req.orderId}`,
            amountFils: req.amountFils,
            amountKwd: req.amountFils / 1000,
        };
    }

    // ── Pay Deema ─────────────────────────────────────────────────────────
    /**
     * Pay Deema — Kuwait BNPL provider.
     * REST API with order creation, returns a checkout URL.
     *
     * Docs: https://docs.deema.me (requires merchant onboarding)
     */
    private async initiatePayDeema(req: PaymentInitiationRequest): Promise<PaymentInitiationResult> {
        this.logger.log(`[PAY_DEEMA] Initiating for order ${req.orderId}`);

        // ── Production implementation ──────────────────────────────────────
        // const response = await fetch('https://api.deema.me/v1/orders', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //     'X-Api-Key': this.deemaApiKey,
        //   },
        //   body: JSON.stringify({
        //     reference: req.orderId,
        //     amount: req.amountFils / 1000,
        //     currency: 'KWD',
        //     customer: { name: req.customerName, email: req.customerEmail, phone: req.customerPhone },
        //     redirect_url: req.callbackUrl,
        //     items: [{ name: req.description, amount: req.amountFils / 1000, quantity: 1 }],
        //   }),
        // });
        // const data = await response.json();
        // return {
        //   method: 'PAY_DEEMA',
        //   transactionId: data.order_id,
        //   status: 'initiated',
        //   redirectUrl: data.checkout_url,
        //   amountFils: req.amountFils,
        //   amountKwd: req.amountFils / 1000,
        // };
        // ──────────────────────────────────────────────────────────────────

        return {
            method: 'PAY_DEEMA',
            transactionId: `deema_${Date.now()}_${req.orderId}`,
            status: 'initiated',
            redirectUrl: `https://checkout.deema.me/${req.orderId}`,
            amountFils: req.amountFils,
            amountKwd: req.amountFils / 1000,
        };
    }

    // ── Apple Pay ─────────────────────────────────────────────────────────
    /**
     * Apple Pay via Tap Payments Apple Pay Web session.
     * 1. Frontend initiates an Apple Pay session
     * 2. Backend receives the Apple Pay token and charges via Tap
     *
     * Production: POST https://api.tap.company/v2/charges
     * with source.id = "src_apple_pay" and token from frontend
     */
    private async initiateApplePay(req: PaymentInitiationRequest): Promise<PaymentInitiationResult> {
        this.logger.log(`[APPLE_PAY] Initiating for order ${req.orderId}`);

        // ── Production implementation ──────────────────────────────────────
        // const response = await fetch('https://api.tap.company/v2/charges', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${this.tapSecretKey}` },
        //   body: JSON.stringify({
        //     amount: req.amountFils / 1000,
        //     currency: 'KWD',
        //     customer: { email: req.customerEmail, name: req.customerName },
        //     source: { id: req.token },   // Apple Pay token from frontend JS
        //     redirect: { url: req.callbackUrl },
        //     description: req.description,
        //   }),
        // });
        // const data = await response.json();
        // return { method: 'APPLE_PAY', transactionId: data.id, status: data.status, amountFils: req.amountFils, amountKwd: req.amountFils / 1000 };
        // ──────────────────────────────────────────────────────────────────

        return {
            method: 'APPLE_PAY',
            transactionId: `applepay_${Date.now()}_${req.orderId}`,
            status: 'initiated',
            amountFils: req.amountFils,
            amountKwd: req.amountFils / 1000,
        };
    }

    // ── Credit Card (Visa / Mastercard) ───────────────────────────────────
    /**
     * Tokenized card charge via Tap Payments.
     * Token is generated by Tap.js on the frontend (PCI-compliant).
     */
    private async initiateCreditCard(req: PaymentInitiationRequest): Promise<PaymentInitiationResult> {
        this.logger.log(`[VISA_MASTERCARD] Initiating for order ${req.orderId}`);

        // ── Production implementation ──────────────────────────────────────
        // const response = await fetch('https://api.tap.company/v2/charges', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${this.tapSecretKey}` },
        //   body: JSON.stringify({
        //     amount: req.amountFils / 1000,
        //     currency: 'KWD',
        //     customer: { email: req.customerEmail },
        //     source: { id: req.token },   // Card token from Tap.js
        //     redirect: { url: req.callbackUrl },
        //     description: req.description,
        //   }),
        // });
        // const data = await response.json();
        // return { method: 'VISA_MASTERCARD', transactionId: data.id, status: data.status, amountFils: req.amountFils, amountKwd: req.amountFils / 1000 };
        // ──────────────────────────────────────────────────────────────────

        return {
            method: 'VISA_MASTERCARD',
            transactionId: `card_${Date.now()}_${req.orderId}`,
            status: 'initiated',
            amountFils: req.amountFils,
            amountKwd: req.amountFils / 1000,
        };
    }

    // ── Cash on Delivery ──────────────────────────────────────────────────
    /**
     * COD — no external gateway call.
     * Confirms immediately; COD fee is applied at order level.
     */
    private async initiateCod(req: PaymentInitiationRequest): Promise<PaymentInitiationResult> {
        this.logger.log(`[COD] Confirming COD for order ${req.orderId}`);
        return {
            method: 'CASH_ON_DELIVERY',
            transactionId: `cod_${Date.now()}_${req.orderId}`,
            status: 'succeeded',   // COD is immediately "accepted"
            amountFils: req.amountFils,
            amountKwd: req.amountFils / 1000,
        };
    }

    // ── Webhook verification ───────────────────────────────────────────────
    /**
     * Verify Tap Payments webhook HMAC-SHA256 signature.
     * Called from POST /payments/tap/webhook
     */
    async verifyTapWebhook(
        payload: Record<string, unknown>,
        signature: string,
    ): Promise<boolean> {
        this.logger.log('Verifying Tap Payments webhook signature');
        // ── Production ────────────────────────────────────────────────────
        // const crypto = await import('crypto');
        // const expected = crypto
        //   .createHmac('sha256', this.tapSecretKey)
        //   .update(JSON.stringify(payload))
        //   .digest('hex');
        // return expected === signature;
        // ─────────────────────────────────────────────────────────────────
        return true; // Stub — implement HMAC check before going live
    }

    /**
     * Verify Pay Deema webhook HMAC-SHA256 signature.
     * Called from POST /payments/deema/webhook
     * Deema signs with X-Deema-Signature header using HMAC-SHA256(deemaApiKey, body).
     */
    async verifyDeemaWebhook(
        payload: Record<string, unknown>,
        signature: string,
    ): Promise<boolean> {
        this.logger.log('Verifying Pay Deema webhook signature');
        // ── Production ────────────────────────────────────────────────────
        // const crypto = await import('crypto');
        // const expected = crypto
        //   .createHmac('sha256', this.deemaApiKey)
        //   .update(JSON.stringify(payload))
        //   .digest('hex');
        // return expected === signature;
        // ─────────────────────────────────────────────────────────────────
        return true; // Stub — implement before going live
    }

    /** Lookup a single payment method descriptor by its enum id */
    getMethodById(id: KuwaitPaymentMethod) {
        return this.getSupportedMethods().find((m) => m.id === id) ?? null;
    }

    // ── Supported methods (for UI display) ────────────────────────────────
    getSupportedMethods() {
        return [
            {
                id: 'KNET' as const,
                nameAr: 'كي نت',
                nameEn: 'KNET',
                icon: '/icons/knet.svg',
                desc: 'الدفع عبر بطاقة كي نت الكويتية',
            },
            {
                id: 'PAY_DEEMA' as const,
                nameAr: 'Pay Deema',
                nameEn: 'Pay Deema',
                icon: '/icons/deema.svg',
                desc: 'اشترِ الآن وادفع لاحقاً',
            },
            {
                id: 'APPLE_PAY' as const,
                nameAr: 'Apple Pay',
                nameEn: 'Apple Pay',
                icon: '/icons/applepay.svg',
                desc: 'ادفع بـ Apple Pay من جهازك',
            },
            {
                id: 'VISA_MASTERCARD' as const,
                nameAr: 'فيزا / ماستركارد',
                nameEn: 'Visa / Mastercard',
                icon: '/icons/visa-mc.svg',
                desc: 'بطاقة ائتمانية أو مدى دولية',
            },
            {
                id: 'CASH_ON_DELIVERY' as const,
                nameAr: 'الدفع عند الاستلام',
                nameEn: 'Cash on Delivery',
                icon: '/icons/cod.svg',
                desc: `ادفع نقداً عند التسليم (+0.500 د.ك)`,
            },
        ];
    }
}
