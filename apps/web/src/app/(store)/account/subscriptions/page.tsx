'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
    Package, Plus, Trash2, ShoppingBag, Pause, Play,
    ShoppingCart, Loader2, ChevronDown, ChevronUp, AlertCircle
} from 'lucide-react';
import apiClient from '@/lib/api-client';
import toast from 'react-hot-toast';
import { formatKwd } from '@/lib/constants';
import Link from 'next/link';
import Image from 'next/image';

// ── Types ──────────────────────────────────────────────────────────────

interface PackageItem {
    id: string;
    quantity: number;
    priceAtTime: number;
    productNameArAtTime: string;
    productNameEnAtTime: string;
    product: {
        id: string;
        nameAr: string;
        images: string[];
        isActive: boolean;
        stockQuantity: number;
    };
}

interface SavedPackage {
    id: string;
    nameAr: string;
    type: 'HOME' | 'WORK' | 'CUSTOM';
    status: 'ACTIVE' | 'PAUSED';
    createdAt: string;
    items: PackageItem[];
}

// ── Package Card ────────────────────────────────────────────────────────

function PackageCard({
    pkg,
    onToggle,
    onDelete,
    onReorder,
}: {
    pkg: SavedPackage;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onReorder: (id: string) => void;
}) {
    const [expanded, setExpanded] = useState(false);
    const [reordering, setReordering] = useState(false);
    const [toggling, setToggling] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const totalSnapshotPrice = pkg.items.reduce(
        (acc, item) => acc + Number(item.priceAtTime) * item.quantity, 0
    );

    const TYPE_LABELS: Record<string, string> = {
        HOME: '🏠 باقة منزلية',
        WORK: '💼 باقة للعمل',
        CUSTOM: '✨ باقة مخصصة',
    };

    const handleReorder = async () => {
        setReordering(true);
        try {
            await onReorder(pkg.id);
        } finally {
            setReordering(false);
        }
    };

    const handleToggle = async () => {
        setToggling(true);
        try {
            await onToggle(pkg.id);
        } finally {
            setToggling(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('هل أنت متأكد من حذف هذه الباقة؟')) return;
        setDeleting(true);
        try {
            await onDelete(pkg.id);
        } finally {
            setDeleting(false);
        }
    };

    const isPaused = pkg.status === 'PAUSED';

    return (
        <div className={`bg-white rounded-3xl border-2 shadow-sm transition-all ${isPaused ? 'border-gray-200 opacity-75' : 'border-brand-100 hover:border-brand-200'}`}>
            {/* Header */}
            <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs text-gray-400">{TYPE_LABELS[pkg.type]}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isPaused ? 'bg-gray-100 text-gray-500' : 'bg-green-100 text-green-700'}`}>
                                {isPaused ? 'موقوفة' : 'نشطة'}
                            </span>
                        </div>
                        <h3 className="font-black text-gray-900 text-lg mt-1 truncate">{pkg.nameAr}</h3>
                        <p className="text-xs text-gray-400 mt-0.5">
                            {pkg.items.length} منتج • إجمالي {formatKwd(totalSnapshotPrice)} (وقت الحفظ)
                        </p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                        <button onClick={() => setExpanded(e => !e)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
                            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                        <button
                            onClick={handleToggle}
                            disabled={toggling}
                            className="p-2 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-colors disabled:opacity-50"
                            title={isPaused ? 'استئناف' : 'إيقاف مؤقت'}
                        >
                            {toggling ? <Loader2 className="w-4 h-4 animate-spin" /> : isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={deleting}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50"
                            title="حذف"
                        >
                            {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                {/* Thumbnail strip */}
                <div className="flex gap-2 mt-4 overflow-x-auto scrollbar-hide pb-1">
                    {pkg.items.map((item) => (
                        <div key={item.id} className="relative flex-shrink-0 w-12 h-12 rounded-xl overflow-hidden bg-gray-100 border border-gray-100">
                            {item.product.images?.[0] ? (
                                <Image src={item.product.images[0]} alt={item.productNameArAtTime} fill className="object-cover" unoptimized />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                    <Package className="w-5 h-5" />
                                </div>
                            )}
                            {!item.product.isActive && (
                                <div className="absolute inset-0 bg-red-500/40 flex items-center justify-center">
                                    <AlertCircle className="w-4 h-4 text-white" />
                                </div>
                            )}
                            {item.quantity > 1 && (
                                <div className="absolute bottom-0 right-0 bg-brand-600 text-white text-[9px] font-black px-1 rounded-tl-md">
                                    ×{item.quantity}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Expanded Items */}
            {expanded && (
                <div className="border-t border-gray-50 px-5 pb-4">
                    <div className="divide-y divide-gray-50 mt-3">
                        {pkg.items.map((item) => (
                            <div key={item.id} className="flex items-center gap-3 py-3">
                                <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                                    {item.product.images?.[0] ? (
                                        <Image src={item.product.images[0]} alt={item.productNameArAtTime} width={40} height={40} className="object-cover w-full h-full" unoptimized />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <Package className="w-5 h-5" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-gray-900 text-sm truncate">{item.productNameArAtTime}</p>
                                    <p className="text-xs text-gray-400">
                                        {formatKwd(Number(item.priceAtTime))} × {item.quantity}
                                        {!item.product.isActive && (
                                            <span className="mr-2 text-red-500 font-bold">• غير متاح</span>
                                        )}
                                        {item.product.isActive && item.product.stockQuantity < item.quantity && (
                                            <span className="mr-2 text-orange-500 font-bold">• مخزون منخفض</span>
                                        )}
                                    </p>
                                </div>
                                <p className="font-black text-brand-600 text-sm flex-shrink-0">
                                    {formatKwd(Number(item.priceAtTime) * item.quantity)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Order Now Button */}
            <div className="px-5 pb-5 pt-1">
                <button
                    onClick={handleReorder}
                    disabled={reordering || isPaused}
                    className="w-full py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:cursor-not-allowed
                        bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-100
                        disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none"
                >
                    {reordering ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>جاري إنشاء الطلب...</span>
                        </>
                    ) : isPaused ? (
                        <span>مؤقتاً موقوفة — استأنف أولاً</span>
                    ) : (
                        <>
                            <ShoppingCart className="w-4 h-4" />
                            <span>اطلب الآن</span>
                        </>
                    )}
                </button>
                {isPaused && (
                    <p className="text-[11px] text-center text-gray-400 mt-2">
                        استأنف الباقة من الزر ⏸ أعلاه لتتمكن من الطلب
                    </p>
                )}
            </div>
        </div>
    );
}

// ── Main Page ───────────────────────────────────────────────────────────

export default function SubscriptionsPage() {
    const router = useRouter();
    const [packages, setPackages] = useState<SavedPackage[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPackages = useCallback(async () => {
        try {
            const { data } = await apiClient.get('/packages/me');
            setPackages(data);
        } catch {
            toast.error('فشل في تحميل الباقات المحفوظة');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchPackages(); }, [fetchPackages]);

    const handleToggle = async (id: string) => {
        try {
            const { data } = await apiClient.patch(`/packages/me/${id}/toggle`);
            setPackages(prev => prev.map(p => p.id === id ? { ...p, status: data.status } : p));
            const pkg = packages.find(p => p.id === id);
            const wasPaused = pkg?.status === 'PAUSED';
            toast.success(wasPaused ? '▶ تم استئناف الباقة' : '⏸ تم إيقاف الباقة مؤقتاً');
        } catch {
            toast.error('فشل في تغيير حالة الباقة');
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await apiClient.delete(`/packages/me/${id}`);
            setPackages(prev => prev.filter(p => p.id !== id));
            toast.success('تم حذف الباقة');
        } catch {
            toast.error('فشل في حذف الباقة');
        }
    };

    const handleReorder = async (id: string) => {
        try {
            const { data: order } = await apiClient.post(`/packages/me/${id}/reorder`, {
                paymentMethod: 'CASH_ON_DELIVERY',
            });
            const shortId = (order.id as string)?.slice(-6).toUpperCase();
            toast.success(`✅ تم إنشاء طلبك بنجاح! رقم الطلب: #${shortId}`, { duration: 5000 });
            router.push(`/checkout?orderId=${order.id}`);
        } catch (err: any) {
            // Show exact backend error (stock, product unavailable, etc.) — do NOT redirect
            const msg = err.response?.data?.message;
            toast.error(msg || 'فشل في إنشاء الطلب. يرجى المحاولة مجدداً.', { duration: 6000 });
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-16 text-gray-400">
                <Loader2 className="w-6 h-6 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                        <Package className="w-6 h-6 text-brand-500" /> باقاتي الشهرية
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">باقاتك المحفوظة — أعد طلبها بنقرة واحدة</p>
                </div>
                <Link href="/offers" className="btn-primary py-2 px-4 text-sm flex items-center gap-2">
                    <Plus className="w-4 h-4" /> باقة جديدة
                </Link>
            </div>

            {/* Content */}
            {packages.length === 0 ? (
                <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl p-16 text-center">
                    <Package className="w-14 h-14 text-gray-200 mx-auto mb-4" />
                    <h3 className="text-xl font-black text-gray-900 mb-2">لا توجد باقات محفوظة</h3>
                    <p className="text-gray-500 text-sm mb-6">
                        صمّم باقتك الشهرية المخصصة واحفظها لتتمكن من إعادة طلبها بسهولة
                    </p>
                    <Link href="/offers" className="btn-primary inline-flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4" /> ابدأ بتصميم باقتك
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {packages.map(pkg => (
                        <PackageCard
                            key={pkg.id}
                            pkg={pkg}
                            onToggle={handleToggle}
                            onDelete={handleDelete}
                            onReorder={handleReorder}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
