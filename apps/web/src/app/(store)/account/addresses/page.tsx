'use client';

import { useState, useEffect } from 'react';
import { MapPin, Plus, Trash2, Edit2, CheckCircle2, Star, AlertCircle } from 'lucide-react';
import apiClient from '@/lib/api-client';
import toast from 'react-hot-toast';
import { KUWAIT_GOVERNORATES, type KuwaitGovernorateValue } from '@/lib/constants';

interface Address {
    id: string;
    fullName: string;
    phone: string;
    block: string;
    street: string;
    building: string;
    floor?: string;
    apartment?: string;
    area: string;
    governorate: KuwaitGovernorateValue;
    deliveryNotes?: string;
    isDefault: boolean;
}

export default function AddressesPage() {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const [form, setForm] = useState<Partial<Address>>({
        fullName: '', phone: '', block: '', street: '',
        building: '', floor: '', apartment: '', area: '',
        governorate: 'ASIMAH', deliveryNotes: '', isDefault: false
    });

    const fetchAddresses = async () => {
        try {
            const { data } = await apiClient.get('/addresses/me');
            setAddresses(data);
        } catch (error) {
            toast.error('فشل في تحميل العناوين');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            if (editingId) {
                await apiClient.patch(`/addresses/me/${editingId}`, form);
                toast.success('تم تحديث العنوان بنجاح');
            } else {
                await apiClient.post('/addresses/me', form);
                toast.success('تمت إضافة العنوان بنجاح');
            }
            fetchAddresses();
            closeForm();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'حدث خطأ أثناء الحفظ');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('هل أنت متأكد من حذف هذا العنوان؟')) return;
        try {
            await apiClient.delete(`/addresses/me/${id}`);
            toast.success('تم حذف العنوان');
            fetchAddresses();
        } catch (error) {
            toast.error('فشل في حذف العنوان');
        }
    };

    const handleSetDefault = async (id: string) => {
        try {
            await apiClient.patch(`/addresses/me/${id}/default`);
            toast.success('تم التعيين كافتراضي');
            fetchAddresses();
        } catch (error) {
            toast.error('فشل في تعيين العنوان الافتراضي');
        }
    };

    const openEdit = (address: Address) => {
        setForm(address);
        setEditingId(address.id);
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setForm({
            fullName: '', phone: '', block: '', street: '',
            building: '', floor: '', apartment: '', area: '',
            governorate: 'ASIMAH', deliveryNotes: '', isDefault: false
        });
        setEditingId(null);
        setIsFormOpen(false);
    };

    if (isLoading) {
        return <div className="p-8 text-center text-gray-500">جاري التحميل...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <MapPin className="w-6 h-6 text-brand-500" /> عناوين التوصيل
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">إدارة العناوين المحفوظة لسهولة الطلب</p>
                </div>
                {!isFormOpen && (
                    <div className="flex flex-col items-end gap-1">
                        <button
                            onClick={() => setIsFormOpen(true)}
                            disabled={addresses.length >= 4}
                            className="btn-primary py-2 px-4 text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Plus className="w-4 h-4" /> إضافة عنوان
                        </button>
                        {addresses.length >= 4 && (
                            <p className="text-[11px] text-red-500 font-bold mt-1">الحد الأقصى: 4 عناوين</p>
                        )}
                    </div>
                )}
            </div>

            {isFormOpen ? (
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm animate-fade-in">
                    <div className="flex justify-between items-center mb-6 border-b pb-4">
                        <h2 className="text-lg font-bold text-gray-900">
                            {editingId ? 'تعديل العنوان' : 'إضافة عنوان جديد'}
                        </h2>
                        <button onClick={closeForm} className="text-gray-400 hover:text-gray-600 text-sm">
                            إلغاء
                        </button>
                    </div>

                    <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">الاسم الكامل *</label>
                            <input required className="input" placeholder="أحمد الكويتي" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">رقم الجوال *</label>
                            <input required className="input" placeholder="9XXXXXXX" dir="ltr" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">المحافظة *</label>
                            <select required className="input" value={form.governorate} onChange={e => setForm({ ...form, governorate: e.target.value as KuwaitGovernorateValue })}>
                                {KUWAIT_GOVERNORATES.map(g => <option key={g.value} value={g.value}>{g.nameAr}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">المنطقة / الحي *</label>
                            <input required className="input" placeholder="الشويخ" value={form.area} onChange={e => setForm({ ...form, area: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">القطعة</label>
                            <input className="input" placeholder="5" dir="ltr" value={form.block || ''} onChange={e => setForm({ ...form, block: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">الشارع *</label>
                            <input required className="input" placeholder="شارع 12" value={form.street} onChange={e => setForm({ ...form, street: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">رقم المبنى / المنزل</label>
                            <input className="input" placeholder="3" dir="ltr" value={form.building || ''} onChange={e => setForm({ ...form, building: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">الطابق (اختياري)</label>
                            <input className="input" placeholder="2" dir="ltr" value={form.floor || ''} onChange={e => setForm({ ...form, floor: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">الشقة (اختياري)</label>
                            <input className="input" placeholder="7" dir="ltr" value={form.apartment || ''} onChange={e => setForm({ ...form, apartment: e.target.value })} />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">تعليمات التوصيل (اختياري)</label>
                            <textarea className="input resize-none" rows={2} placeholder="علامة مميزة، وقت مفضل للتوصيل..." value={form.deliveryNotes || ''} onChange={e => setForm({ ...form, deliveryNotes: e.target.value })} />
                        </div>
                        {!editingId && (
                            <div className="sm:col-span-2 flex items-center gap-2 mt-2">
                                <input type="checkbox" id="isDefault" checked={form.isDefault} onChange={e => setForm({ ...form, isDefault: e.target.checked })} className="w-4 h-4 text-brand-600 rounded border-gray-300 focus:ring-brand-500" />
                                <label htmlFor="isDefault" className="text-sm text-gray-700 select-none cursor-pointer">تعيين كعنوان افتراضي</label>
                            </div>
                        )}
                        <div className="sm:col-span-2 pt-4 flex gap-3">
                            <button type="submit" disabled={isSaving} className="btn-primary w-full disabled:opacity-50">
                                {isSaving ? 'جاري الحفظ...' : 'حفظ العنوان'}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.length === 0 ? (
                        <div className="md:col-span-2 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center">
                            <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <h3 className="text-lg font-bold text-gray-900 mb-1">لا توجد عناوين محفوظة</h3>
                            <p className="text-gray-500 mb-4 text-sm">أضف عنوانك لتسريع عملية الشراء في المرة القادمة</p>
                            <button onClick={() => setIsFormOpen(true)} className="btn-primary py-2 px-6 inline-flex">إضافة عنوان جديد</button>
                        </div>
                    ) : (
                        addresses.map((addr) => (
                            <div key={addr.id} className={`bg-white p-5 rounded-2xl border-2 transition-all relative group ${addr.isDefault ? 'border-brand-400 shadow-md shadow-brand-100' : 'border-gray-100 hover:border-gray-200'}`}>
                                {addr.isDefault && (
                                    <div className="absolute -top-3 -right-3 bg-brand-500 text-white p-1.5 rounded-full shadow-lg" title="العنوان الافتراضي">
                                        <Star className="w-4 h-4 fill-current" />
                                    </div>
                                )}
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <p className="font-bold text-gray-900 flex items-center gap-2">
                                            {addr.fullName} <span className="text-xs font-normal text-gray-500 block uppercase" dir="ltr">{addr.phone}</span>
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openEdit(addr)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="تعديل">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(addr.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="حذف">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                                    {KUWAIT_GOVERNORATES.find(g => g.value === addr.governorate)?.nameAr} — {addr.area}<br />
                                    ق. {addr.block} — شارع {addr.street} {addr.building ? `— مبنى ${addr.building}` : ''}
                                    {addr.floor ? ` — الطابق ${addr.floor}` : ''}
                                    {addr.apartment ? ` — شقة ${addr.apartment}` : ''}
                                </p>

                                {!addr.isDefault && (
                                    <button onClick={() => handleSetDefault(addr.id)} className="text-xs font-semibold text-gray-500 hover:text-brand-600 flex items-center gap-1 transition-colors">
                                        <CheckCircle2 className="w-3.5 h-3.5" /> تعيين كافتراضي
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
