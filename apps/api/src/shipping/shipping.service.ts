import { Injectable, BadRequestException } from '@nestjs/common';

/**
 * Kuwait Shipping Fee Calculator — الديرة باك
 *
 * Calculates delivery fees in KWD based on:
 *  - Kuwait governorate (محافظة)
 *  - Delivery type: STANDARD / SAME_DAY / INSTANT / SELF_PICKUP
 *  - Order subtotal (free shipping threshold = 10 KWD)
 *
 * All fees in KWD (Decimal, 3 places).
 */

export type KuwaitGovernorate =
    | 'ASIMAH'            // العاصمة
    | 'HAWALLI'           // حولي
    | 'FARWANIYA'         // الفروانية
    | 'JAHRA'             // الجهراء
    | 'MUBARAK_AL_KABEER' // مبارك الكبير
    | 'AHMADI';           // الأحمدي

export type DeliveryType = 'STANDARD' | 'SAME_DAY' | 'INSTANT' | 'SELF_PICKUP';

export interface GovernorateInfo {
    nameAr: string;
    nameEn: string;
    standard: number;    // KWD
    sameDay: number;     // KWD
    instant: number;     // KWD
    etaStandardDays: { min: number; max: number };
    etaSameDayHours: { min: number; max: number };
    etaInstantMins: { min: number; max: number };
}

const GOVERNORATE_RATES: Record<KuwaitGovernorate, GovernorateInfo> = {
    ASIMAH: {
        nameAr: 'العاصمة',
        nameEn: 'Asimah (Capital)',
        standard: 0.500,
        sameDay: 1.000,
        instant: 2.000,
        etaStandardDays: { min: 1, max: 1 },
        etaSameDayHours: { min: 2, max: 6 },
        etaInstantMins: { min: 30, max: 90 },
    },
    HAWALLI: {
        nameAr: 'حولي',
        nameEn: 'Hawalli',
        standard: 0.500,
        sameDay: 1.000,
        instant: 2.000,
        etaStandardDays: { min: 1, max: 1 },
        etaSameDayHours: { min: 2, max: 6 },
        etaInstantMins: { min: 30, max: 90 },
    },
    FARWANIYA: {
        nameAr: 'الفروانية',
        nameEn: 'Farwaniya',
        standard: 0.750,
        sameDay: 1.250,
        instant: 2.500,
        etaStandardDays: { min: 1, max: 2 },
        etaSameDayHours: { min: 3, max: 8 },
        etaInstantMins: { min: 45, max: 120 },
    },
    JAHRA: {
        nameAr: 'الجهراء',
        nameEn: 'Jahra',
        standard: 1.000,
        sameDay: 1.750,
        instant: 3.000,
        etaStandardDays: { min: 1, max: 2 },
        etaSameDayHours: { min: 4, max: 8 },
        etaInstantMins: { min: 60, max: 150 },
    },
    MUBARAK_AL_KABEER: {
        nameAr: 'مبارك الكبير',
        nameEn: 'Mubarak Al-Kabeer',
        standard: 0.750,
        sameDay: 1.250,
        instant: 2.500,
        etaStandardDays: { min: 1, max: 2 },
        etaSameDayHours: { min: 3, max: 8 },
        etaInstantMins: { min: 45, max: 120 },
    },
    AHMADI: {
        nameAr: 'الأحمدي',
        nameEn: 'Ahmadi',
        standard: 1.000,
        sameDay: 1.750,
        instant: 3.000,
        etaStandardDays: { min: 1, max: 2 },
        etaSameDayHours: { min: 4, max: 8 },
        etaInstantMins: { min: 60, max: 150 },
    },
};

export interface ShippingCalculationResult {
    governorate: KuwaitGovernorate;
    governorateNameAr: string;
    deliveryType: DeliveryType;
    feeKwd: number;
    isFreeShipping: boolean;
    etaLabel: string;   // Human-readable Arabic ETA string
}

@Injectable()
export class ShippingService {
    /** Orders above this amount qualify for free standard shipping */
    private readonly FREE_SHIPPING_THRESHOLD_KWD = 10;

    /**
     * Calculate shipping fee for a Kuwait order.
     * @param governorate - Kuwait governorate enum value
     * @param deliveryType - STANDARD | SAME_DAY | INSTANT | SELF_PICKUP
     * @param orderSubtotalKwd - Order subtotal in KWD (for free-shipping check)
     */
    /**
     * Returns just the fee (KWD) for a given governorate + delivery type.
     * Useful for quick fee display in the UI before committing to full calculate().
     */
    getRate(governorate: KuwaitGovernorate, deliveryType: DeliveryType): number {
        if (deliveryType === 'SELF_PICKUP') return 0;
        const rates = GOVERNORATE_RATES[governorate];
        if (!rates) throw new BadRequestException(`محافظة غير معروفة: ${governorate}`);
        switch (deliveryType) {
            case 'STANDARD': return rates.standard;
            case 'SAME_DAY': return rates.sameDay;
            case 'INSTANT': return rates.instant;
            default: return rates.standard;
        }
    }

    calculate(
        governorate: KuwaitGovernorate,
        deliveryType: DeliveryType,
        orderSubtotalKwd: number,
    ): ShippingCalculationResult {
        // Guard: validate governorate exists in our rate table
        if (!GOVERNORATE_RATES[governorate]) {
            throw new BadRequestException(
                `محافظة غير معروفة: "${governorate}". المحافظات المدعومة: ${Object.keys(GOVERNORATE_RATES).join(', ')}`,
            );
        }

        // Self-pickup is always free
        if (deliveryType === 'SELF_PICKUP') {
            return {
                governorate,
                governorateNameAr: GOVERNORATE_RATES[governorate].nameAr,
                deliveryType,
                feeKwd: 0,
                isFreeShipping: true,
                etaLabel: 'استلام من المستودع',
            };
        }

        const rates = GOVERNORATE_RATES[governorate];

        // Free shipping only applies to standard delivery
        const qualifiesForFree =
            deliveryType === 'STANDARD' &&
            orderSubtotalKwd >= this.FREE_SHIPPING_THRESHOLD_KWD;

        if (qualifiesForFree) {
            return {
                governorate,
                governorateNameAr: rates.nameAr,
                deliveryType,
                feeKwd: 0,
                isFreeShipping: true,
                etaLabel: this.buildEtaLabel(deliveryType, rates),
            };
        }

        let feeKwd: number;
        switch (deliveryType) {
            case 'STANDARD': feeKwd = rates.standard; break;
            case 'SAME_DAY': feeKwd = rates.sameDay; break;
            case 'INSTANT': feeKwd = rates.instant; break;
            default: feeKwd = rates.standard;
        }

        return {
            governorate,
            governorateNameAr: rates.nameAr,
            deliveryType,
            feeKwd,
            isFreeShipping: false,
            etaLabel: this.buildEtaLabel(deliveryType, rates),
        };
    }

    private buildEtaLabel(type: DeliveryType, rates: GovernorateInfo): string {
        switch (type) {
            case 'STANDARD':
                if (rates.etaStandardDays.min === rates.etaStandardDays.max) {
                    return `خلال ${rates.etaStandardDays.min} يوم عمل`;
                }
                return `خلال ${rates.etaStandardDays.min}–${rates.etaStandardDays.max} أيام عمل`;
            case 'SAME_DAY':
                return `نفس اليوم خلال ${rates.etaSameDayHours.min}–${rates.etaSameDayHours.max} ساعات`;
            case 'INSTANT':
                return `توصيل فوري خلال ${rates.etaInstantMins.min}–${rates.etaInstantMins.max} دقيقة`;
            case 'SELF_PICKUP':
                return 'استلام من المستودع';
        }
    }

    /** Returns all governorates with their display names */
    getGovernorates(): Array<{ value: KuwaitGovernorate; nameAr: string; nameEn: string }> {
        return (Object.entries(GOVERNORATE_RATES) as [KuwaitGovernorate, GovernorateInfo][]).map(
            ([key, val]) => ({ value: key, nameAr: val.nameAr, nameEn: val.nameEn }),
        );
    }

    /** Returns delivery types with Arabic labels */
    getDeliveryTypes(): Array<{ value: DeliveryType; nameAr: string; desc: string }> {
        return [
            { value: 'STANDARD', nameAr: 'توصيل عادي', desc: 'يوم إلى يومين عمل' },
            { value: 'SAME_DAY', nameAr: 'توصيل في نفس اليوم', desc: 'خلال 2-8 ساعات' },
            { value: 'INSTANT', nameAr: 'توصيل فوري', desc: 'خلال 30-150 دقيقة' },
            { value: 'SELF_PICKUP', nameAr: 'استلام من المستودع', desc: 'مجاني — استلم بنفسك' },
        ];
    }
}
