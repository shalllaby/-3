'use client';

import React, { useEffect, useState } from 'react';
import { X, Upload, Loader2, Tag } from 'lucide-react';
import apiClient from '@/lib/api-client';
import toast from 'react-hot-toast';

interface Category {
    id: string;
    nameAr: string;
    nameEn: string;
    slug: string;
    imageUrl?: string;
    parentId?: string;
}

interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    category: Category | null; // null for Create, category object for Edit
}

export default function CategoryModal({ isOpen, onClose, onSuccess, category }: CategoryModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nameAr: '',
        nameEn: '',
        slug: '',
        imageUrl: '',
    });

    useEffect(() => {
        if (category) {
            setFormData({
                nameAr: category.nameAr,
                nameEn: category.nameEn,
                slug: category.slug,
                imageUrl: category.imageUrl || '',
            });
        } else {
            setFormData({
                nameAr: '',
                nameEn: '',
                slug: '',
                imageUrl: '',
            });
        }
    }, [category, isOpen]);

    // Auto-generate slug from English name
    const handleNameEnChange = (val: string) => {
        const slug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        setFormData({ ...formData, nameEn: val, slug });
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            if (category) {
                await apiClient.patch(`/categories/${category.id}`, formData);
                toast.success('تم تحديث التصنيف بنجاح');
            } else {
                await apiClient.post('/categories', formData);
                toast.success('تم إضافة التصنيف بنجاح');
            }
            onSuccess();
            onClose();
        } catch (error: any) {
            const message = error.response?.data?.message || 'فشل في حفظ التصنيف';
            toast.error(Array.isArray(message) ? message[0] : message);
        } finally {
            setLoading(false);
        }
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl flex flex-col overflow-hidden" dir="rtl">
                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand-100 text-brand-600 rounded-xl flex items-center justify-center">
                            <Tag size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">{category ? 'تعديل التصنيف' : 'إضافة تصنيف جديد'}</h2>
                            <p className="text-sm text-slate-500">تنظيم المنتجات حسب الفئات</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">اسم التصنيف (بالعربية)</label>
                            <input
                                required
                                type="text"
                                value={formData.nameAr}
                                onChange={e => setFormData({ ...formData, nameAr: e.target.value })}
                                placeholder="مثال: مستلزمات المطبخ"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">اسم التصنيف (بالإنجليزية)</label>
                            <input
                                required
                                type="text"
                                value={formData.nameEn}
                                onChange={e => handleNameEnChange(e.target.value)}
                                placeholder="Example: Kitchen Supplies"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
                                dir="ltr"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">الرابط البديل (Slug)</label>
                            <input
                                required
                                type="text"
                                value={formData.slug}
                                onChange={e => setFormData({ ...formData, slug: e.target.value })}
                                placeholder="kitchen-supplies"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all font-mono text-sm"
                                dir="ltr"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">رابط صورة التصنيف</label>
                            <div className="relative">
                                <input
                                    type="url"
                                    value={formData.imageUrl}
                                    onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                                    placeholder="https://example.com/category-icon.jpg"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all pl-10"
                                />
                                <Upload size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            </div>
                        </div>
                    </div>
                </form>

                {/* Footer */}
                <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-3 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-200 transition-colors"
                    >
                        إلغاء
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-8 py-3 bg-brand-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-brand-200 hover:bg-brand-700 transition-all flex items-center gap-2 disabled:opacity-70"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Tag size={18} />}
                        {category ? 'تحديث التصنيف' : 'حفظ التصنيف'}
                    </button>
                </div>
            </div>
        </div>
    );
}
