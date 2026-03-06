'use client';

/**
 * DashboardStats — Admin dashboard KPI cards.
 * Shows: Total Revenue, Active Orders, Active Products, Low Stock Alert.
 */
import { useEffect, useState } from 'react';
import { ShoppingBag, TrendingUp, Package, AlertTriangle } from 'lucide-react';
import apiClient from '@/lib/api-client';
import { clsx } from 'clsx';

interface Stats {
    totalOrders: number;
    totalRevenue: number;
    pendingOrders: number;
    activeProducts: number;
    lowStockCount: number;
}

interface StatCard {
    title: string;
    value: string;
    subtitle: string;
    icon: React.ReactNode;
    color: string;
    bgColor: string;
    isAlert?: boolean;
}

export default function DashboardStats() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiClient.get('/orders/stats')
            .then((res) => setStats(res.data))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="card p-6 animate-pulse">
                        <div className="w-10 h-10 bg-gray-200 rounded-xl mb-4" />
                        <div className="h-8 bg-gray-200 rounded w-24 mb-2" />
                        <div className="h-4 bg-gray-100 rounded w-32" />
                    </div>
                ))}
            </div>
        );
    }

    const cards: StatCard[] = [
        {
            title: 'إجمالي الإيرادات',
            value: `${(stats?.totalRevenue ?? 0).toLocaleString('ar-SA')} ر.س`,
            subtitle: `${stats?.totalOrders ?? 0} طلب مكتمل`,
            icon: <TrendingUp className="w-5 h-5" />,
            color: 'text-emerald-600',
            bgColor: 'bg-emerald-100',
        },
        {
            title: 'الطلبات المعلقة',
            value: `${stats?.pendingOrders ?? 0}`,
            subtitle: 'بانتظار المعالجة',
            icon: <ShoppingBag className="w-5 h-5" />,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100',
        },
        {
            title: 'المنتجات النشطة',
            value: `${stats?.activeProducts ?? 0}`,
            subtitle: 'منتج معروض',
            icon: <Package className="w-5 h-5" />,
            color: 'text-brand-600',
            bgColor: 'bg-brand-100',
        },
        {
            title: 'تنبيه المخزون',
            value: `${stats?.lowStockCount ?? 0}`,
            subtitle: 'منتج بمخزون منخفض',
            icon: <AlertTriangle className="w-5 h-5" />,
            color: 'text-red-600',
            bgColor: 'bg-red-100',
            isAlert: (stats?.lowStockCount ?? 0) > 0,
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card) => (
                <div
                    key={card.title}
                    className={clsx(
                        'card p-6 animate-fade-in transition-all',
                        card.isAlert && 'ring-2 ring-red-200',
                    )}
                >
                    <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center mb-4', card.bgColor, card.color)}>
                        {card.icon}
                    </div>
                    <p className="text-sm text-gray-500 mb-1">{card.title}</p>
                    <p className={clsx('text-2xl font-bold', card.color)}>{card.value}</p>
                    <p className="text-sm text-gray-400 mt-1">{card.subtitle}</p>
                </div>
            ))}
        </div>
    );
}
