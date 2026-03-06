'use client';

/**
 * Account Orders Page — Anhar Al-Deera
 * Premium orders list with color-coded status badges,
 * expandable rows, empty state.
 */
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, ChevronDown, ChevronUp, ShoppingBag, ArrowRight } from 'lucide-react';
import apiClient from '@/lib/api-client';
import { useAuthStore } from '@/store/auth.store';
import { formatKwd } from '@/lib/constants';

interface OrderItem {
    id: string;
    quantity: number;
    unitPrice: number;
    product: { nameAr: string; images: string[] };
}

interface Order {
    id: string;
    status: string;
    totalAmount: number;
    createdAt: string;
    items: OrderItem[];
    trackingNumber?: string;
    address?: { city: string; area: string };
}

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
    PENDING: { label: 'قيد الانتظار', cls: 'status-pending' },
    CONFIRMED: { label: 'مؤكد', cls: 'status-confirmed' },
    PAID: { label: 'مدفوع', cls: 'status-paid' },
    SHIPPED: { label: 'تم الشحن', cls: 'status-shipped' },
    DELIVERED: { label: 'تم التوصيل', cls: 'status-delivered' },
    CANCELLED: { label: 'ملغي', cls: 'status-cancelled' },
};

export default function AccountOrdersPage() {
    const { user } = useAuthStore();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState<string | null>(null);

    useEffect(() => {
        if (!user) return;
        apiClient.get('/orders/my')
            .then((res) => setOrders(res.data?.data ?? res.data ?? []))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [user]);

    if (loading) return (
        <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="card p-5 h-20 skeleton" />
            ))}
        </div>
    );

    if (!orders.length) return (
        <div className="card p-12 text-center">
            <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-zinc-200 dark:text-zinc-700" />
            <p className="font-black text-zinc-700 dark:text-zinc-300 text-lg mb-2">لا توجد طلبات بعد</p>
            <p className="text-zinc-400 dark:text-zinc-500 text-sm mb-6">ابدأ التسوق وستظهر طلباتك هنا</p>
            <Link href="/products" className="btn-primary inline-flex">
                تصفح المنتجات <ArrowRight className="w-4 h-4" />
            </Link>
        </div>
    );

    return (
        <div className="space-y-3">
            {orders.map((order) => {
                const status = STATUS_LABELS[order.status] ?? { label: order.status, cls: 'badge-neutral' };
                const isExpanded = expanded === order.id;

                return (
                    <div key={order.id} className="card overflow-hidden transition-all duration-200">
                        {/* Row header */}
                        <button
                            className="w-full flex items-center justify-between gap-4 p-5 text-start hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                            onClick={() => setExpanded(isExpanded ? null : order.id)}
                        >
                            <div className="flex items-center gap-4 min-w-0">
                                <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center shrink-0 shadow-brand">
                                    <Package className="w-5 h-5 text-white" />
                                </div>
                                <div className="min-w-0">
                                    <p className="font-black text-zinc-900 dark:text-zinc-100 text-sm truncate">
                                        #{order.id.slice(-8).toUpperCase()}
                                    </p>
                                    <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
                                        {new Date(order.createdAt).toLocaleDateString('ar-KW')}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                                <span className={`badge ${status.cls}`}>{status.label}</span>
                                <span className="font-black text-zinc-900 dark:text-zinc-100 text-sm">
                                    {formatKwd(order.totalAmount)}
                                </span>
                                {isExpanded
                                    ? <ChevronUp className="w-4 h-4 text-zinc-400" />
                                    : <ChevronDown className="w-4 h-4 text-zinc-400" />
                                }
                            </div>
                        </button>

                        {/* Expanded details */}
                        {isExpanded && (
                            <div className="border-t border-zinc-100 dark:border-zinc-800 p-5 space-y-3 animate-fade-in">
                                {order.trackingNumber && (
                                    <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400">
                                        رقم التتبع: <span className="font-mono text-zinc-700 dark:text-zinc-300">{order.trackingNumber}</span>
                                    </p>
                                )}
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800">
                                        <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-700 overflow-hidden shrink-0">
                                            {item.product.images[0] ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={item.product.images[0]} alt={item.product.nameAr} className="w-full h-full object-cover" />
                                            ) : (
                                                <Package className="w-6 h-6 m-3 text-zinc-300" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-sm text-zinc-800 dark:text-zinc-200 truncate">{item.product.nameAr}</p>
                                            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">الكمية: {item.quantity}</p>
                                        </div>
                                        <p className="font-black text-sm gradient-brand-text">{formatKwd(item.unitPrice * item.quantity)}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
