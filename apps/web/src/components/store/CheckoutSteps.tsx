'use client';

/**
 * CheckoutSteps — Multi-step checkout for Kuwait market.
 * الديرة باك — Aldeera Pack
 *
 * Step 1: Delivery Address (Kuwait governorates + Kuwaiti address format)
 * Step 2: Shipping type (Standard / Same-Day / Instant / Self-Pickup)
 * Step 3: Payment method (KNET / Pay Deema / Apple Pay / Visa-MC / COD)
 * Step 4: Order review + place order
 */
import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cart.store';
import { useAuthStore } from '@/store/auth.store';
import { useSearchParams } from 'next/navigation';
import { MapPin, Truck, CreditCard, CheckCircle, Tag, Plus, Package, ShoppingBag, Loader2 } from 'lucide-react';
import apiClient from '@/lib/api-client';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import {
    KUWAIT_GOVERNORATES, DELIVERY_TYPES, PAYMENT_METHODS_KW,
    COD_FEE_KWD, FREE_SHIPPING_THRESHOLD_KWD, INSTANT_DELIVERY_CUTOFF_HOUR,
    formatKwd,
    type KuwaitGovernorateValue, type DeliveryTypeValue, type PaymentMethodKw,
} from '@/lib/constants';

// ── Types ──────────────────────────────────────────────────────────────────

interface KuwaitAddress {
    fullName: string;
    phone: string;
    block: string;
    street: string;
    building: string;
    floor: string;
    apartment: string;
    area: string;
    governorate: KuwaitGovernorateValue;
    deliveryNotes: string;
}

interface ShippingInfo {
    feeKwd: number;
    isFreeShipping: boolean;
    etaLabel: string;
}

const STEPS = [
    { id: 1, label: 'العنوان', icon: <MapPin className="w-4 h-4" /> },
    { id: 2, label: 'التوصيل', icon: <Truck className="w-4 h-4" /> },
    { id: 3, label: 'الدفع', icon: <CreditCard className="w-4 h-4" /> },
    { id: 4, label: 'المراجعة', icon: <CheckCircle className="w-4 h-4" /> },
];

/**
 * Returns true if running in Safari / Apple device (Apple Pay availability check).
 * Server-side rendering safe — defaults to false on SSR.
 */
function isApplePayAvailable(): boolean {
    if (typeof window === 'undefined') return false;
    return !!(window as any).ApplePaySession;
}

export default function CheckoutSteps() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const orderId = searchParams?.get('orderId');

    const { items: cartItems, subtotal: cartSubtotal, clearCart } = useCartStore();
    const { isAuthenticated } = useAuthStore();
    const [step, setStep] = useState(1);
    const [existingOrder, setExistingOrder] = useState<any>(null);
    const [isReorderMode, setIsReorderMode] = useState(false);

    const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string>('NEW');
    const [saveToAccount, setSaveToAccount] = useState(false);

    const [address, setAddress] = useState<KuwaitAddress>({
        fullName: '', phone: '', block: '', street: '',
        building: '', floor: '', apartment: '', area: '',
        governorate: 'ASIMAH', deliveryNotes: '',
    });
    const [deliveryType, setDeliveryType] = useState<DeliveryTypeValue>('STANDARD');
    const [shippingInfo, setShippingInfo] = useState<ShippingInfo | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethodKw>('KNET');
    const [placing, setPlacing] = useState(false);
    const [applePayAvailable, setApplePayAvailable] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; pct: number } | null>(null);

    // Mode detection & Initial Fetch
    useEffect(() => {
        if (orderId && isAuthenticated) {
            setIsReorderMode(true);
            setLoadingOrder(true);
            apiClient.get(`/orders/${orderId}`)
                .then(res => {
                    const order = res.data;
                    setExistingOrder(order);
                    // Pre-fill fields from order
                    if (order.address) {
                        setSelectedAddressId(order.addressId);
                        setAddress(order.address);
                    }
                    if (order.paymentMethod) setPaymentMethod(order.paymentMethod as any);
                    if (order.shippingType) setDeliveryType(order.shippingType as any);
                    // Subscription reorder goes to payment
                    setStep(3);
                    calculateShipping();
                })
                .catch(() => {
                    toast.error('لم نتمكن من العثور على هذا الطلب');
                    router.push('/checkout');
                })
                .finally(() => setLoadingOrder(false));
            return;
        }

        if (!isAuthenticated) return;
        apiClient.get('/users/me/referral')
            .then(res => {
                const coupons = res.data?.availableCoupons;
                if (coupons && coupons.length > 0) {
                    setCouponCode(coupons[0].code);
                    setAppliedDiscount({ code: coupons[0].code, pct: coupons[0].discountPct });
                }
            })
            .catch(() => { });

        // Fetch saved addresses
        apiClient.get('/addresses/me')
            .then(res => {
                setSavedAddresses(res.data);
                if (res.data.length > 0) {
                    const def = res.data.find((a: any) => a.isDefault) || res.data[0];
                    setSelectedAddressId(def.id);
                    setAddress(def);
                }
            })
            .catch(() => { });
    }, [isAuthenticated, orderId, router]);

    const [loadingOrder, setLoadingOrder] = useState(false);

    // Detect Apple Pay availability client-side after hydration
    useEffect(() => {
        setApplePayAvailable(isApplePayAvailable());
    }, []);

    // Normalized data
    const items = isReorderMode && existingOrder ? existingOrder.items.map((i: any) => ({
        ...i,
        nameAr: i.productNameAr,
        price: i.priceAtPurchase,
        quantity: i.quantity,
        image: i.product?.images?.[0]
    })) : cartItems;

    const sub = isReorderMode && existingOrder ? Number(existingOrder.subtotal) : cartSubtotal();
    const discountValue = isReorderMode && existingOrder ? Number(existingOrder.discountAmount) : (appliedDiscount ? (sub * appliedDiscount.pct) / 100 : 0);
    const codFee = paymentMethod === 'CASH_ON_DELIVERY' ? COD_FEE_KWD : 0;
    const shippingFee = shippingInfo?.feeKwd ?? 0;
    const total = sub - discountValue + shippingFee + codFee;

    // Check if instant delivery is past cutoff hour (Kuwait local time)
    const isInstantUnavailable = (): boolean => {
        const kwHour = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Kuwait',
            hour: 'numeric',
            hour12: false,
        });
        return parseInt(kwHour, 10) >= INSTANT_DELIVERY_CUTOFF_HOUR;
    };

    // Helper: addr field setter
    const setAddr = (field: keyof KuwaitAddress, val: string) =>
        setAddress((prev) => ({ ...prev, [field]: val }));

    const calculateShipping = async () => {
        try {
            const { data } = await apiClient.post('/shipping/calculate', {
                governorate: address.governorate,
                deliveryType,
                orderSubtotalKwd: sub,
            });
            setShippingInfo(data);
        } catch {
            // Fallback: derive locally from constants if API unavailable
            const isFree = deliveryType === 'STANDARD' && sub >= FREE_SHIPPING_THRESHOLD_KWD;
            setShippingInfo({
                feeKwd: isFree ? 0 : (deliveryType === 'SAME_DAY' ? 1.000 : 0.500),
                isFreeShipping: isFree,
                etaLabel: 'يوم عمل',
            });
        }
    };

    const placeOrder = async () => {
        if (selectedAddressId === 'NEW' && saveToAccount && savedAddresses.length >= 4) {
            toast.error('الحد الأقصى للعناوين المحفوظة هو 4 عناوين فقط.');
            return;
        }

        setPlacing(true);
        try {
            if (isReorderMode && existingOrder) {
                // UPDATE existing order
                await apiClient.patch(`/orders/${existingOrder.id}`, {
                    paymentMethod,
                    addressId: selectedAddressId !== 'NEW' ? selectedAddressId : undefined,
                    shippingType: deliveryType,
                    shippingFee,
                    codFee,
                    totalAmount: total,
                });
            } else {
                // CREATE new order
                await apiClient.post('/orders', {
                    items: items.map((i: any) => ({ productId: i.id || i.productId, quantity: i.quantity })),
                    paymentMethod,
                    shippingType: deliveryType,
                    shippingFee: shippingFee,
                    codFee,
                    couponCode: appliedDiscount?.code || undefined,
                    deliveryNotes: address.deliveryNotes || undefined,
                    addressId: selectedAddressId !== 'NEW' ? selectedAddressId : undefined,
                    address: selectedAddressId === 'NEW' ? {
                        fullName: address.fullName,
                        phone: address.phone,
                        governorate: address.governorate,
                        area: address.area,
                        block: address.block,
                        street: address.street,
                        building: address.building,
                        floor: address.floor || undefined,
                        apartment: address.apartment || undefined,
                    } : undefined,
                });
            }

            // If user checked "Save Address"
            if (isAuthenticated && selectedAddressId === 'NEW' && saveToAccount) {
                try {
                    await apiClient.post('/addresses/me', address);
                } catch (e) {
                    console.error('Failed to save address', e);
                }
            }

            clearCart();
            toast.success('🎉 تم تأكيد طلبك بنجاح!');
            router.push('/account'); // Orders are usually in account area
        } catch (err: any) {
            toast.error(err.response?.data?.message ?? 'فشل في إتمام الطلب');
        } finally { setPlacing(false); }
    };

    // Filter payment methods: hide Apple Pay on non-Apple devices
    const availablePaymentMethods = PAYMENT_METHODS_KW.filter(
        (pm) => pm.id !== 'APPLE_PAY' || applePayAvailable,
    );

    // Filter delivery types: warn if INSTANT past cutoff
    const instantDisabled = isInstantUnavailable();

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">

            {/* ── Step Indicator ── */}
            <div className="flex items-center justify-center mb-8 gap-0">
                {loadingOrder ? (
                    <div className="flex items-center gap-2 text-gray-400">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>جاري تحميل بيانات الطلب...</span>
                    </div>
                ) : STEPS.map((s, idx) => (
                    <div key={s.id} className="flex items-center">
                        <button
                            onClick={() => step > s.id && setStep(s.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${step === s.id
                                ? 'bg-brand-500 text-white shadow-md shadow-brand-200'
                                : step > s.id
                                    ? `bg-brand-100 text-brand-600 transition-all ${isReorderMode ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-brand-200'}`
                                    : 'bg-gray-100 text-gray-400 cursor-default'
                                }`}
                        >
                            {s.icon} {s.label}
                        </button>
                        {idx < STEPS.length - 1 && (
                            <div className={`w-8 h-0.5 ${step > s.id ? 'bg-brand-300' : 'bg-gray-200'}`} />
                        )}
                    </div>
                ))}
            </div>

            {/* ── STEP 1: Kuwait Address ── */}
            {step === 1 && !loadingOrder && (
                <div className="card p-6 space-y-4 animate-slide-up">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-brand-500" /> عنوان التسليم
                    </h2>

                    {isAuthenticated && savedAddresses.length > 0 && (
                        <div className="space-y-3 mb-6">
                            {savedAddresses.map(addr => (
                                <label key={addr.id} className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer ${selectedAddressId === addr.id ? 'border-brand-400 bg-brand-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                    <input type="radio" name="addressSelect" value={addr.id} checked={selectedAddressId === addr.id}
                                        onChange={() => {
                                            setSelectedAddressId(addr.id);
                                            setAddress(addr);
                                        }} className="w-4 h-4 mt-1 accent-brand-500" />
                                    <div>
                                        <p className="font-semibold text-gray-900">{addr.fullName} <span className="text-sm font-normal text-gray-500" dir="ltr">({addr.phone})</span></p>
                                        <p className="text-sm text-gray-600 mt-0.5">
                                            {KUWAIT_GOVERNORATES.find(g => g.value === addr.governorate)?.nameAr} — {addr.area}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            ق. {addr.block} — شارع {addr.street} {addr.building ? `مبنى ${addr.building}` : ''}
                                        </p>
                                    </div>
                                </label>
                            ))}
                            <label className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer ${selectedAddressId === 'NEW' ? 'border-brand-400 bg-brand-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                <input type="radio" name="addressSelect" value="NEW" checked={selectedAddressId === 'NEW'}
                                    onChange={() => {
                                        setSelectedAddressId('NEW');
                                        setAddress({
                                            fullName: '', phone: '', block: '', street: '',
                                            building: '', floor: '', apartment: '', area: '',
                                            governorate: 'ASIMAH', deliveryNotes: ''
                                        });
                                    }} className="w-4 h-4 accent-brand-500" />
                                <div className="font-semibold text-gray-900 flex items-center gap-2">
                                    <Plus className="w-4 h-4" /> إضافة عنوان جديد
                                </div>
                            </label>
                        </div>
                    )}

                    {selectedAddressId === 'NEW' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">الاسم الكامل</label>
                                <input className="input" placeholder="أحمد الكويتي" value={address.fullName}
                                    onChange={(e) => setAddr('fullName', e.target.value)} />
                            </div>
                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">رقم الجوال</label>
                                <input className="input" placeholder="9XXXXXXX" value={address.phone} dir="ltr"
                                    onChange={(e) => setAddr('phone', e.target.value)} />
                            </div>
                            {/* Governorate */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">المحافظة</label>
                                <select className="input" value={address.governorate}
                                    onChange={(e) => setAddr('governorate', e.target.value)}>
                                    {KUWAIT_GOVERNORATES.map((g) => (
                                        <option key={g.value} value={g.value}>{g.nameAr}</option>
                                    ))}
                                </select>
                            </div>
                            {/* Area */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">المنطقة / الحي</label>
                                <input className="input" placeholder="الشويخ" value={address.area}
                                    onChange={(e) => setAddr('area', e.target.value)} />
                            </div>
                            {/* Block */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">رقم القطعة</label>
                                <input className="input" placeholder="5" value={address.block} dir="ltr"
                                    onChange={(e) => setAddr('block', e.target.value)} />
                            </div>
                            {/* Street */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">اسم / رقم الشارع</label>
                                <input className="input" placeholder="شارع 12" value={address.street}
                                    onChange={(e) => setAddr('street', e.target.value)} />
                            </div>
                            {/* Building */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">رقم المبنى</label>
                                <input className="input" placeholder="3" value={address.building} dir="ltr"
                                    onChange={(e) => setAddr('building', e.target.value)} />
                            </div>
                            {/* Floor */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">الطابق (اختياري)</label>
                                <input className="input" placeholder="2" value={address.floor} dir="ltr"
                                    onChange={(e) => setAddr('floor', e.target.value)} />
                            </div>
                            {/* Apartment */}
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">رقم الشقة (اختياري)</label>
                                <input className="input" placeholder="7" value={address.apartment} dir="ltr"
                                    onChange={(e) => setAddr('apartment', e.target.value)} />
                            </div>
                            {/* Delivery Notes */}
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    تعليمات التوصيل (اختياري)
                                </label>
                                <textarea
                                    className="input resize-none"
                                    rows={2}
                                    placeholder="مثال: رن الجرس مرتين، أترك الطرد عند الباب..."
                                    value={address.deliveryNotes}
                                    onChange={(e) => setAddr('deliveryNotes', e.target.value)}
                                />
                            </div>
                            {isAuthenticated && (
                                <div className="sm:col-span-2 mt-2">
                                    <div className={`flex items-center gap-2 ${savedAddresses.length >= 4 ? 'opacity-50' : ''}`}>
                                        <input type="checkbox" id="saveAccount" checked={saveToAccount}
                                            disabled={savedAddresses.length >= 4}
                                            onChange={(e) => setSaveToAccount(e.target.checked)}
                                            className="w-4 h-4 accent-brand-500 rounded border-gray-300 disabled:cursor-not-allowed" />
                                        <label htmlFor="saveAccount" className="text-sm text-gray-700 cursor-pointer select-none">
                                            حفظ هذا العنوان في حسابي للطلبات القادمة
                                        </label>
                                    </div>
                                    {savedAddresses.length >= 4 && (
                                        <p className="text-xs text-red-500 mt-1">
                                            لقد وصلت للحد الأقصى للعناوين المحفوظة (4 عناوين). لا يمكنك حفظ المزيد.
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    <button
                        onClick={() => { setStep(2); calculateShipping(); }}
                        disabled={!address.fullName || !address.phone || !address.street || !address.area}
                        className="btn-primary w-full mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        التالي — اختر طريقة التوصيل
                    </button>
                </div>
            )}

            {/* ── STEP 2: Delivery Type ── */}
            {step === 2 && !loadingOrder && (
                <div className="card p-6 space-y-4 animate-slide-up">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Truck className="w-5 h-5 text-brand-500" /> طريقة التوصيل
                    </h2>

                    <div className="space-y-3">
                        {DELIVERY_TYPES.map((dt) => {
                            const disabled = dt.value === 'INSTANT' && instantDisabled;
                            return (
                                <label
                                    key={dt.value}
                                    className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${disabled
                                        ? 'opacity-50 cursor-not-allowed border-gray-100 bg-gray-50'
                                        : deliveryType === dt.value
                                            ? 'border-brand-400 bg-brand-50 cursor-pointer'
                                            : 'border-gray-200 hover:border-gray-300 cursor-pointer'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="delivery"
                                        value={dt.value}
                                        checked={deliveryType === dt.value}
                                        disabled={disabled}
                                        onChange={() => { setDeliveryType(dt.value as DeliveryTypeValue); setShippingInfo(null); }}
                                        className="w-4 h-4 accent-brand-500"
                                    />
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-900">{dt.nameAr}</p>
                                        <p className="text-sm text-gray-500">
                                            {disabled ? `⛔ غير متاح بعد الساعة ${INSTANT_DELIVERY_CUTOFF_HOUR}:00` : dt.desc}
                                        </p>
                                    </div>
                                    {dt.value === 'SELF_PICKUP' && (
                                        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">مجاني</span>
                                    )}
                                </label>
                            );
                        })}
                    </div>

                    {/* Shipping fee result */}
                    {shippingInfo && (
                        <div className="bg-brand-50 border border-brand-200 rounded-xl p-4 text-sm space-y-1">
                            <p className="font-semibold text-brand-800">
                                رسوم التوصيل:{' '}
                                {shippingInfo.isFreeShipping
                                    ? <span className="text-green-600">مجاني 🎉</span>
                                    : formatKwd(shippingInfo.feeKwd)
                                }
                            </p>
                            <p className="text-brand-600">{shippingInfo.etaLabel}</p>
                        </div>
                    )}

                    {sub >= FREE_SHIPPING_THRESHOLD_KWD && deliveryType === 'STANDARD' && (
                        <p className="text-sm text-green-600 bg-green-50 rounded-lg p-3">
                            🎉 طلبك يستحق التوصيل المجاني للتوصيل العادي (الطلبات فوق {FREE_SHIPPING_THRESHOLD_KWD} د.ك)
                        </p>
                    )}

                    <div className="flex gap-3">
                        <button onClick={() => setStep(1)} className="btn-ghost">السابق</button>
                        <button
                            onClick={() => calculateShipping().then(() => setStep(3))}
                            className="btn-primary flex-1"
                        >
                            التالي — طريقة الدفع
                        </button>
                    </div>
                </div>
            )}

            {/* ── STEP 3: Payment ── */}
            {step === 3 && !loadingOrder && (
                <div className="card p-6 space-y-4 animate-slide-up">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-brand-500" /> طريقة الدفع
                    </h2>

                    {/* Apple Pay availability note */}
                    {!applePayAvailable && (
                        <p className="text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2">
                            Apple Pay متاح فقط على أجهزة Apple مع Safari.
                        </p>
                    )}

                    <div className="space-y-3">
                        {availablePaymentMethods.map((pm) => (
                            <label
                                key={pm.id}
                                className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === pm.id
                                    ? 'border-brand-400 bg-brand-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <input type="radio" name="payment" value={pm.id} checked={paymentMethod === pm.id}
                                    onChange={() => setPaymentMethod(pm.id as PaymentMethodKw)}
                                    className="w-4 h-4 accent-brand-500" />
                                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                                    {pm.emoji}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">{pm.nameAr}</p>
                                    <p className="text-sm text-gray-500">{pm.desc}</p>
                                </div>
                            </label>
                        ))}
                    </div>

                    {/* COD fee notice */}
                    {paymentMethod === 'CASH_ON_DELIVERY' && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm">
                            <p className="font-medium text-yellow-800">
                                💡 يُضاف رسم الدفع عند الاستلام: {formatKwd(COD_FEE_KWD)}
                            </p>
                            <p className="text-yellow-600 mt-1">
                                سيتم تحصيل المبلغ كاملاً عند تسليم الطلب
                            </p>
                        </div>
                    )}

                    <div className="flex gap-3">
                        <button
                            onClick={() => setStep(2)}
                            disabled={isReorderMode}
                            className={`btn-ghost ${isReorderMode ? 'opacity-0 pointer-events-none' : ''}`}
                        >
                            السابق
                        </button>
                        <button onClick={() => setStep(4)} className="btn-primary flex-1">
                            التالي — مراجعة الطلب
                        </button>
                    </div>
                </div>
            )}

            {/* ── STEP 4: Review ── */}
            {step === 4 && !loadingOrder && (
                <div className="space-y-4 animate-slide-up">
                    {isReorderMode && (
                        <div className="bg-brand-50 border border-brand-200 rounded-2xl p-4 flex items-center gap-3">
                            <ShoppingBag className="w-5 h-5 text-brand-600" />
                            <div className="flex-1">
                                <p className="text-sm font-bold text-brand-800">أنت تكمل طلب باقة شهرية</p>
                                <p className="text-xs text-brand-600">رقم الطلب: #{existingOrder?.id.slice(-6).toUpperCase()}</p>
                            </div>
                        </div>
                    )}
                    <div className="card p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">مراجعة الطلب</h2>

                        {/* Items */}
                        <div className="space-y-3 mb-4">
                            {items.map((item) => (
                                <div key={item.id} className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden relative">
                                        {item.image ? (
                                            <img src={item.image} alt={item.nameAr} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                <Package className="w-5 h-5" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm line-clamp-1">{item.nameAr}</p>
                                        <p className="text-xs text-gray-400">الكمية: {item.quantity}</p>
                                    </div>
                                    <p className="font-semibold text-sm text-gray-900 flex-shrink-0">
                                        {formatKwd(Number(item.price) * item.quantity)}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Address summary */}
                        <div className="bg-gray-50 rounded-xl p-4 mb-4 text-sm">
                            <p className="font-medium text-gray-700 mb-1">📍 عنوان التسليم</p>
                            <p className="text-gray-600">
                                {address.fullName} — {address.area}،{' '}
                                {KUWAIT_GOVERNORATES.find((g) => g.value === address.governorate)?.nameAr}
                            </p>
                            <p className="text-gray-500 text-xs mt-1">
                                ق. {address.block} — شارع {address.street} — مبنى {address.building}
                            </p>
                            {address.deliveryNotes && (
                                <p className="text-gray-400 text-xs mt-1 italic">
                                    💬 {address.deliveryNotes}
                                </p>
                            )}
                        </div>

                        {/* Totals */}
                        <div className="border-t border-gray-100 pt-4 space-y-2">
                            {appliedDiscount && (
                                <div className="bg-green-50 border border-green-100 rounded-lg p-3 mb-3 flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-green-700">
                                        <Tag className="w-4 h-4" />
                                        <span className="font-bold text-sm">تم تطبيق كود إحالة ({appliedDiscount.code})</span>
                                    </div>
                                    <span className="text-green-700 font-bold text-sm">-{appliedDiscount.pct}%</span>
                                </div>
                            )}

                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">المجموع الفرعي</span>
                                <span>{formatKwd(sub)}</span>
                            </div>

                            {appliedDiscount && (
                                <div className="flex justify-between text-sm text-green-600 font-medium">
                                    <span>الخصم</span>
                                    <span>-{formatKwd(discountValue)}</span>
                                </div>
                            )}

                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">رسوم التوصيل</span>
                                <span className={shippingInfo?.isFreeShipping ? 'text-green-600 font-medium' : ''}>
                                    {shippingInfo?.isFreeShipping ? 'مجاني 🎉' : formatKwd(shippingFee)}
                                </span>
                            </div>
                            {codFee > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">رسم الدفع عند الاستلام</span>
                                    <span>{formatKwd(codFee)}</span>
                                </div>
                            )}
                            <div className="flex justify-between font-bold text-lg border-t border-gray-100 pt-3 mt-1">
                                <span>الإجمالي</span>
                                <span className="text-brand-600">{formatKwd(total)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => setStep(3)}
                            disabled={isReorderMode}
                            className={`btn-ghost ${isReorderMode ? 'opacity-0 pointer-events-none' : ''}`}
                        >
                            السابق
                        </button>
                        <button
                            onClick={placeOrder}
                            disabled={placing}
                            className="btn-primary flex-1 text-center disabled:opacity-50"
                        >
                            {placing ? 'جاري إتمام الطلب...' : `تأكيد الطلب — ${formatKwd(total)}`}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
