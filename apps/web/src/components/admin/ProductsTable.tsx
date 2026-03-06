'use client';

/**
 * ProductsTable — Admin panel product management table.
 * Features: search, sort, pagination, toggle active, delete.
 * Fully in Arabic RTL layout.
 */
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
    Plus, Search, Edit2, Trash2, Eye, EyeOff, Package, ChevronRight, ChevronLeft,
} from 'lucide-react';
import toast from 'react-hot-toast';
import apiClient from '@/lib/api-client';
import { clsx } from 'clsx';

interface Product {
    id: string;
    nameAr: string;
    nameEn: string;
    sku: string;
    price: number;
    discountPrice?: number;
    stockQuantity: number;
    isActive: boolean;
    isFeatured: boolean;
    images: string[];
    category: { nameAr: string };
}

interface PaginatedResponse {
    data: Product[];
    meta: { total: number; page: number; limit: number; totalPages: number };
}

const STATUS_COLORS: Record<string, string> = {
    active: 'badge-success',
    inactive: 'badge-error',
    low: 'badge-warning',
    out: 'badge-error',
};

export default function ProductsTable() {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [meta, setMeta] = useState({ total: 0, page: 1, limit: 20, totalPages: 1 });
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [toggling, setToggling] = useState<string | null>(null);

    const fetchProducts = useCallback(async (page = 1, searchTerm = search) => {
        setLoading(true);
        try {
            const { data } = await apiClient.get<PaginatedResponse>('/products', {
                params: { page, limit: meta.limit, search: searchTerm, isActive: undefined },
            });
            setProducts(data.data);
            setMeta(data.meta);
        } catch {
            toast.error('فشل في تحميل المنتجات');
        } finally {
            setLoading(false);
        }
    }, [search, meta.limit]);

    useEffect(() => { fetchProducts(); }, []);
    useEffect(() => {
        const timer = setTimeout(() => fetchProducts(1, search), 400);
        return () => clearTimeout(timer);
    }, [search]);

    const handleToggleActive = async (product: Product) => {
        setToggling(product.id);
        try {
            await apiClient.patch(`/products/${product.id}/toggle-active`);
            setProducts((prev) => prev.map((p) =>
                p.id === product.id ? { ...p, isActive: !p.isActive } : p
            ));
            toast.success(product.isActive ? 'تم إخفاء المنتج' : 'تم تفعيل المنتج');
        } catch {
            toast.error('فشلت العملية');
        } finally { setToggling(null); }
    };

    const handleDelete = async (id: string, nameAr: string) => {
        if (!confirm(`هل أنت متأكد من حذف "${nameAr}"؟`)) return;
        setDeleting(id);
        try {
            await apiClient.delete(`/products/${id}`);
            setProducts((prev) => prev.filter((p) => p.id !== id));
            toast.success('تم حذف المنتج');
        } catch {
            toast.error('فشل الحذف');
        } finally { setDeleting(null); }
    };

    const getStockBadge = (qty: number) => {
        if (qty === 0) return <span className="badge-error">نفذ</span>;
        if (qty <= 10) return <span className="badge-warning">{qty} متبقي</span>;
        return <span className="badge-success">{qty}</span>;
    };

    return (
        <div className="space-y-4">
            {/* ── Header ── */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">إدارة المنتجات</h1>
                    <p className="text-sm text-gray-500 mt-0.5">{meta.total} منتج إجمالاً</p>
                </div>
                <button
                    onClick={() => router.push('/admin/products/new')}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    إضافة منتج
                </button>
            </div>

            {/* ── Search ── */}
            <div className="relative">
                <Search className="absolute top-1/2 -translate-y-1/2 end-4 w-4 h-4 text-gray-400" />
                <input
                    type="search"
                    placeholder="ابحث بالاسم أو SKU..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="input pe-10"
                />
            </div>

            {/* ── Table ── */}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                {['المنتج', 'SKU', 'التصنيف', 'السعر', 'المخزون', 'الحالة', 'الإجراءات'].map((h) => (
                                    <th key={h} className="text-right px-4 py-3 font-semibold text-gray-600">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        {[...Array(7)].map((_, j) => (
                                            <td key={j} className="px-4 py-3">
                                                <div className="h-4 bg-gray-100 rounded w-full" />
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-16 text-gray-400">
                                        <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                        <p>لا توجد منتجات</p>
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                                        {/* Product */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                                    {product.images[0] ? (
                                                        <Image
                                                            src={product.images[0]} alt={product.nameAr}
                                                            width={40} height={40} className="object-cover w-full h-full"
                                                        />
                                                    ) : (
                                                        <Package className="w-5 h-5 text-gray-300 m-auto mt-2.5" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 line-clamp-1">{product.nameAr}</p>
                                                    <p className="text-xs text-gray-400">{product.nameEn}</p>
                                                </div>
                                            </div>
                                        </td>
                                        {/* SKU */}
                                        <td className="px-4 py-3 text-gray-500 font-mono text-xs">{product.sku}</td>
                                        {/* Category */}
                                        <td className="px-4 py-3 text-gray-600">{product.category?.nameAr}</td>
                                        {/* Price */}
                                        <td className="px-4 py-3">
                                            {product.discountPrice ? (
                                                <div>
                                                    <span className="font-bold text-brand-600">{product.discountPrice} ر.س</span>
                                                    <span className="text-xs text-gray-400 line-through me-1">{product.price} ر.س</span>
                                                </div>
                                            ) : (
                                                <span className="font-semibold text-gray-800">{product.price} ر.س</span>
                                            )}
                                        </td>
                                        {/* Stock */}
                                        <td className="px-4 py-3">{getStockBadge(product.stockQuantity)}</td>
                                        {/* Status */}
                                        <td className="px-4 py-3">
                                            <span className={product.isActive ? STATUS_COLORS.active : STATUS_COLORS.inactive}>
                                                {product.isActive ? 'نشط' : 'مخفي'}
                                            </span>
                                        </td>
                                        {/* Actions */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => router.push(`/admin/products/${product.id}/edit`)}
                                                    className="p-1.5 text-gray-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                                                    title="تعديل"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleToggleActive(product)}
                                                    disabled={toggling === product.id}
                                                    className={clsx(
                                                        'p-1.5 rounded-lg transition-colors',
                                                        product.isActive
                                                            ? 'text-gray-500 hover:text-yellow-600 hover:bg-yellow-50'
                                                            : 'text-gray-500 hover:text-green-600 hover:bg-green-50',
                                                    )}
                                                    title={product.isActive ? 'إخفاء' : 'تفعيل'}
                                                >
                                                    {product.isActive
                                                        ? <EyeOff className="w-4 h-4" />
                                                        : <Eye className="w-4 h-4" />}
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id, product.nameAr)}
                                                    disabled={deleting === product.id}
                                                    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="حذف"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* ── Pagination ── */}
                {meta.totalPages > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50/50">
                        <span className="text-sm text-gray-500">
                            صفحة {meta.page} من {meta.totalPages}
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => fetchProducts(meta.page - 1)}
                                disabled={meta.page <= 1 || loading}
                                className="p-1.5 rounded-lg border border-gray-200 hover:bg-white disabled:opacity-40 transition-colors"
                            >
                                <ChevronRight className="w-4 h-4" /> {/* RTL: right = previous */}
                            </button>
                            <button
                                onClick={() => fetchProducts(meta.page + 1)}
                                disabled={meta.page >= meta.totalPages || loading}
                                className="p-1.5 rounded-lg border border-gray-200 hover:bg-white disabled:opacity-40 transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" /> {/* RTL: left = next */}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
