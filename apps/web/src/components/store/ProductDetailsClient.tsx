'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import {
    ShoppingCart, Star, ShieldCheck, Truck, RotateCcw,
    Minus, Plus, Heart, Share2, Check, Info, MessageCircle
} from 'lucide-react';
import { useCartStore } from '@/store/cart.store';
import { formatKwd, STORE_WHATSAPP } from '@/lib/constants';
import toast from 'react-hot-toast';

interface ProductAttribute {
    key: string;
    keyAr?: string;
    value: string;
    valueAr?: string;
}

interface Product {
    id: string;
    nameAr: string;
    nameEn: string;
    sku: string;
    price: number;
    discountPrice?: number | null;
    images: string[];
    descriptionAr?: string;
    descriptionEn?: string;
    stockQuantity: number;
    isFeatured?: boolean;
    category?: { id: string; nameAr: string };
    attributes?: ProductAttribute[];
}

interface Props {
    product: Product;
    ratingSummary?: { average: number; total: number };
}

export default function ProductDetailsClient({ product, ratingSummary }: Props) {
    const { addItem, items, updateQuantity } = useCartStore();
    const [selectedImage, setSelectedImage] = useState(0);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'shipping'>('description');

    const cartItem = items.find((i) => i.id === product.id);
    const inCart = cartItem?.quantity ?? 0;
    const isOutOfStock = product.stockQuantity === 0;
    const hasDiscount = product.discountPrice != null && product.discountPrice < product.price;
    const displayPrice = hasDiscount ? product.discountPrice! : product.price;
    const discountPct = hasDiscount ? Math.round(((product.price - product.discountPrice!) / product.price) * 100) : 0;

    const handleAddToCart = () => {
        if (isOutOfStock) return;
        addItem({
            id: product.id,
            nameAr: product.nameAr,
            nameEn: product.nameEn,
            price: product.price,
            discountPrice: product.discountPrice ?? undefined,
            image: product.images?.[0] || '',
            sku: product.sku ?? '',
            maxQuantity: product.stockQuantity,
        });
        toast.success(`تم إضافة "${product.nameAr}" إلى السلة 🛒`);
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: product.nameAr,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success('تم نسخ الرابط!');
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

            {/* ── LEFT: IMAGE GALLERY (5/12 cols) ────────────────────────────────── */}
            <div className="lg:col-span-5 space-y-4">
                <div className="relative aspect-square bg-white rounded-[2.5rem] overflow-hidden shadow-xl shadow-brand-100/20 border border-brand-50 group">
                    {product.images.length > 0 ? (
                        <Image
                            src={product.images[selectedImage]}
                            alt={product.nameAr}
                            fill
                            priority
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300">
                            لا توجد صورة
                        </div>
                    )}

                    {/* Action buttons on image */}
                    <div className="absolute top-6 end-6 flex flex-col gap-3">
                        <button
                            onClick={() => setIsWishlisted(!isWishlisted)}
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all ${isWishlisted ? 'bg-red-500 text-white' : 'bg-white/80 backdrop-blur-md text-gray-600 hover:bg-white'
                                }`}
                        >
                            <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                        </button>
                        <button
                            onClick={handleShare}
                            className="w-12 h-12 rounded-2xl bg-white/80 backdrop-blur-md text-gray-600 flex items-center justify-center shadow-lg hover:bg-white transition-all"
                        >
                            <Share2 className="w-5 h-5" />
                        </button>
                    </div>

                    {hasDiscount && (
                        <div className="absolute top-6 start-6 bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold px-4 py-1.5 rounded-full text-sm shadow-xl animate-bounce">
                            وفّر {discountPct}%
                        </div>
                    )}
                </div>

                {/* Thumbnails */}
                {product.images.length > 1 && (
                    <div className="flex gap-4 overflow-x-auto py-2 scrollbar-hide">
                        {product.images.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedImage(idx)}
                                className={`relative w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 active:scale-95 ${selectedImage === idx ? 'border-brand-500 ring-4 ring-brand-100 shadow-lg' : 'border-transparent hover:border-brand-200 opacity-70 hover:opacity-100'
                                    }`}
                            >
                                <Image src={img} alt={`${product.nameAr} ${idx + 1}`} fill className="object-cover" />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* ── RIGHT: PRODUCT INFO (7/12 cols) ────────────────────────────────── */}
            <div className="lg:col-span-7 flex flex-col">

                {/* Header Info */}
                <div className="mb-6">
                    <nav className="flex items-center gap-2 text-xs font-medium text-gray-400 mb-4 bg-gray-100/50 self-start px-3 py-1 rounded-full">
                        <span className="hover:text-brand-600 cursor-pointer">الرئيسية</span>
                        <span className="text-gray-300">/</span>
                        <span className="hover:text-brand-600 cursor-pointer">{product.category?.nameAr || 'تصنيف'}</span>
                    </nav>

                    <h1 className="text-3xl lg:text-4xl font-black text-gray-900 leading-tight mb-2">
                        {product.nameAr}
                    </h1>

                    <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-0.5 text-yellow-500">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                    key={s}
                                    className={`w-4 h-4 transition-colors ${s <= Math.round(ratingSummary?.average ?? 0)
                                            ? 'fill-current text-yellow-400'
                                            : 'text-gray-200 fill-gray-200'
                                        }`}
                                />
                            ))}
                            {ratingSummary && ratingSummary.total > 0 ? (
                                <span className="text-gray-400 text-xs mr-2">
                                    ({ratingSummary.average.toFixed(1)} • {ratingSummary.total} تقييم)
                                </span>
                            ) : (
                                <span className="text-gray-400 text-xs mr-2">لا توجد تقييمات</span>
                            )}
                        </div>
                        <span className="w-1.5 h-1.5 bg-gray-200 rounded-full hidden sm:block" />
                        <span className="text-xs font-bold text-gray-400">SKU: {product.sku}</span>
                    </div>
                </div>

                {/* Pricing & Status */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-brand-50 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="flex flex-col">
                        <div className="flex items-baseline gap-3">
                            <span className="text-4xl font-black text-brand-600">
                                {formatKwd(displayPrice)}
                            </span>
                            {hasDiscount && (
                                <span className="text-xl text-gray-300 line-through decoration-red-400/30">
                                    {formatKwd(product.price)}
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-brand-400 mt-1 font-medium">الأسعار تشمل ضريبة القيمة المضافة في الكويت</p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                        {isOutOfStock ? (
                            <div className="badge-error animate-pulse px-4 py-2 font-bold !text-sm">❌ نفد من المخزون</div>
                        ) : (
                            <>
                                <div className={`badge-success px-4 py-2 font-bold !text-sm ${product.stockQuantity < 10 ? 'bg-orange-100 text-orange-700' : ''}`}>
                                    {product.stockQuantity < 10 ? `⚠️ متبقي ${product.stockQuantity} فقط!` : '✅ متوفر في المخزون'}
                                </div>
                                <p className="text-[10px] text-gray-400 text-end">يتم التوصيل خلال 24 ساعة في الكويت 🇰🇼</p>
                            </>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mb-10">
                    <div className="flex-1">
                        {inCart > 0 ? (
                            <div className="grid grid-cols-3 items-center bg-brand-50 rounded-2xl p-1.5 border-2 border-brand-500 transition-all">
                                <button
                                    onClick={() => updateQuantity(product.id, inCart - 1)}
                                    className="h-12 flex items-center justify-center rounded-xl bg-white text-brand-600 hover:bg-brand-500 hover:text-white transition-all active:scale-90"
                                >
                                    <Minus className="w-5 h-5" />
                                </button>
                                <span className="text-center font-black text-xl text-brand-700">{inCart}</span>
                                <button
                                    onClick={() => updateQuantity(product.id, inCart + 1)}
                                    className="h-12 flex items-center justify-center rounded-xl bg-white text-brand-600 hover:bg-brand-500 hover:text-white transition-all active:scale-90"
                                    disabled={inCart >= product.stockQuantity}
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={handleAddToCart}
                                disabled={isOutOfStock}
                                className="btn-primary w-full h-16 !rounded-2xl text-lg flex items-center justify-center gap-3 active:scale-95 group overflow-hidden relative"
                            >
                                <ShoppingCart className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                                <span>أضف إلى السلة</span>
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            </button>
                        )}
                    </div>

                    <a
                        href={`${STORE_WHATSAPP}?text=مرحباً، أود الاستفسار عن منتج: ${product.nameAr}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-outline !border-green-500 !text-green-600 hover:!bg-green-50 h-16 !rounded-2xl px-6 flex items-center justify-center gap-3 transition-colors active:scale-95"
                    >
                        <MessageCircle className="w-6 h-6" />
                        <span>استفسار واتساب</span>
                    </a>
                </div>

                {/* Tabs / Detailed Info */}
                <div className="border-t border-gray-100 pt-8">
                    <div className="flex gap-8 mb-6 border-b border-gray-100">
                        {(['description', 'specs', 'shipping'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-4 text-sm font-bold transition-all relative ${activeTab === tab ? 'text-brand-600' : 'text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                {tab === 'description' && 'الوصف'}
                                {tab === 'specs' && 'المواصفات'}
                                {tab === 'shipping' && 'التوصيل والارجاع'}
                                {activeTab === tab && (
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-500 rounded-full animate-fade-in" />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="min-h-[200px] animate-fade-in">
                        {activeTab === 'description' && (
                            <div className="space-y-4">
                                <p className="text-gray-600 leading-relaxed text-lg">
                                    {product.descriptionAr || 'لا يوجد وصف متاح لهذا المنتج حالياً.'}
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <div className="w-5 h-5 bg-brand-50 rounded-full flex items-center justify-center text-brand-600">
                                            <Check className="w-3 h-3" />
                                        </div>
                                        <span>جودة عالية مضمونة</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <div className="w-5 h-5 bg-brand-50 rounded-full flex items-center justify-center text-brand-600">
                                            <Check className="w-3 h-3" />
                                        </div>
                                        <span>منتج أصلي 100%</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'specs' && (
                            <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden">
                                <table className="w-full text-sm">
                                    <tbody className="divide-y divide-gray-50">
                                        {product.attributes?.map((attr, i) => (
                                            <tr key={i} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4 font-bold text-gray-800 w-1/3 bg-slate-50/50">{attr.keyAr || attr.key}</td>
                                                <td className="px-6 py-4 text-gray-600">{attr.valueAr || attr.value}</td>
                                            </tr>
                                        ))}
                                        {!product.attributes?.length && (
                                            <tr>
                                                <td className="px-6 py-10 text-center text-gray-400 italic">لا توجد مواصفات فنية إضافية</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {activeTab === 'shipping' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="p-4 rounded-2xl bg-brand-50/50 border border-brand-100">
                                        <h4 className="font-bold text-brand-800 mb-2 flex items-center gap-2">
                                            <Truck className="w-4 h-4" /> التوصيل في الكويت
                                        </h4>
                                        <p className="text-sm text-brand-700 leading-relaxed">
                                            نقدم توصيل سريع لجميع مناطق الكويت خلال 24-48 ساعة. التوصيل المجاني للطلبات فوق 10 د.ك
                                        </p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-accent-50/50 border border-accent-100">
                                        <h4 className="font-bold text-accent-800 mb-2 flex items-center gap-2">
                                            <RotateCcw className="w-4 h-4" /> سياسة الإرجاع
                                        </h4>
                                        <p className="text-sm text-accent-700 leading-relaxed">
                                            يمكنك إرجاع المنتج خلال 14 يوم من الاستلام بشرط أن يكون في حالته الأصلية وتغليفه الأصلي.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-4 bg-gray-100 rounded-2xl text-xs text-gray-500">
                                    <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                    <p>نحرص في الديرة باك على وصول منتجاتك بأمان وبأسرع وقت. جميع الشحنات تخضع لرقابة الجودة قبل الخروج للتوصيل.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Secure Payment Badges */}
                <div className="mt-auto pt-10 flex flex-col gap-4">
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] text-center">تسوق آمن ومدعوم بـ</p>
                    <div className="flex justify-center flex-wrap gap-4 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                        <div className="h-10 w-16 bg-white rounded-lg flex items-center justify-center border border-gray-100 p-1 shadow-sm">🏦 <span className="text-[8px] font-bold mr-1">KNET</span></div>
                        <div className="h-10 w-16 bg-white rounded-lg flex items-center justify-center border border-gray-100 p-1 shadow-sm">🍎 <span className="text-[8px] font-bold mr-1">Pay</span></div>
                        <div className="h-10 w-16 bg-white rounded-lg flex items-center justify-center border border-gray-100 p-1 shadow-sm">💳 <span className="text-[8px] font-bold mr-1">VISA</span></div>
                        <div className="h-10 w-16 bg-white rounded-lg flex items-center justify-center border border-gray-100 p-1 shadow-sm">🛡️ <span className="text-[8px] font-bold mr-1">Secure</span></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
