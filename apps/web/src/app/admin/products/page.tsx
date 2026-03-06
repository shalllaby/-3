'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Eye,
    EyeOff,
    Package,
    ChevronRight,
    ChevronLeft,
    Filter,
    MoreVertical,
    Loader2
} from 'lucide-react';
import apiClient from '@/lib/api-client';
import { formatKwd } from '@/lib/constants';
import toast from 'react-hot-toast';
import { clsx } from 'clsx';
import ProductModal from '@/components/admin/ProductModal';

interface Product {
    id: string;
    nameAr: string;
    nameEn: string;
    descriptionAr?: string;
    descriptionEn?: string;
    sku: string;
    price: number;
    discountPrice?: number;
    stockQuantity: number;
    isActive: boolean;
    images: string[];
    categoryId: string;
    category: { nameAr: string };
}

interface PaginatedResponse {
    data: Product[];
    meta: { total: number; page: number; limit: number; totalPages: number };
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [togglingId, setTogglingId] = useState<string | null>(null);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fetchProducts = useCallback(async (page = 1, searchTerm = search) => {
        setLoading(true);
        try {
            const { data } = await apiClient.get<PaginatedResponse>('/products', {
                params: { page, limit: meta.limit, search: searchTerm },
            });
            setProducts(data.data);
            setMeta(data.meta);
        } catch (error) {
            toast.error('فشل في تحميل المنتجات');
        } finally {
            setLoading(false);
        }
    }, [search, meta.limit]);

    useEffect(() => {
        fetchProducts();
    }, []);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchProducts(1, search);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const handleToggleActive = async (product: Product) => {
        setTogglingId(product.id);
        try {
            await apiClient.patch(`/products/${product.id}/toggle-active`);
            setProducts(prev => prev.map(p =>
                p.id === product.id ? { ...p, isActive: !p.isActive } : p
            ));
            toast.success(product.isActive ? 'تم إخفاء المنتج' : 'تم تفعيل المنتج');
        } catch (error) {
            toast.error('فشلت العملية');
        } finally {
            setTogglingId(null);
        }
    };

    const handleDelete = async (id: string, nameAr: string) => {
        if (!confirm(`هل أنت متأكد من حذف المنتج "${nameAr}"؟`)) return;
        setDeletingId(id);
        try {
            await apiClient.delete(`/products/${id}`);
            setProducts(prev => prev.filter(p => p.id !== id));
            toast.success('تم حذف المنتج بنجاح');
        } catch (error) {
            toast.error('فشل حذف المنتج');
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">إدارة المنتجات</h1>
                    <p className="text-slate-500 mt-1">عرض وإضافة وتعديل المنتجات المتاحة في المتجر.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-brand-200 hover:bg-brand-700 transition-all"
                >
                    <Plus size={20} />
                    <span>إضافة منتج جديد</span>
                </button>
            </div>

            {/* Filters & Search */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="البحث باسم المنتج أو SKU..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pr-12 pl-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-brand-500/20 focus:bg-white transition-all outline-none text-sm"
                    />
                </div>
                <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-50 text-slate-600 font-medium hover:bg-slate-100 transition-colors text-sm">
                    <Filter size={18} />
                    <span>تصفية</span>
                </button>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="bg-slate-50 text-slate-500 text-sm uppercase">
                            <tr>
                                <th className="px-6 py-4 font-semibold">المنتج</th>
                                <th className="px-6 py-4 font-semibold text-center">التصنيف</th>
                                <th className="px-6 py-4 font-semibold text-center">السعر</th>
                                <th className="px-6 py-4 font-semibold text-center">المخزون</th>
                                <th className="px-6 py-4 font-semibold text-center">الحالة</th>
                                <th className="px-6 py-4 font-semibold text-center">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                [1, 2, 3, 4, 5].map(i => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4"><div className="h-10 w-40 bg-slate-100 rounded" /></td>
                                        <td className="px-6 py-4"><div className="h-6 w-24 bg-slate-100 rounded mx-auto" /></td>
                                        <td className="px-6 py-4"><div className="h-6 w-20 bg-slate-100 rounded mx-auto" /></td>
                                        <td className="px-6 py-4"><div className="h-6 w-16 bg-slate-100 rounded mx-auto" /></td>
                                        <td className="px-6 py-4"><div className="h-6 w-20 bg-slate-100 rounded mx-auto" /></td>
                                        <td className="px-6 py-4"><div className="h-8 w-24 bg-slate-100 rounded mx-auto" /></td>
                                    </tr>
                                ))
                            ) : products.length > 0 ? (
                                products.map((product) => (
                                    <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                                                    {product.images[0] ? (
                                                        <img src={product.images[0]} alt={product.nameAr} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Package className="w-6 h-6 m-auto mt-3 text-slate-300" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900">{product.nameAr}</p>
                                                    <p className="text-xs text-slate-400 font-mono">{product.sku}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="text-sm text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
                                                {product.category?.nameAr}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex flex-col items-center">
                                                <span className="font-bold text-slate-900">
                                                    {formatKwd(product.discountPrice ?? product.price)}
                                                </span>
                                                {product.discountPrice && (
                                                    <span className="text-xs text-slate-400 line-through">
                                                        {formatKwd(product.price)}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <StockBadge qty={product.stockQuantity} />
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={clsx(
                                                "inline-flex px-3 py-1 rounded-full text-xs font-bold border",
                                                product.isActive
                                                    ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                                    : "bg-slate-50 text-slate-500 border-slate-100"
                                            )}>
                                                {product.isActive ? 'نشط' : 'مخفي'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleToggleActive(product)}
                                                    disabled={togglingId === product.id}
                                                    className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-all"
                                                    title={product.isActive ? 'إخفاء' : 'تفعيل'}
                                                >
                                                    {togglingId === product.id ? <Loader2 size={18} className="animate-spin" /> : product.isActive ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setEditingProduct(product);
                                                        setIsModalOpen(true);
                                                    }}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id, product.nameAr)}
                                                    disabled={deletingId === product.id}
                                                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                                >
                                                    {deletingId === product.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                                        <Package size={48} className="mx-auto mb-4 opacity-20" />
                                        <p>لا توجد منتجات مطابقة للبحث</p>
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
                            عرض {products.length} من أصل {meta.total} منتج
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => fetchProducts(meta.page - 1)}
                                disabled={meta.page <= 1 || loading}
                                className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-50 transition-colors"
                            >
                                <ChevronRight size={18} />
                            </button>
                            <button
                                onClick={() => fetchProducts(meta.page + 1)}
                                disabled={meta.page >= meta.totalPages || loading}
                                className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-50 transition-colors"
                            >
                                <ChevronLeft size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Product Modal (Add/Edit) */}
            <ProductModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingProduct(null);
                }}
                onSuccess={() => fetchProducts(editingProduct ? meta.page : 1)}
                product={editingProduct}
            />
        </div>
    );
}

function StockBadge({ qty }: { qty: number }) {
    if (qty === 0) {
        return (
            <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-100">
                نفذ المخزون
            </span>
        );
    }
    if (qty <= 10) {
        return (
            <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100">
                مخزون منخفض ({qty})
            </span>
        );
    }
    return (
        <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
            {qty} متوفر
        </span>
    );
}
