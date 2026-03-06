import { Metadata } from 'next';
import ProductCard from '@/components/store/ProductCard';
import PackageBuilder from '@/components/store/PackageBuilder';
import { Tag, Sparkles, Percent, Calendar } from 'lucide-react';
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export const metadata: Metadata = {
    title: 'أقوى العروض الحصرية',
    description: 'وفر الكثير مع عروض أنهار الديرة الحصرية. خصومات تصل إلى 50% على منتجات مختارة في الكويت.',
};

async function getFeaturedProducts() {
    try {
        const res = await fetch(`${API_BASE}/products?featured=true&isActive=true`, { next: { revalidate: 60 } });
        if (!res.ok) return [];
        const json = await res.json();
        return json.data ?? [];
    } catch { return []; }
}

export default async function OffersPage() {
    const products = await getFeaturedProducts();

    return (
        <main className="min-h-screen bg-white">
            {/* ── HERO ── */}
            <section className="relative py-20 lg:py-32 bg-red-600 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-red-700 via-red-600 to-orange-500 z-10" />
                <div className="absolute top-0 left-0 right-0 bottom-0 opacity-10 pointer-events-none z-0" style={{
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'white\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                }} />

                <div className="relative z-20 max-w-7xl mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-black mb-8 border border-white/20">
                        <Tag className="w-4 h-4" />
                        <span>عروض لفترة محدودة</span>
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-black text-white mb-6 uppercase tracking-tight">
                        مهرجان <span className="text-yellow-300">التوفير</span>
                    </h1>
                    <p className="text-red-50 max-w-2xl mx-auto text-xl font-bold opacity-90 leading-relaxed">
                        استمتع بخصومات حصرية تصل إلى 50% على أفضل منتجات النظافة والمنزل. العروض سارية حتى نفاد الكمية!
                    </p>
                </div>
            </section>

            {/* ── FEATURES ── */}
            <section className="max-w-7xl mx-auto px-4 -mt-10 mb-20 relative z-30">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-50 flex items-center gap-6 group hover:border-red-100 transition-all">
                        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                            <Sparkles className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-gray-900 mb-1">منتجات مميزة</h3>
                            <p className="text-sm text-gray-500 font-medium">أفضل الماركات بأقل الأسعار</p>
                        </div>
                    </div>
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-50 flex items-center gap-6 group hover:border-red-100 transition-all">
                        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                            <Percent className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-gray-900 mb-1">خصومات هائلة</h3>
                            <p className="text-sm text-gray-500 font-medium">توفير حقيقي لكل سلة تسوق</p>
                        </div>
                    </div>
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-50 flex items-center gap-6 group hover:border-red-100 transition-all">
                        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                            <Calendar className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-gray-900 mb-1">عروض أسبوعية</h3>
                            <p className="text-sm text-gray-500 font-medium">تحديثات مستمرة لأفضل الصفقات</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── PRODUCTS ── */}
            <section className="max-w-7xl mx-auto px-4 pb-20">
                <div className="flex items-center gap-3 mb-10">
                    <div className="w-2 h-8 bg-red-500 rounded-full" />
                    <h2 className="text-3xl font-black text-gray-900">أحدث العروض الحالية</h2>
                </div>

                {products.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-10">
                        {products.map((product: any) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                        <p className="text-gray-400 font-black text-xl">لا توجد عروض نشطة حالياً. انتظرونا قريباً!</p>
                        <Link href="/products" className="mt-8 inline-block bg-red-600 text-white font-black px-10 py-4 rounded-2xl hover:bg-red-700 transition-all shadow-xl shadow-red-100">
                            تسوق المنتجات العادية
                        </Link>
                    </div>
                )}
            </section>

            {/* ── PACKAGE BUILDER ── */}
            <div className="border-t border-gray-100">
                <PackageBuilder />
            </div>
        </main>
    );
}
