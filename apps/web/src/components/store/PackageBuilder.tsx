'use client';

/**
 * PackageBuilder — أنهار الديرة
 * Interactive 3-tab package builder: Home / Work / Custom.
 * Users pick products and save a monthly package.
 */
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Home, Briefcase, Sparkles, Plus, Minus, Package, ShoppingCart, Trash2, CheckCircle2 } from 'lucide-react';
import { formatKwd } from '@/lib/constants';
import apiClient from '@/lib/api-client';
import toast from 'react-hot-toast';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

type PackageType = 'HOME' | 'WORK' | 'CUSTOM';

interface Product {
    id: string;
    nameAr: string;
    price: number;
    discountPrice?: number | null;
    images: string[];
    category?: { nameAr: string };
}

interface PickedItem extends Product {
    qty: number;
}

const TABS: { type: PackageType; labelAr: string; icon: React.ReactNode; emoji: string }[] = [
    { type: 'HOME', labelAr: 'باقة للمنزل', icon: <Home className="w-5 h-5" />, emoji: '🏠' },
    { type: 'WORK', labelAr: 'باقة للعمل', icon: <Briefcase className="w-5 h-5" />, emoji: '💼' },
    { type: 'CUSTOM', labelAr: 'باقة أنهار الديرة', icon: <Sparkles className="w-5 h-5" />, emoji: '✨' },
];

export default function PackageBuilder() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<PackageType>('HOME');
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [picked, setPicked] = useState<PickedItem[]>([]);
    const [saving, setSaving] = useState(false);
    const [boxName, setBoxName] = useState('');

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setProducts([]);
        const fetch_ = async () => {
            try {
                const res = await fetch(`${API_BASE}/products?isActive=true&limit=12`);
                if (!res.ok) throw new Error();
                const json = await res.json();
                if (!cancelled) setProducts(json.data ?? json ?? []);
            } catch {
                if (!cancelled) setProducts([]);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        fetch_();
        return () => { cancelled = true; };
    }, [activeTab]);

    const addItem = (product: Product) => {
        setPicked((prev) => {
            const existing = prev.find((p) => p.id === product.id);
            if (existing) return prev.map((p) => p.id === product.id ? { ...p, qty: p.qty + 1 } : p);
            return [...prev, { ...product, qty: 1 }];
        });
    };

    const dec = (id: string) => {
        setPicked((prev) => prev
            .map((p) => p.id === id ? { ...p, qty: p.qty - 1 } : p)
            .filter((p) => p.qty > 0));
    };

    const remove_ = (id: string) => setPicked((prev) => prev.filter((p) => p.id !== id));

    const total = picked.reduce((acc, p) => acc + (p.discountPrice ?? p.price) * p.qty, 0);

    const handleSave = async () => {
        if (picked.length === 0) return;
        const name = boxName.trim() || `${TABS.find(t => t.type === activeTab)!.labelAr} — ${new Date().toLocaleDateString('ar-KW')}`;
        setSaving(true);
        try {
            await apiClient.post('/packages/me', {
                nameAr: name,
                type: activeTab,
                items: picked.map(p => ({ productId: p.id, quantity: p.qty })),
            });
            toast.success('✅ تم حفظ الباقة بنجاح!');
            setPicked([]);
            setBoxName('');
            router.push('/account/subscriptions');
        } catch (err: any) {
            const msg = err.response?.data?.message;
            if (err.response?.status === 401) {
                toast.error('يرجى تسجيل الدخول أولاً لحفظ الباقة');
            } else {
                toast.error(msg || 'فشل حفظ الباقة');
            }
        } finally {
            setSaving(false);
        }
    };

    const activeTab_ = TABS.find((t) => t.type === activeTab)!;

    return (
        <section className="max-w-7xl mx-auto px-4 pb-24">
            {/* Section Header */}
            <div className="flex items-center gap-3 mb-8">
                <div className="w-2 h-8 bg-brand-500 rounded-full" />
                <h2 className="text-3xl font-black text-gray-900">صمّم باقتك الشهرية</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* ── Product Picker ── */}
                <div className="lg:col-span-2">
                    {/* Tabs */}
                    <div className="flex gap-3 mb-6">
                        {TABS.map((tab) => (
                            <button
                                key={tab.type}
                                onClick={() => { setActiveTab(tab.type); setPicked([]); }}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm transition-all
                                    ${activeTab === tab.type
                                        ? 'bg-brand-600 text-white shadow-lg shadow-brand-200'
                                        : 'bg-white text-gray-600 border border-gray-100 hover:border-brand-200'
                                    }`}
                            >
                                {tab.emoji} {tab.labelAr}
                            </button>
                        ))}
                    </div>

                    {/* Products Grid */}
                    {loading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="bg-gray-100 rounded-2xl h-48 animate-pulse" />
                            ))}
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-16 bg-gray-50 rounded-3xl">
                            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-400 font-bold">لا توجد منتجات حالياً</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {products.map((product) => {
                                const inPkg = picked.find((p) => p.id === product.id);
                                const price = product.discountPrice ?? product.price;
                                const img = product.images?.[0];
                                return (
                                    <div key={product.id} className={`bg-white rounded-2xl border overflow-hidden transition-all ${inPkg ? 'border-brand-300 shadow-md' : 'border-gray-100'}`}>
                                        <div className="relative aspect-square bg-slate-50">
                                            {img ? (
                                                <Image src={img} alt={product.nameAr} fill unoptimized className="object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-200">
                                                    <Package className="w-10 h-10" />
                                                </div>
                                            )}
                                            {inPkg && (
                                                <div className="absolute top-2 end-2 bg-brand-600 text-white text-xs font-black px-2 py-0.5 rounded-full">
                                                    ×{inPkg.qty}
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-3">
                                            <p className="text-xs font-bold text-gray-800 line-clamp-2 mb-1">{product.nameAr}</p>
                                            <p className="text-brand-600 font-black text-sm mb-2">{formatKwd(price)}</p>
                                            {inPkg ? (
                                                <button
                                                    onClick={() => remove_(product.id)}
                                                    className="w-full flex items-center justify-center gap-1 py-2 bg-green-50 text-green-700 hover:bg-red-50 hover:text-red-600 font-bold text-xs rounded-xl transition-all group"
                                                >
                                                    <CheckCircle2 className="w-3.5 h-3.5 group-hover:hidden" />
                                                    <Trash2 className="w-3.5 h-3.5 hidden group-hover:block" />
                                                    <span className="group-hover:hidden">تمت الإضافة للباقة</span>
                                                    <span className="hidden group-hover:block">إزالة من الباقة</span>
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => addItem(product)}
                                                    className="w-full flex items-center justify-center gap-1 py-2 bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold text-xs rounded-xl transition-all"
                                                >
                                                    <Plus className="w-3.5 h-3.5" /> أضف للباقة
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* ── Package Summary ── */}
                <div>
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-6 sticky top-24">
                        <h3 className="font-black text-gray-900 text-lg mb-4 flex items-center gap-2">
                            {activeTab_.emoji} {activeTab_.labelAr}
                        </h3>

                        {picked.length === 0 ? (
                            <div className="text-center py-10">
                                <ShoppingCart className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                                <p className="text-sm text-gray-400 font-medium">أضف منتجات إلى باقتك</p>
                            </div>
                        ) : (
                            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                                {picked.map((item) => (
                                    <div key={item.id} className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                                            {item.images?.[0]
                                                ? <Image src={item.images[0]} alt={item.nameAr} width={40} height={40} unoptimized className="object-cover w-full h-full" />
                                                : <div className="w-full h-full flex items-center justify-center text-slate-300"><Package className="w-5 h-5" /></div>
                                            }
                                        </div>
                                        <p className="flex-1 text-xs font-bold text-gray-800 line-clamp-1">{item.nameAr}</p>
                                        <div className="flex items-center gap-1">
                                            <button onClick={() => dec(item.id)} className="w-6 h-6 rounded-md bg-gray-100 hover:bg-red-50 flex items-center justify-center">
                                                <Minus className="w-3 h-3" />
                                            </button>
                                            <span className="text-xs font-bold w-5 text-center">{item.qty}</span>
                                            <button onClick={() => addItem(item)} className="w-6 h-6 rounded-md bg-gray-100 hover:bg-brand-50 flex items-center justify-center">
                                                <Plus className="w-3 h-3" />
                                            </button>
                                            <button onClick={() => remove_(item.id)} className="w-6 h-6 flex items-center justify-center text-gray-300 hover:text-red-500 transition-colors">
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {picked.length > 0 && (
                            <>
                                <div className="border-t border-gray-50 pt-4 mb-4 flex justify-between">
                                    <span className="text-sm font-bold text-gray-600">إجمالي الباقة</span>
                                    <span className="font-black text-brand-600">{formatKwd(total)}</span>
                                </div>
                                <input
                                    className="input text-sm mb-3"
                                    placeholder="اسم الباقة (اختياري)"
                                    value={boxName}
                                    onChange={e => setBoxName(e.target.value)}
                                />
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="w-full py-3 rounded-2xl font-black text-sm transition-all bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-200 active:scale-[0.98] disabled:opacity-60"
                                >
                                    {saving ? 'جاري الحفظ...' : 'حفظ الباقة'}
                                </button>
                                <p className="text-[10px] text-gray-400 text-center mt-2 font-medium">
                                    يمكنك إعادة طلب هذه الباقة بنقرة واحدة كل شهر
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
