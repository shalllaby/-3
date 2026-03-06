'use client';

import React from 'react';
import { X, ShoppingBag, User, MapPin, CreditCard, Truck } from 'lucide-react';
import { formatKwd } from '@/lib/constants';
import { clsx } from 'clsx';

interface OrderItem {
    id: string;
    productNameAr: string;
    productSku: string;
    quantity: number;
    priceAtPurchase: number;
    product?: {
        images: string[];
    };
}

interface Order {
    id: string;
    totalAmount: number;
    subtotal: number;
    shippingFee: number;
    status: string;
    paymentMethod: string;
    createdAt: string;
    user: { name: string; email: string; phone: string };
    address?: {
        fullName: string;
        phone: string;
        governorate: string;
        area: string;
        block: string;
        street: string;
        building: string;
        floor: string;
        apartment: string;
    };
    items: OrderItem[];
}

interface OrderDetailsModalProps {
    order: Order | null;
    onClose: () => void;
}

export default function OrderDetailsModal({ order, onClose }: OrderDetailsModalProps) {
    if (!order) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden" dir="rtl">
                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand-100 text-brand-600 rounded-xl flex items-center justify-center">
                            <ShoppingBag size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">تفاصيل الطلب</h2>
                            <p className="text-sm text-slate-500 font-mono">#{order.id.toUpperCase()}</p>
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
                <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left: Customer & Address */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Customer Info */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                    <User size={16} /> العميل
                                </h3>
                                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                    <p className="font-bold text-slate-900">{order.user.name}</p>
                                    <p className="text-sm text-slate-500 mt-1">{order.user.email}</p>
                                    <p className="text-sm text-slate-500 mt-1" dir="ltr">{order.user.phone}</p>
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                    <MapPin size={16} /> عنوان التوصيل
                                </h3>
                                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                    {order.address ? (
                                        <div className="text-sm text-slate-700 space-y-1">
                                            <p className="font-bold text-slate-900 mb-2">{order.address.fullName}</p>
                                            <p>المحافظة: {order.address.governorate}</p>
                                            <p>المنطقة: {order.address.area}</p>
                                            <p>قطعة: {order.address.block}, شارع: {order.address.street}</p>
                                            <p>قسيمة/مبنى: {order.address.building}</p>
                                            {(order.address.floor || order.address.apartment) && (
                                                <p>طابق: {order.address.floor}, شقة: {order.address.apartment}</p>
                                            )}
                                            <p className="pt-2 text-slate-500" dir="ltr">{order.address.phone}</p>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-slate-400">لا يوجد عنوان محفوظ</p>
                                    )}
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                    <CreditCard size={16} /> وسيلة الدفع
                                </h3>
                                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                                    <span className="text-sm font-bold text-slate-900">{order.paymentMethod}</span>
                                </div>
                            </div>
                        </div>

                        {/* Right: Items & Summary */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Order Items */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">المنتجات</h3>
                                <div className="border border-slate-100 rounded-2xl overflow-hidden">
                                    <table className="w-full text-right text-sm">
                                        <thead className="bg-slate-50 border-b border-slate-100">
                                            <tr>
                                                <th className="px-4 py-3 font-bold text-slate-600">المنتج</th>
                                                <th className="px-4 py-3 font-bold text-slate-600 text-center">الكمية</th>
                                                <th className="px-4 py-3 font-bold text-slate-600 text-center">السعر</th>
                                                <th className="px-4 py-3 font-bold text-slate-600 text-center">الإجمالي</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {order.items.map((item) => (
                                                <tr key={item.id}>
                                                    <td className="px-4 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0">
                                                                {item.product?.images?.[0] ? (
                                                                    <img src={item.product.images[0]} alt={item.productNameAr} className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <ShoppingBag size={18} className="m-auto mt-2.5 text-slate-300" />
                                                                )}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-slate-900">{item.productNameAr}</p>
                                                                <p className="text-[10px] text-slate-400 font-mono">{item.productSku}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 text-center font-bold text-slate-700">x{item.quantity}</td>
                                                    <td className="px-4 py-4 text-center text-slate-600">{formatKwd(item.priceAtPurchase)}</td>
                                                    <td className="px-4 py-4 text-center font-bold text-slate-900">{formatKwd(item.priceAtPurchase * item.quantity)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">ملخص الحساب</h3>
                                <div className="p-6 rounded-2xl bg-brand-900 text-white space-y-3">
                                    <div className="flex justify-between text-brand-200 text-sm">
                                        <span>المجموع الفرعي</span>
                                        <span>{formatKwd(order.subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-brand-200 text-sm">
                                        <span>توصيل</span>
                                        <span>{formatKwd(order.shippingFee)}</span>
                                    </div>
                                    <div className="h-px bg-white/10 my-2"></div>
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold">المجموع الكلي</span>
                                        <span className="text-2xl font-black text-white">{formatKwd(order.totalAmount)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-8 py-3 rounded-xl bg-slate-200 text-slate-700 text-sm font-bold hover:bg-slate-300 transition-colors"
                    >
                        إغلاق
                    </button>
                </div>
            </div>
        </div>
    );
}
