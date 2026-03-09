import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import path from 'path';
import fs from 'fs';
import { ArrowLeft, LayoutGrid, ChevronRight } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export const metadata: Metadata = {
    title: 'تصنيفات المنتجات',
    description: 'تصفح جميع أقسام أنهار الديرة واكتشف ما يناسب احتياجاتك',
};

async function getCategories() {
    try {
        const res = await fetch(`${API_BASE}/categories`, { next: { revalidate: 300 } });
        if (!res.ok) return [];
        return res.json();
    } catch { return []; }
}

export default async function CategoriesPage() {
    const categories = await getCategories();

    return (
        <main className="min-h-screen bg-slate-50 py-12 lg:py-20">
            <div className="max-w-7xl mx-auto px-4">

                {/* ── HEADER ── */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="max-w-xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-brand-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-brand-200">
                                <LayoutGrid className="w-6 h-6" />
                            </div>
                            <h1 className="text-3xl lg:text-4xl font-black text-gray-900">تسوق حسب التصنيف</h1>
                        </div>
                        <p className="text-gray-500 font-medium text-lg leading-relaxed">
                            استكشف مجموعتنا الواسعة من التصنيفات المختارة بعناية لتناسب جميع احتياجات منزلك ونظافتك.
                        </p>
                    </div>
                </div>

                {/* ── ALL + CATEGORIES GRID ── */}


                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {categories.map((cat: any) => {
                        const isDiscount = cat.slug === 'discounts' || cat.nameAr === 'الخصومات';
                        const imageName = `${cat.nameAr}.png`;
                        const localImagePath = `/صور الاقسام/${imageName}`;

                        // Rule: If we have a remote imageUrl in DB, use it (best for Production)
                        // Otherwise, try to find it locally (best for Local dev)
                        let finalSrc = cat.imageUrl || localImagePath;

                        // Check if we should override with local if it exists
                        const possiblePublicPaths = [
                            path.join(process.cwd(), 'public'),
                            path.join(process.cwd(), 'apps', 'web', 'public')
                        ];

                        let localExists = false;
                        for (const p of possiblePublicPaths) {
                            if (fs.existsSync(path.join(p, 'صور الاقسام', imageName))) {
                                localExists = true;
                                break;
                            }
                        }

                        // If it doesn't exist locally AND we don't have a remote URL, show box
                        if (!localExists && !cat.imageUrl) {
                            finalSrc = null;
                        }

                        return (
                            <Link
                                key={cat.id}
                                href={`/products?categoryId=${cat.id}`}
                                className={`group bg-white rounded-[2rem] p-6 border border-transparent hover:border-brand-100 hover:shadow-2xl hover:shadow-brand-100/20 transition-all duration-500 flex flex-col items-center text-center ${isDiscount ? 'cat-card-featured pulse-border' : ''}`}
                            >
                                {isDiscount && <div className="cat-badge">🔥 عروض كبرى</div>}
                                <div className="w-24 h-24 bg-brand-50 rounded-[2rem] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-brand-100 transition-all duration-500 overflow-hidden relative">
                                    {finalSrc ? (
                                        <Image
                                            src={encodeURI(finalSrc)}
                                            alt={cat.nameAr}
                                            fill
                                            className="object-contain p-2"
                                            unoptimized
                                        />
                                    ) : (
                                        <span className="text-4xl">📦</span>
                                    )}
                                </div>

                                <h2 className="text-xl font-black text-gray-900 mb-2 group-hover:text-brand-600 transition-colors">
                                    {cat.nameAr}
                                </h2>

                                {cat._count?.products !== undefined && (
                                    <p className="text-xs font-bold text-brand-400 uppercase tracking-widest mb-6">
                                        {cat._count.products} منتج متوفر
                                    </p>
                                )}

                                <div className="mt-auto w-full pt-6 border-t border-slate-50 flex items-center justify-center gap-2 text-brand-600 font-black text-sm group-hover:gap-4 transition-all">
                                    <span>تصفح الآن</span>
                                    <ArrowLeft className="w-4 h-4" />
                                </div>
                            </Link>
                        );
                    })}

                    {/* Empty State */}
                    {categories.length === 0 && (
                        <div className="col-span-full py-20 bg-white rounded-[3rem] text-center border-2 border-dashed border-gray-100">
                            <p className="text-gray-400 font-bold">لا توجد تصنيفات حالياً</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
