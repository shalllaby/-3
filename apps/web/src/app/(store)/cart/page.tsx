'use client';

import { useCartStore } from '@/store/cart.store';
import { useAuthStore } from '@/store/auth.store';
import { formatKwd, FREE_SHIPPING_THRESHOLD_KWD } from '@/lib/constants';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, ShoppingBag, ArrowLeft, Minus, Plus, Truck, Share2, Copy, CheckCheck, Users, Gift } from 'lucide-react';
import { useState, useEffect } from 'react';
import apiClient from '@/lib/api-client';

interface ReferralStatus {
    referralCode: string | null;
    referralCount: number;
    countTowardNext: number;  // 0–4 — progress toward next milestone of 5
    neededForNext: number;    // 5 minus countTowardNext
    availableCoupons: { code: string; discountPct: number; expiresAt: string }[];
}

export default function CartPage() {
    const { items, updateQuantity, removeItem, subtotal, itemCount } = useCartStore();
    const { token, isAuthenticated } = useAuthStore();
    const [copied, setCopied] = useState(false);
    const [referral, setReferral] = useState<ReferralStatus | null>(null);

    // Fetch live referral status when user is authenticated
    useEffect(() => {
        if (!isAuthenticated || !token) return;
        apiClient.get('/users/me/referral')
            .then(res => setReferral(res.data))
            .catch(() => { /* silently ignore if API is offline */ });
    }, [isAuthenticated, token]);

    const referralLink = referral?.referralCode
        ? `${typeof window !== 'undefined' ? window.location.origin : 'https://anharaldeerak.kw'}?ref=${referral.referralCode}`
        : '';
    const countTowardNext = referral?.countTowardNext ?? 0;
    const referralCount = referral?.referralCount ?? 0;

    const sub = subtotal();
    const count = itemCount();
    const isFreeShipping = sub >= FREE_SHIPPING_THRESHOLD_KWD;
    const remainingForFreeShipping = FREE_SHIPPING_THRESHOLD_KWD - sub;

    if (items.length === 0) {
        return (
            <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-24 h-24 bg-brand-50 rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag className="w-12 h-12 text-brand-500" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">سلة التسوق فارغة</h1>
                <p className="text-gray-500 mb-8 max-w-sm">يبدو أنك لم تضف أي منتجات إلى سلتك بعد. ابدأ التسوق الآن!</p>
                <Link
                    href="/products"
                    className="bg-brand-600 text-white font-bold py-3 px-8 rounded-2xl hover:bg-brand-700 transition-all shadow-lg shadow-brand-100"
                >
                    تصفح المنتجات
                </Link>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 py-8 lg:py-12">
            <div className="max-w-7xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">سلة التسوق ({count})</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* ── ITEMS LIST ────────────────────────────────────────── */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Free Shipping Progress */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isFreeShipping ? 'bg-green-50 text-green-600' : 'bg-brand-50 text-brand-600'}`}>
                                    <Truck className="w-5 h-5" />
                                </div>
                                <div>
                                    {isFreeShipping ? (
                                        <p className="font-bold text-green-600">تهانيا! طلبك مؤهل للتوصيل المجاني 🎉</p>
                                    ) : (
                                        <p className="font-semibold text-gray-700">
                                            أضف <span className="text-brand-600">{formatKwd(remainingForFreeShipping)}</span> للحصول على توصيل مجاني
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-500 ${isFreeShipping ? 'bg-green-500' : 'bg-brand-500'}`}
                                    style={{ width: `${Math.min((sub / FREE_SHIPPING_THRESHOLD_KWD) * 100, 100)}%` }}
                                />
                            </div>
                        </div>

                        {/* ── Referral Banner ── */}
                        {isAuthenticated && referralLink && (
                            <div className="bg-gradient-to-br from-brand-600 to-brand-700 rounded-3xl p-6 shadow-xl shadow-brand-200/40 text-white">
                                <div className="flex items-start gap-4 mb-5">
                                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                                        <Share2 className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-lg leading-snug mb-1">
                                            اكسب خصم 5% على فاتورتك القادمة!
                                        </h3>
                                        <p className="text-brand-100 text-sm leading-relaxed">
                                            شارك رابط المتجر مع 5 من أصدقائك واحصل على خصم 5% على إجمالي فاتورتك القادمة
                                        </p>
                                    </div>
                                </div>

                                {/* Progress — resets every 5 referrals */}
                                <div className="mb-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-bold text-brand-200 flex items-center gap-1.5">
                                            <Users className="w-3.5 h-3.5" />
                                            عدد الإحالات الحالية: {countTowardNext}/5
                                        </span>
                                        {countTowardNext === 0 && referralCount > 0 && (
                                            <span className="text-xs font-black text-yellow-300">🎉 استحققت الخصم!</span>
                                        )}
                                    </div>
                                    <div className="w-full h-2.5 bg-white/20 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-white rounded-full transition-all duration-700"
                                            style={{ width: `${(countTowardNext / 5) * 100}%` }}
                                        />
                                    </div>
                                    <p className="text-[11px] text-brand-200 mt-1.5">
                                        {countTowardNext < 5
                                            ? `تبقى ${referral?.neededForNext ?? 5} إحالة للحصول على كوبون الخصم`
                                            : 'أحسنت! ستصلك كوبون خصم جديد.'}
                                    </p>
                                </div>

                                {/* Available Coupons */}
                                {(referral?.availableCoupons?.length ?? 0) > 0 && (
                                    <div className="mb-4 bg-white/10 border border-white/20 rounded-2xl p-3.5 flex items-center gap-3">
                                        <Gift className="w-5 h-5 text-yellow-300 flex-shrink-0" />
                                        <div>
                                            <p className="text-xs font-black text-yellow-300">لديك كوبون خصم متاح!</p>
                                            <p className="text-xs text-white/80 mt-0.5">
                                                استخدم الكود <span className="font-mono font-black tracking-widest text-white">{referral!.availableCoupons[0].code}</span> عند الدفع لخصم {referral!.availableCoupons[0].discountPct}%
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Link + Copy */}
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={referralLink}
                                        readOnly
                                        dir="ltr"
                                        className="flex-1 bg-white/15 border border-white/20 rounded-xl px-3 py-2.5 text-xs text-white placeholder-white/40 outline-none select-all truncate"
                                    />
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(referralLink);
                                            setCopied(true);
                                            setTimeout(() => setCopied(false), 2500);
                                        }}
                                        className="flex items-center gap-1.5 bg-white text-brand-700 font-black text-xs px-4 py-2.5 rounded-xl hover:bg-brand-50 transition-all flex-shrink-0 active:scale-95"
                                    >
                                        {copied ? <CheckCheck className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                                        {copied ? 'تم النسخ!' : 'نسخ الرابط'}
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden text-right">
                            <div className="divide-y divide-gray-50">
                                {items.map((item) => (
                                    <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 items-center sm:items-start text-right">
                                        <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0">
                                            {item.image ? (
                                                <Image src={item.image} alt={item.nameAr} fill className="object-cover" />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-gray-300">🧴</div>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0 flex flex-col gap-1 w-full text-right">
                                            <Link href={`/products/${item.id}`} className="font-bold text-gray-900 hover:text-brand-600 transition-colors text-lg truncate block">
                                                {item.nameAr}
                                            </Link>
                                            <p className="text-xs text-gray-400">SKU: {item.sku}</p>

                                            <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                                                <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-1 border border-gray-100">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white text-gray-600 transition-colors"
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    <span className="text-sm font-bold text-gray-900 w-6 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white text-gray-600 transition-colors"
                                                        disabled={item.quantity >= item.maxQuantity}
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                <div className="flex flex-col items-end">
                                                    <span className="text-lg font-bold text-brand-600">
                                                        {formatKwd((item.discountPrice || item.price) * item.quantity)}
                                                    </span>
                                                    {item.quantity > 1 && (
                                                        <span className="text-xs text-gray-400">
                                                            سعر الحبة: {formatKwd(item.discountPrice || item.price)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="sm:mr-4 p-2 text-gray-400 hover:text-red-500 transition-colors"
                                            title="حذف"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ── SUMMARY ───────────────────────────────────────────── */}
                    <div className="space-y-4">
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-24">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">ملخص الطلب</h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between items-center text-gray-500">
                                    <span>المجموع الفرعي ({count} منتج)</span>
                                    <span className="font-medium">{formatKwd(sub)}</span>
                                </div>
                                <div className="flex justify-between items-center text-gray-500">
                                    <span>رسوم التوصيل</span>
                                    {isFreeShipping ? (
                                        <span className="text-green-600 font-bold">مجاني 🎉</span>
                                    ) : (
                                        <span className="text-gray-900">سيحدد عند الدفع</span>
                                    )}
                                </div>
                                <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                                    <span className="text-lg font-bold text-gray-900">الإجمالي التقريبي</span>
                                    <span className="text-2xl font-black text-brand-600">{formatKwd(sub)}</span>
                                </div>
                            </div>

                            <Link
                                href="/checkout"
                                className="w-full bg-brand-600 text-white font-bold py-4 rounded-2xl hover:bg-brand-700 transition-all shadow-lg shadow-brand-100 flex items-center justify-center gap-2 mb-4"
                            >
                                إتمام الطلب
                                <ArrowLeft className="w-5 h-5 mt-0.5" />
                            </Link>

                            <Link
                                href="/products"
                                className="w-full flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-brand-600 transition-colors font-medium"
                            >
                                مواصلة التسوق
                            </Link>

                            <div className="mt-8 pt-6 border-t border-gray-50 space-y-3">
                                <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest font-bold">نقبل الدفع عبر</p>
                                <div className="flex justify-center gap-3 opacity-60 grayscale hover:grayscale-0 transition-all">
                                    <span title="KNET" className="text-2xl">🏦</span>
                                    <span title="Apple Pay" className="text-2xl">🍎</span>
                                    <span title="Visa/Mastercard" className="text-2xl">💳</span>
                                    <span title="COD" className="text-2xl">💵</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
