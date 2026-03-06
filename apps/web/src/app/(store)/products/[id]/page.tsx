import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductDetailsClient from '@/components/store/ProductDetailsClient';
import ProductReviews from '@/components/store/ProductReviews';
import ProductCard from '@/components/store/ProductCard';
import { ArrowLeft, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

async function getProduct(id: string) {
    try {
        const res = await fetch(`${API_BASE}/products/${id}`, { next: { revalidate: 60 } });
        if (!res.ok) return null;
        const json = await res.json();
        return json.data || json;
    } catch {
        return null;
    }
}

async function getRelatedProducts(id: string, categoryId?: string) {
    try {
        const url = categoryId
            ? `${API_BASE}/products?categoryId=${categoryId}&limit=5&isActive=true`
            : `${API_BASE}/products?limit=5&isActive=true`;
        const res = await fetch(url, { next: { revalidate: 300 } });
        if (!res.ok) return [];
        const json = await res.json();
        const items = json.data ?? [];
        return items.filter((p: any) => p.id !== id).slice(0, 4);
    } catch {
        return [];
    }
}

async function getRatingSummary(id: string) {
    try {
        const res = await fetch(`${API_BASE}/products/${id}/reviews/summary`, { next: { revalidate: 60 } });
        if (!res.ok) return null;
        return await res.json();
    } catch {
        return null;
    }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const product = await getProduct(params.id);
    if (!product) return { title: 'المنتج غير موجود' };

    return {
        title: product.nameAr,
        description: product.descriptionAr || `تسوق ${product.nameAr} من الديرة باك — أفضل جودة وأسرع توصيل في الكويت`,
        openGraph: {
            title: product.nameAr,
            description: product.descriptionAr,
            images: product.images?.[0] ? [{ url: product.images[0], width: 800, height: 800 }] : [],
        },
    };
}

export default async function ProductPage({ params }: { params: { id: string } }) {
    const product = await getProduct(params.id);

    if (!product) {
        notFound();
    }

    const [relatedProducts, ratingSummary] = await Promise.all([
        getRelatedProducts(product.id, product.category?.id),
        getRatingSummary(params.id),
    ]);

    return (
        <main className="min-h-screen bg-white relative">

            {/* Background Decorations */}
            <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-brand-50/50 to-transparent -z-10 pointer-events-none" />
            <div className="absolute top-[10%] right-[-5%] w-[40%] aspect-square bg-brand-100/20 rounded-full blur-[120px] -z-10 pointer-events-none" />
            <div className="absolute top-[40%] left-[-5%] w-[30%] aspect-square bg-accent-100/20 rounded-full blur-[100px] -z-10 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 py-8 lg:py-16">

                {/* Custom Breadcrumb Nav */}
                <nav aria-label="Breadcrumb" className="mb-8">
                    <ol className="flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide py-2 text-sm">
                        <li>
                            <Link href="/" className="text-gray-500 hover:text-brand-600 transition-colors font-medium">الرئيسية</Link>
                        </li>
                        <ChevronLeft className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <li>
                            <Link href="/products" className="text-gray-500 hover:text-brand-600 transition-colors font-medium">المنتجات</Link>
                        </li>
                        <ChevronLeft className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        {product.category && (
                            <>
                                <li>
                                    <Link href={`/products?categoryId=${product.category.id}`} className="text-gray-500 hover:text-brand-600 transition-colors font-medium">
                                        {product.category.nameAr}
                                    </Link>
                                </li>
                                <ChevronLeft className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            </>
                        )}
                        <li aria-current="page">
                            <span className="text-brand-600 font-bold">{product.nameAr}</span>
                        </li>
                    </ol>
                </nav>

                {/* Main Product Section */}
                <section className="animate-fade-in mb-16">
                    <ProductDetailsClient product={product} ratingSummary={ratingSummary ?? undefined} />
                </section>

                {/* Reviews Section */}
                <section className="animate-fade-in">
                    <ProductReviews productId={product.id} />
                </section>

                {/* Upsell / Related Products */}
                {relatedProducts.length > 0 && (
                    <section className="border-t border-gray-100 pt-20 animate-slide-up">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                            <div className="max-w-xl">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-1.5 h-8 bg-brand-500 rounded-full" />
                                    <h2 className="text-3xl font-black text-gray-900">قد يعجبك أيضاً</h2>
                                </div>
                                <p className="text-gray-500 font-medium">استكشف المزيد من المنتجات المختارة لك بعناية من نفس الفئة</p>
                            </div>
                            <Link
                                href="/products"
                                className="inline-flex items-center gap-2 text-brand-600 font-black hover:gap-4 transition-all group"
                            >
                                عرض كل المنتجات
                                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
                            {relatedProducts.map((p: any) => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Bottom CTA / Newsletter Segment (Consistent with Home Page) */}
                <section className="mt-32">
                    <div className="rounded-[3rem] bg-gradient-to-br from-brand-600 via-brand-500 to-accent-600 p-8 lg:p-16 text-white text-center relative overflow-hidden shadow-2xl shadow-brand-200">
                        {/* Decorative circles */}
                        <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-accent-400/20 rounded-full blur-3xl" />

                        <div className="relative z-10">
                            <h2 className="text-3xl lg:text-5xl font-black mb-6">انضم إلى أنهار الديرة</h2>
                            <p className="text-white/80 mb-10 max-w-2xl mx-auto text-lg leading-relaxed font-bold">
                                كن أول من يعرف عن العروض الحصرية والمنتجات الجديدة التي تصلنا أسبوعياً
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto bg-white/10 p-2 rounded-3xl backdrop-blur-md">
                                <input
                                    type="email"
                                    placeholder="بريدك الإلكتروني"
                                    className="flex-1 bg-transparent text-white placeholder-white/60 px-6 py-4 rounded-2xl focus:outline-none text-right font-bold"
                                />
                                <button className="bg-white text-brand-600 font-black px-10 py-4 rounded-2xl hover:bg-brand-50 transition-all shadow-xl active:scale-95 whitespace-nowrap">
                                    اشترك الآن
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
