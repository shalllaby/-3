'use client';

/**
 * ProductCard — Anhar Al-Deera (Premium Rebuild)
 * - Hover elevation lift with brand glow
 * - Quick-add to cart overlay on hover
 * - Stock badge with low-stock warning
 * - Gradient discount badge
 * - Dark mode aware
 */
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Star, Package, Check, Zap } from 'lucide-react';
import { useCartStore } from '@/store/cart.store';
import { formatKwd } from '@/lib/constants';

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
    stockQuantity: number;
    isFeatured?: boolean;
    category?: { nameAr: string };
    attributes?: ProductAttribute[];
}

interface Props { product: Product; compact?: boolean; }

const VISIBLE_ATTRIBUTE_KEYS = ['اللون', 'المقاس', 'العلامة', 'Color', 'Size', 'Brand'];

export default function ProductCard({ product, compact = false }: Props) {
    const { addItem, items } = useCartStore();
    const inCart = items.find((i) => i.id === product.id)?.quantity ?? 0;
    const isOutOfStock = product.stockQuantity === 0;
    const isLowStock = !isOutOfStock && product.stockQuantity <= 5;
    const hasDiscount = product.discountPrice != null && product.discountPrice < product.price;
    const discountPct = hasDiscount
        ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
        : 0;
    const displayPrice = hasDiscount ? product.discountPrice! : product.price;
    const coverImage = product.images?.[0] || null;

    const visibleAttrs = product.attributes
        ?.filter((a) => VISIBLE_ATTRIBUTE_KEYS.includes(a.keyAr ?? a.key))
        .slice(0, 2) ?? [];

    const handleAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        if (isOutOfStock) return;
        addItem({
            id: product.id,
            nameAr: product.nameAr,
            nameEn: product.nameEn,
            price: product.price,
            discountPrice: product.discountPrice ?? undefined,
            image: coverImage ?? '',
            sku: product.sku ?? '',
            maxQuantity: product.stockQuantity,
        });
    };

    return (
        <div
            className={`group relative flex flex-col overflow-hidden cursor-pointer
                bg-white dark:bg-zinc-900
                border border-zinc-100 dark:border-zinc-800
                hover:border-brand-200 dark:hover:border-brand-800
                shadow-[var(--shadow-card)] hover:shadow-brand
                dark:hover:shadow-[0_8px_32px_-4px_rgb(139_92_246_/_0.3)]
                transition-all duration-350 ease-out
                hover:-translate-y-1
                ${compact ? 'rounded-2xl' : 'rounded-[1.75rem]'}`}
        >
            {/* ── Badges ── */}
            <div className="absolute top-3 end-3 z-20 flex flex-col gap-1.5">
                {hasDiscount && (
                    <span className="gradient-brand text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-brand">
                        -{discountPct}%
                    </span>
                )}
                {product.isFeatured && (
                    <span className="bg-amber-400 text-amber-900 text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                        <Star className="w-3 h-3 fill-current" /> مميز
                    </span>
                )}
                {isLowStock && (
                    <span className="bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Zap className="w-3 h-3" /> كميات محدودة
                    </span>
                )}
            </div>

            {/* ── Image ── */}
            <div className="relative aspect-square bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                {isOutOfStock && (
                    <div className="absolute inset-0 z-10 bg-black/50 dark:bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                        <span className="bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 text-xs font-black px-4 py-2 rounded-2xl flex items-center gap-2 shadow-xl">
                            <Package className="w-4 h-4" /> نفد المخزون
                        </span>
                    </div>
                )}

                {/* Quick-add overlay — hover only on desktop (md+) */}
                {!isOutOfStock && (
                    <div className="hidden md:block absolute inset-x-0 bottom-0 z-10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out p-3">
                        <button
                            onClick={handleAdd}
                            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold
                                        shadow-lg transition-all duration-200 active:scale-[0.97]
                                        ${inCart > 0
                                    ? 'gradient-brand text-white'
                                    : 'bg-white/95 dark:bg-zinc-900/95 text-brand-600 dark:text-brand-400 backdrop-blur-sm border border-brand-200 dark:border-brand-700 hover:gradient-brand hover:text-white'
                                }`}
                        >
                            {inCart > 0
                                ? <><Check className="w-4 h-4" /> في السلة ({inCart})</>
                                : <><ShoppingCart className="w-4 h-4" /> أضف إلى السلة</>
                            }
                        </button>
                    </div>
                )}

                <Link href={`/products/${product.id}`} className="block w-full h-full">
                    {coverImage ? (
                        <Image
                            src={coverImage}
                            alt={product.nameAr}
                            fill
                            unoptimized
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            className="object-cover md:group-hover:scale-[1.06] transition-transform duration-500 ease-out"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-brand-50/50 dark:bg-brand-950/20 text-brand-200 dark:text-brand-800">
                            <Package className={compact ? 'w-10 h-10 opacity-30' : 'w-16 h-16 opacity-20'} />
                        </div>
                    )}
                </Link>
            </div>

            {/* ── Info ── */}
            <div className={`flex flex-col flex-1 gap-1.5 ${compact ? 'p-2.5' : 'p-4 gap-2'}`}>
                {!compact && (
                    <div className="flex items-center justify-between">
                        {product.category && (
                            <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/50 px-2 py-0.5 rounded-md uppercase tracking-wide">
                                {product.category.nameAr}
                            </span>
                        )}
                        <div className="flex items-center gap-1 text-[10px] text-amber-500 font-bold ms-auto">
                            <Star className="w-3 h-3 fill-current" />
                            <span>4.8</span>
                        </div>
                    </div>
                )}

                <Link href={`/products/${product.id}`} className="block">
                    <h3 className={`font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-2 leading-snug ${compact ? 'text-xs h-[2rem]' : 'text-sm h-[2.5rem]'}`}>
                        {product.nameAr}
                    </h3>
                </Link>

                {!compact && visibleAttrs.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {visibleAttrs.map((attr) => (
                            <span
                                key={attr.key}
                                className="text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 font-medium px-1.5 py-0.5 rounded-md border border-zinc-200 dark:border-zinc-700"
                            >
                                {attr.valueAr || attr.value}
                            </span>
                        ))}
                    </div>
                )}

                {/* ── Price ── */}
                <div className="flex items-baseline gap-2 mt-auto pt-1.5">
                    <span className={`font-black leading-none gradient-brand-text ${compact ? 'text-sm' : 'text-lg'}`}>
                        {formatKwd(displayPrice)}
                    </span>
                    {hasDiscount && (
                        <span className="text-zinc-300 dark:text-zinc-600 text-xs line-through">
                            {formatKwd(product.price)}
                        </span>
                    )}
                </div>

                {/* ── CTA Button (visible without hover on mobile) ── */}
                <button
                    onClick={handleAdd}
                    disabled={isOutOfStock}
                    className={`md:hidden mt-1 w-full flex items-center justify-center gap-1.5 rounded-xl font-bold transition-all duration-200 active:scale-[0.97]
                        ${compact ? 'py-2 text-xs' : 'py-2.5 text-sm'}
                        ${isOutOfStock
                            ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed'
                            : inCart > 0
                                ? 'gradient-brand text-white shadow-brand'
                                : 'bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 hover:gradient-brand hover:text-white'
                        }`}
                >
                    {isOutOfStock ? (
                        <><Package className="w-4 h-4" /> نفد المخزون</>
                    ) : inCart > 0 ? (
                        <><Check className="w-4 h-4" /> في السلة ({inCart})</>
                    ) : (
                        <><ShoppingCart className="w-4 h-4" /> أضف إلى السلة</>
                    )}
                </button>
            </div>
        </div>
    );
}
