'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
    ShoppingBag,
    Search,
    ChevronRight,
    ChevronLeft,
    Clock,
    CheckCircle2,
    AlertCircle,
    Truck,
    Eye,
    Loader2,
    Filter,
    MoreVertical
} from 'lucide-react';
import apiClient from '@/lib/api-client';
import { formatKwd } from '@/lib/constants';
import toast from 'react-hot-toast';
import { clsx } from 'clsx';
import OrderDetailsModal from '@/components/admin/OrderDetailsModal';

interface Order {
    id: string;
    totalAmount: number;
    subtotal: number;
    shippingFee: number;
    status: string;
    paymentMethod: string;
    createdAt: string;
    user: { name: string; email: string; phone: string };
    items: any[];
}

interface PaginatedResponse {
    data: Order[];
    meta: { total: number; page: number; limit: number; totalPages: number };
}

const ORDER_STATUSES = [
    { value: 'PENDING', label: 'قيد الانتظار', color: 'bg-amber-50 text-amber-700 border-amber-100', icon: Clock },
    { value: 'PAID', label: 'تم الدفع', color: 'bg-emerald-50 text-emerald-700 border-emerald-100', icon: CheckCircle2 },
    { value: 'PROCESSING', label: 'قيد المعالجة', color: 'bg-blue-50 text-blue-700 border-blue-100', icon: Clock },
    { value: 'SHIPPED', label: 'تم الشحن', color: 'bg-indigo-50 text-indigo-700 border-indigo-100', icon: Truck },
    { value: 'DELIVERED', label: 'تم التوصيل', color: 'bg-emerald-50 text-emerald-700 border-emerald-100', icon: CheckCircle2 },
    { value: 'CANCELED', label: 'ملغي', color: 'bg-rose-50 text-rose-700 border-rose-100', icon: AlertCircle },
];

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>('');

    const fetchOrders = useCallback(async (page = 1, status = statusFilter) => {
        setLoading(true);
        try {
            const { data } = await apiClient.get<PaginatedResponse>('/orders', {
                params: { page, limit: meta.limit, status: status || undefined },
            });
            setOrders(data.data);
            setMeta(data.meta);
        } catch (error) {
            toast.error('فشل في تحميل الطلبات');
        } finally {
            setLoading(false);
        }
    }, [statusFilter, meta.limit]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleUpdateStatus = async (orderId: string, newStatus: string) => {
        setUpdatingId(orderId);
        try {
            await apiClient.patch(`/orders/${orderId}/status`, { status: newStatus });
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
            toast.success('تم تحديث حالة الطلب');
        } catch (error) {
            toast.error('فشل تحديث الحالة');
        } finally {
            setUpdatingId(null);
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">إدارة الطلبات</h1>
                    <p className="text-slate-500 mt-1">متابعة ومعالجة طلبات العملاء في المتجر.</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="flex-1 flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                    <button
                        onClick={() => setStatusFilter('')}
                        className={clsx(
                            "px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all",
                            statusFilter === '' ? "bg-brand-600 text-white shadow-md shadow-brand-100" : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                        )}
                    >
                        الكل
                    </button>
                    {ORDER_STATUSES.map(status => (
                        <button
                            key={status.value}
                            onClick={() => setStatusFilter(status.value)}
                            className={clsx(
                                "px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all",
                                statusFilter === status.value ? "bg-brand-600 text-white shadow-md shadow-brand-100" : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                            )}
                        >
                            {status.label}
                        </button>
                    ))}
                </div>
                <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-100 text-slate-600 font-medium hover:bg-slate-200 transition-colors text-sm">
                    <Filter size={18} />
                    <span>تصفية متقدمة</span>
                </button>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="bg-slate-50 text-slate-500 text-sm uppercase">
                            <tr>
                                <th className="px-6 py-4 font-semibold">الطلب</th>
                                <th className="px-6 py-4 font-semibold">العميل</th>
                                <th className="px-6 py-4 font-semibold text-center">التاريخ</th>
                                <th className="px-6 py-4 font-semibold text-center">الإجمالي</th>
                                <th className="px-6 py-4 font-semibold text-center">الدفع</th>
                                <th className="px-6 py-4 font-semibold text-center">الحالة</th>
                                <th className="px-6 py-4 font-semibold text-center">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                [1, 2, 3, 4, 5].map(i => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4"><div className="h-6 w-24 bg-slate-100 rounded" /></td>
                                        <td className="px-6 py-4"><div className="h-10 w-40 bg-slate-100 rounded" /></td>
                                        <td className="px-6 py-4"><div className="h-6 w-24 bg-slate-100 rounded mx-auto" /></td>
                                        <td className="px-6 py-4"><div className="h-6 w-20 bg-slate-100 rounded mx-auto" /></td>
                                        <td className="px-6 py-4"><div className="h-6 w-16 bg-slate-100 rounded mx-auto" /></td>
                                        <td className="px-6 py-4"><div className="h-6 w-32 bg-slate-100 rounded mx-auto" /></td>
                                        <td className="px-6 py-4"><div className="h-8 w-24 bg-slate-100 rounded mx-auto" /></td>
                                    </tr>
                                ))
                            ) : orders.length > 0 ? (
                                orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="font-mono text-xs font-bold text-slate-400">#{order.id.slice(0, 8).toUpperCase()}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-bold text-slate-900">{order.user.name}</p>
                                                <p className="text-xs text-slate-400">{order.user.email}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="text-sm text-slate-600">
                                                {new Date(order.createdAt).toLocaleDateString('ar-KW')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="font-bold text-slate-900">{formatKwd(order.totalAmount)}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
                                                {order.paymentMethod}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="relative group mx-auto w-fit">
                                                {updatingId === order.id ? (
                                                    <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full">
                                                        <Loader2 size={14} className="animate-spin text-slate-400" />
                                                        <span className="text-xs font-bold text-slate-400">تحديث...</span>
                                                    </div>
                                                ) : (
                                                    <StatusDropdown
                                                        currentStatus={order.status}
                                                        onUpdate={(status) => handleUpdateStatus(order.id, status)}
                                                    />
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-200 transition-all border border-slate-200 shadow-sm"
                                                >
                                                    <Eye size={14} />
                                                    <span>التفاصيل</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                                        <ShoppingBag size={48} className="mx-auto mb-4 opacity-20" />
                                        <p>لا توجد طلبات حالياً</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {meta.totalPages > 1 && (
                    <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                        <p className="text-sm text-slate-500 font-medium">
                            عرض {orders.length} من أصل {meta.total} طلب
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => fetchOrders(meta.page - 1)}
                                disabled={meta.page <= 1 || loading}
                                className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-50 transition-colors"
                            >
                                <ChevronRight size={18} />
                            </button>
                            <button
                                onClick={() => fetchOrders(meta.page + 1)}
                                disabled={meta.page >= meta.totalPages || loading}
                                className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-50 transition-colors"
                            >
                                <ChevronLeft size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Details Modal */}
            <OrderDetailsModal
                order={selectedOrder}
                onClose={() => setSelectedOrder(null)}
            />
        </div>
    );
}

function StatusDropdown({ currentStatus, onUpdate }: { currentStatus: string, onUpdate: (status: string) => void }) {
    const [isOpen, setIsOpen] = useState(false);

    const current = ORDER_STATUSES.find(s => s.value === currentStatus) || ORDER_STATUSES[0];

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={clsx(
                    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-all",
                    current.color
                )}
            >
                <current.icon size={14} />
                {current.label}
                <ChevronDown size={12} className={clsx("transition-transform", isOpen && "rotate-180")} />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-40 bg-white border border-slate-100 shadow-xl rounded-xl py-1 z-20 animate-fade-in">
                        {ORDER_STATUSES.map(status => (
                            <button
                                key={status.value}
                                onClick={() => {
                                    onUpdate(status.value);
                                    setIsOpen(false);
                                }}
                                className={clsx(
                                    "w-full px-4 py-2 text-right text-xs font-bold hover:bg-slate-50 flex items-center justify-between transition-colors",
                                    status.value === currentStatus ? "text-brand-600 bg-brand-50" : "text-slate-600"
                                )}
                            >
                                <span>{status.label}</span>
                                {status.value === currentStatus && <CheckCircle2 size={12} />}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

function ChevronDown({ size, className }: { size: number, className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size} height={size}
            viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"
            className={className}
        >
            <path d="m6 9 6 6 6-6" />
        </svg>
    );
}
