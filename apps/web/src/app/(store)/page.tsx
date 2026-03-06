import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import path from 'path';
import fs from 'fs';
import { ChevronLeft } from 'lucide-react';
import ProductCard from '@/components/store/ProductCard';
import BrandCard from '@/components/store/BrandCard';
import AdvertisingSlider from '@/components/store/AdvertisingSlider';
import NewsletterBanner from '@/components/store/NewsletterBanner';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export const metadata: Metadata = {
    title: 'انهار الديرة | Anhar AL-Deera',
    description: 'أكبر تشكيلة من منتجات ومستلزمات المنزل العصري والنظافة — تحت سقف الديرة',
};

const SUPPORTED_IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'];

function getAdvertisingImages(): string[] {
    try {
        const dir = path.join(process.cwd(), 'public', 'Advertising');
        if (!fs.existsSync(dir)) return [];
        return fs
            .readdirSync(dir)
            .filter(file => SUPPORTED_IMAGE_EXTS.includes(path.extname(file).toLowerCase()))
            .sort()
            .map(file => `/Advertising/${file}`);
    } catch {
        return [];
    }
}

async function getCategories() {
    try {
        const res = await fetch(`${API_BASE}/categories`, { next: { revalidate: 300 } });
        if (!res.ok) return [];
        return res.json();
    } catch { return []; }
}

async function getLatestProducts() {
    try {
        const res = await fetch(`${API_BASE}/products?limit=10&isActive=true&sort=createdAt&order=desc`, { next: { revalidate: 30 } });
        if (!res.ok) return [];
        const json = await res.json();
        return json.data ?? [];
    } catch { return []; }
}

export default async function HomePage() {
    const [categories, latestProducts] = await Promise.all([
        getCategories(),
        getLatestProducts(),
    ]);

    const adImages = getAdvertisingImages();

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&family=Tajawal:wght@400;500;700;800;900&display=swap');

                :root {
                    --primary: #5B2D8E;
                    --primary-light: #7B4FBB;
                    --primary-dark: #3D1A6E;
                    --accent: #4169E1;
                    --accent-light: #6B8FFF;
                    --accent-dark: #2A4FBF;
                    --violet: #8B5CF6;
                    --indigo: #6366F1;
                    --gradient-main: linear-gradient(135deg, #3D1A6E 0%, #5B2D8E 35%, #4169E1 70%, #6B8FFF 100%);
                    --gradient-card: linear-gradient(145deg, #2D1B69 0%, #4B2A8A 50%, #3358D4 100%);
                    --gradient-subtle: linear-gradient(180deg, #F8F6FF 0%, #EEE8FF 100%);
                    --text-dark: #1A0A3D;
                    --text-mid: #4A3570;
                    --text-light: #8B7AAA;
                    --surface: #FFFFFF;
                    --surface-2: #F8F6FF;
                    --surface-3: #EEE8FF;
                    --border: #E2D9F3;
                    --shadow-purple: 0 20px 60px rgba(91, 45, 142, 0.2);
                    --shadow-card: 0 4px 24px rgba(91, 45, 142, 0.08);
                }

                .home-page * {
                    font-family: 'Cairo', 'Tajawal', sans-serif;
                    direction: rtl;
                }

                /* ── TRUST BADGES ── */
                .trust-section {
                    background: var(--surface);
                    padding: 0 16px;
                    position: relative;
                    z-index: 10;
                }
                .trust-grid {
                    max-width: 1200px;
                    margin: 32px auto 0;
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 16px;
                }
                @media (max-width: 768px) {
                    .trust-grid { grid-template-columns: repeat(2, 1fr); }
                }
                .trust-card {
                    background: white;
                    border-radius: 20px;
                    padding: 20px 16px;
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    box-shadow: var(--shadow-card);
                    border: 1px solid var(--border);
                    transition: all 0.3s ease;
                }
                .trust-card:hover {
                    transform: translateY(-4px);
                    box-shadow: var(--shadow-purple);
                    border-color: var(--primary-light);
                }
                .trust-icon {
                    width: 48px; height: 48px;
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    font-size: 22px;
                }
                .trust-title { font-weight: 800; font-size: 0.9rem; color: var(--text-dark); }
                .trust-desc { font-size: 0.75rem; color: var(--text-light); margin-top: 2px; }

                /* ── SECTION HEADER ── */
                .section-header {
                    display: flex;
                    align-items: flex-end;
                    justify-content: space-between;
                    margin-bottom: 28px;
                }
                .section-tag {
                    display: inline-block;
                    font-size: 0.75rem;
                    font-weight: 700;
                    color: var(--primary);
                    background: var(--surface-3);
                    padding: 4px 12px;
                    border-radius: 100px;
                    margin-bottom: 8px;
                    letter-spacing: 0.5px;
                }
                .section-title {
                    font-size: 1.7rem;
                    font-weight: 900;
                    color: var(--text-dark);
                    line-height: 1.2;
                }
                .section-subtitle {
                    font-size: 0.9rem;
                    color: var(--text-light);
                    margin-top: 4px;
                }
                .section-link {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    color: var(--primary);
                    font-weight: 700;
                    font-size: 0.9rem;
                    text-decoration: none;
                    padding: 8px 16px;
                    border-radius: 10px;
                    border: 1.5px solid var(--border);
                    transition: all 0.2s ease;
                    white-space: nowrap;
                }
                .section-link:hover {
                    background: var(--surface-3);
                    border-color: var(--primary-light);
                }

                /* ── CATEGORIES ── */
                .categories-section {
                    padding: 60px 16px 0;
                    max-width: 1200px;
                    margin: 0 auto;
                }
                .cat-grid {
                    display: grid;
                    grid-template-columns: repeat(6, 1fr);
                    gap: 12px;
                }
                @media (max-width: 1024px) { .cat-grid { grid-template-columns: repeat(4, 1fr); } }
                @media (max-width: 640px) { .cat-grid { grid-template-columns: repeat(3, 1fr); } }
                .cat-card {
                    background: white;
                    border-radius: 18px;
                    padding: 16px 10px;
                    text-align: center;
                    text-decoration: none;
                    border: 1.5px solid var(--border);
                    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                    display: block;
                }
                .cat-card:hover {
                    border-color: var(--primary-light);
                    transform: translateY(-6px) scale(1.02);
                    box-shadow: var(--shadow-purple);
                }
                .cat-img-wrap {
                    width: 52px; height: 52px;
                    margin: 0 auto 10px;
                    border-radius: 14px;
                    overflow: hidden;
                    background: var(--surface-3);
                    display: flex; align-items: center; justify-content: center;
                    transition: transform 0.3s ease;
                }
                .cat-card:hover .cat-img-wrap { transform: scale(1.1); }
                .cat-name {
                    font-size: 0.78rem;
                    font-weight: 700;
                    color: var(--text-dark);
                    line-height: 1.3;
                }
                .cat-count {
                    font-size: 0.68rem;
                    color: var(--text-light);
                    margin-top: 3px;
                }

                /* ── PRODUCTS ── */
                .products-section {
                    padding: 60px 16px 0;
                    max-width: 1200px;
                    margin: 0 auto;
                }
                .products-grid {
                    display: grid;
                    grid-template-columns: repeat(5, 1fr);
                    gap: 14px;
                }
                @media (max-width: 1024px) { .products-grid { grid-template-columns: repeat(3, 1fr); } }
                @media (max-width: 640px) { .products-grid { grid-template-columns: repeat(2, 1fr); } }

                /* ── EMAIL BANNER ── */
                .email-banner {
                    margin: 60px 16px 0;
                    max-width: 1200px;
                    margin-left: auto;
                    margin-right: auto;
                    margin-top: 60px;
                    border-radius: 28px;
                    background: var(--gradient-card);
                    padding: 52px 40px;
                    text-align: center;
                    color: white;
                    position: relative;
                    overflow: hidden;
                }
                .email-banner::before {
                    content: '';
                    position: absolute;
                    width: 400px; height: 400px;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(107,143,255,0.3) 0%, transparent 70%);
                    top: -150px; right: -100px;
                }
                .email-banner::after {
                    content: '';
                    position: absolute;
                    width: 300px; height: 300px;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(167,139,250,0.25) 0%, transparent 70%);
                    bottom: -100px; left: -50px;
                }
                .email-banner-content { position: relative; z-index: 2; }
                .email-banner h2 { font-size: 2rem; font-weight: 900; margin-bottom: 10px; }
                .email-banner p { font-size: 1rem; opacity: 0.8; margin-bottom: 28px; max-width: 420px; margin-left: auto; margin-right: auto; }
                .email-form {
                    display: flex;
                    gap: 10px;
                    max-width: 400px;
                    margin: 0 auto;
                }
                .email-input {
                    flex: 1;
                    background: rgba(255,255,255,0.15);
                    backdrop-filter: blur(12px);
                    border: 1.5px solid rgba(255,255,255,0.25);
                    border-radius: 14px;
                    padding: 14px 18px;
                    color: white;
                    font-family: 'Cairo', sans-serif;
                    font-size: 0.95rem;
                    text-align: right;
                    outline: none;
                    transition: border-color 0.2s;
                }
                .email-input::placeholder { color: rgba(255,255,255,0.5); }
                .email-input:focus { border-color: rgba(255,255,255,0.6); }
                .email-btn {
                    background: white;
                    color: var(--primary);
                    border: none;
                    border-radius: 14px;
                    padding: 14px 24px;
                    font-family: 'Cairo', sans-serif;
                    font-weight: 800;
                    font-size: 0.95rem;
                    cursor: pointer;
                    white-space: nowrap;
                    transition: all 0.2s ease;
                }
                .email-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.2); }

                /* ── REFERRAL BANNER ── */
                .referral-section {
                    padding: 60px 16px 0;
                    max-width: 1200px;
                    margin: 0 auto;
                }
                .referral-card {
                    border-radius: 28px;
                    background: linear-gradient(135deg, #0F0626 0%, #1E0A4E 40%, #0D1F6E 100%);
                    padding: 52px 48px;
                    display: grid;
                    grid-template-columns: 1fr auto;
                    align-items: center;
                    gap: 40px;
                    position: relative;
                    overflow: hidden;
                    border: 1px solid rgba(139,92,246,0.3);
                }
                @media (max-width: 768px) { .referral-card { grid-template-columns: 1fr; text-align: center; } }
                .referral-card::before {
                    content: '';
                    position: absolute;
                    width: 500px; height: 500px;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(91,45,142,0.4) 0%, transparent 65%);
                    top: -200px; left: -100px;
                }
                .referral-card::after {
                    content: '';
                    position: absolute;
                    width: 300px; height: 300px;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(65,105,225,0.3) 0%, transparent 65%);
                    bottom: -100px; right: 100px;
                }
                .referral-content { position: relative; z-index: 2; }
                .referral-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: rgba(139,92,246,0.2);
                    border: 1px solid rgba(139,92,246,0.4);
                    border-radius: 100px;
                    padding: 6px 16px;
                    font-size: 0.8rem;
                    font-weight: 700;
                    color: #C4B5FD;
                    margin-bottom: 16px;
                }
                .referral-title {
                    font-size: 2rem;
                    font-weight: 900;
                    color: white;
                    line-height: 1.3;
                    margin-bottom: 14px;
                }
                .referral-text {
                    font-size: 1rem;
                    color: rgba(255,255,255,0.7);
                    line-height: 1.8;
                    max-width: 520px;
                    margin-bottom: 28px;
                }
                .referral-highlight {
                    color: #A78BFA;
                    font-weight: 800;
                }
                .referral-steps {
                    display: flex;
                    gap: 12px;
                    margin-bottom: 28px;
                }
                @media (max-width: 768px) { .referral-steps { justify-content: center; flex-wrap: wrap; } }
                .referral-step {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: rgba(255,255,255,0.06);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 12px;
                    padding: 8px 14px;
                    font-size: 0.82rem;
                    color: rgba(255,255,255,0.8);
                    font-weight: 600;
                }
                .referral-step-num {
                    width: 22px; height: 22px;
                    border-radius: 50%;
                    background: var(--violet);
                    color: white;
                    font-size: 0.72rem;
                    font-weight: 800;
                    display: flex; align-items: center; justify-content: center;
                    flex-shrink: 0;
                }
                .referral-cta {
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    background: linear-gradient(135deg, var(--primary-light), var(--accent));
                    color: white;
                    font-weight: 800;
                    font-size: 1rem;
                    padding: 16px 32px;
                    border-radius: 16px;
                    text-decoration: none;
                    box-shadow: 0 8px 32px rgba(91,45,142,0.4);
                    transition: all 0.3s ease;
                }
                .referral-cta:hover { transform: translateY(-3px); box-shadow: 0 16px 48px rgba(91,45,142,0.5); }
                .referral-visual {
                    position: relative;
                    z-index: 2;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 12px;
                }
                .referral-circle {
                    width: 140px; height: 140px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, var(--primary-light), var(--accent));
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 56px;
                    box-shadow: 0 0 60px rgba(91,45,142,0.5);
                    animation: floatOrb 4s ease-in-out infinite;
                }
                @keyframes floatOrb {
                    0%, 100% { transform: translateY(0) scale(1); }
                    50% { transform: translateY(-12px) scale(1.04); }
                }
                .referral-discount-tag {
                    background: rgba(255,255,255,0.1);
                    border: 1px solid rgba(255,255,255,0.2);
                    border-radius: 100px;
                    padding: 8px 20px;
                    color: white;
                    font-size: 1.2rem;
                    font-weight: 900;
                    white-space: nowrap;
                }
                .referral-discount-tag span { color: #A78BFA; }

                /* ── ABOUT SECTION ── */
                .about-section {
                    background: var(--surface-2);
                    margin-top: 60px;
                    padding: 72px 16px;
                    border-top: 1px solid var(--border);
                    border-bottom: 1px solid var(--border);
                }
                .about-inner {
                    max-width: 900px;
                    margin: 0 auto;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 64px;
                    align-items: center;
                }
                @media (max-width: 768px) { .about-inner { grid-template-columns: 1fr; gap: 32px; text-align: center; } }
                .about-logo-wrap {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .about-logo-bg {
                    width: 220px; height: 220px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, var(--surface-3), white);
                    border: 2px solid var(--border);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: var(--shadow-purple);
                    position: relative;
                }
                .about-logo-bg::before {
                    content: '';
                    position: absolute;
                    inset: -8px;
                    border-radius: 50%;
                    background: conic-gradient(from 0deg, transparent 60%, rgba(91,45,142,0.2) 100%);
                    animation: spin 6s linear infinite;
                }
                @keyframes spin { to { transform: rotate(360deg); } }
                .about-tag { margin-bottom: 12px; }
                .about-title { font-size: 1.8rem; font-weight: 900; color: var(--text-dark); margin-bottom: 16px; line-height: 1.3; }
                .about-text { font-size: 0.95rem; color: var(--text-mid); line-height: 2; margin-bottom: 28px; }
                .about-link {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: var(--gradient-main);
                    color: white;
                    font-weight: 800;
                    padding: 13px 28px;
                    border-radius: 14px;
                    text-decoration: none;
                    font-size: 0.95rem;
                    transition: all 0.3s ease;
                    box-shadow: 0 6px 24px rgba(91,45,142,0.3);
                }
                .about-link:hover { transform: translateY(-2px); box-shadow: 0 12px 36px rgba(91,45,142,0.4); }

                /* ── SPACER ── */
                .page-spacer { height: 60px; }
            `}</style>

            <main className="home-page" style={{ background: 'var(--surface-2)' }}>

                {/* ── BRAND CARD (FULL-WIDTH HEADER) ── */}
                <BrandCard />

                {/* ── ADVERTISING SLIDER ── */}
                <AdvertisingSlider images={adImages} />

                {/* ── TRUST BADGES ── */}
                <div className="trust-section" style={{ paddingBottom: 0 }}>
                    <div className="trust-grid">
                        {[
                            { icon: '🏆', title: 'شهادة جودة', desc: 'معتمدة عالمياً', bg: '#F3EEFF', color: '#5B2D8E' },
                            { icon: '🌿', title: 'مواد حلال', desc: 'نسبة نقاء 100%', bg: '#E8F5E9', color: '#2E7D32' },
                            { icon: '💎', title: 'أسعار تنافسية', desc: 'أفضل قيمة لعملائنا', bg: '#E8EAF6', color: '#3949AB' },
                            { icon: '🚀', title: 'سرعة توصيل', desc: 'أينما كنتم في الكويت', bg: '#E3F2FD', color: '#1565C0' },
                        ].map(item => (
                            <div key={item.title} className="trust-card">
                                <div className="trust-icon" style={{ background: item.bg, color: item.color }}>
                                    {item.icon}
                                </div>
                                <div>
                                    <div className="trust-title">{item.title}</div>
                                    <div className="trust-desc">{item.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── CATEGORIES ── */}
                <div className="categories-section" style={{ paddingTop: 64 }}>
                    <div className="section-header">
                        <div>
                            <span className="section-tag">التصنيفات</span>
                            <h2 className="section-title">تسوق حسب التصنيف</h2>
                            <p className="section-subtitle">اكتشف مجموعتنا الواسعة من المنتجات</p>
                        </div>
                        <Link href="/products" className="section-link">
                            عرض الكل <ChevronLeft size={16} />
                        </Link>
                    </div>

                    <div className="cat-grid">
                        {categories.slice(0, 12).map((cat: any) => (
                            <Link key={cat.id} href={`/products?categoryId=${cat.id}`} className="cat-card">
                                <div className="cat-img-wrap">
                                    {cat.imageUrl
                                        ? <Image src={cat.imageUrl} alt={cat.nameAr} width={52} height={52} style={{ objectFit: 'cover' }} />
                                        : <span style={{ fontSize: 24 }}>📦</span>
                                    }
                                </div>
                                <div className="cat-name">{cat.nameAr}</div>
                                {cat._count?.products > 0 && (
                                    <div className="cat-count">{cat._count.products} منتج</div>
                                )}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* ── LATEST PRODUCTS ── */}
                {latestProducts.length > 0 && (
                    <div className="products-section">
                        <div className="section-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                <div style={{ width: 6, height: 36, background: 'var(--gradient-main)', borderRadius: 3 }} />
                                <div>
                                    <span className="section-tag">جديد</span>
                                    <h2 className="section-title">وصل حديثاً</h2>
                                    <p className="section-subtitle">أحدث المنتجات المضافة لمتجرنا</p>
                                </div>
                            </div>
                            <Link href="/products" className="section-link">
                                عرض الكل <ChevronLeft size={16} />
                            </Link>
                        </div>
                        <div className="products-grid">
                            {latestProducts.map((product: any) => (
                                <ProductCard key={product.id} product={product} compact />
                            ))}
                        </div>
                    </div>
                )}

                {/* ── EMAIL BANNER ── */}
                <NewsletterBanner />

                {/* ── REFERRAL BANNER ── */}
                <div className="referral-section">
                    <div className="referral-card">
                        <div className="referral-content">
                            <div className="referral-badge">
                                🎁 برنامج الإحالة
                            </div>
                            <h2 className="referral-title">
                                شارك واكسب<br />مع الديرة
                            </h2>
                            <p className="referral-text">
                                ادعُ 5 من أصدقائك للتسجيل في متجر انهار الديرة، واحصل فوراً على{' '}
                                <span className="referral-highlight">خصم 5%</span>{' '}
                                المرة القادمة التي تتسوق فيها معنا!
                            </p>
                            <div className="referral-steps">
                                <div className="referral-step">
                                    <div className="referral-step-num">1</div>
                                    سجّل الآن
                                </div>
                                <div className="referral-step">
                                    <div className="referral-step-num">2</div>
                                    شارك الرابط
                                </div>
                                <div className="referral-step">
                                    <div className="referral-step-num">3</div>
                                    5 أصدقاء
                                </div>
                                <div className="referral-step">
                                    <div className="referral-step-num">✓</div>
                                    خصم 5%
                                </div>
                            </div>
                            <Link href="/referral" className="referral-cta">
                                🔗 أنشئ رابط الإحالة الخاص بك
                            </Link>
                        </div>
                        <div className="referral-visual">
                            <div className="referral-circle">🎁</div>
                            <div className="referral-discount-tag">خصم <span>5%</span> مضمون</div>
                        </div>
                    </div>
                </div>

                {/* ── ABOUT SECTION ── */}
                <div className="about-section">
                    <div className="about-inner">
                        <div className="about-logo-wrap">
                            <div className="about-logo-bg">
                                <Image
                                    src="/logo-2.png"
                                    alt="انهار الديرة"
                                    width={160}
                                    height={160}
                                    style={{ objectFit: 'contain', position: 'relative', zIndex: 1 }}
                                />
                            </div>
                        </div>
                        <div>
                            <span className="section-tag about-tag">من نحن</span>
                            <h2 className="about-title">تحت سقف الديرة — كل ما تحتاج</h2>
                            <p className="about-text">
                                حرصنا على توفير أكبر تشكيلة من منتجات ومستلزمات وأدوات المنزل العصري والنظافة تحت سقف واحد لخدمة أهل الديرة. منتجاتنا الورقية والبلاستيكية والأواني حاصلة على شهادات وتصنّع من خامات آمنة جداً ومواد حلال معتمدة.
                            </p>
                            <Link href="/about" className="about-link">
                                اعرف المزيد عن انهار الديرة
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="page-spacer" />
            </main>
        </>
    );
}