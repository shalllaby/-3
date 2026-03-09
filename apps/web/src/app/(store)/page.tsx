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
import FeatureHighlightsRotator from '@/components/store/FeatureHighlightsRotator';

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
            <style dangerouslySetInnerHTML={{
                __html: `

                :root {
                    --primary: #6D28D9;
                    --primary-light: #8B5CF6;
                    --primary-dark: #4C1D95;
                    --accent: #3B82F6;
                    --accent-light: #60A5FA;
                    --accent-dark: #2563EB;
                    --violet: #A78BFA;
                    --indigo: #818CF8;
                    --gradient-main: linear-gradient(135deg, #4C1D95 0%, #6D28D9 45%, #3B82F6 100%);
                    --gradient-card: linear-gradient(145deg, #312E81 0%, #5B21B6 50%, #2563EB 100%);
                    --gradient-subtle: linear-gradient(180deg, #FAFAFF 0%, #F0ECFF 100%);
                    --text-dark: #1E1044;
                    --text-mid: #5B4A82;
                    --text-light: #9B8EC0;
                    --surface: #FFFFFF;
                    --surface-2: #FAFAFF;
                    --surface-3: #F0ECFF;
                    --border: #E8E0F8;
                    --shadow-purple: 0 24px 64px rgba(109, 40, 217, 0.12);
                    --shadow-card: 0 4px 20px rgba(109, 40, 217, 0.06);
                }

                .home-page * {
                    font-family: 'Cairo', 'Tajawal', sans-serif;
                    direction: rtl;
                }

                /* ── SECTION HEADER ── */
                .section-header {
                    display: flex;
                    align-items: flex-end;
                    justify-content: space-between;
                    margin-bottom: 40px;
                    gap: 16px;
                }
                .section-tag {
                    display: inline-block;
                    font-size: 0.72rem;
                    font-weight: 800;
                    color: var(--primary);
                    background: var(--surface-3);
                    border: 1px solid var(--border);
                    padding: 5px 14px;
                    border-radius: 100px;
                    margin-bottom: 10px;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                }
                .section-title {
                    font-size: 2rem;
                    font-weight: 900;
                    color: var(--text-dark);
                    line-height: 1.2;
                    letter-spacing: -0.02em;
                }
                .section-subtitle {
                    font-size: 0.92rem;
                    color: var(--text-light);
                    margin-top: 6px;
                    font-weight: 500;
                }
                .section-link {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    color: var(--primary);
                    font-weight: 800;
                    font-size: 0.88rem;
                    text-decoration: none;
                    padding: 10px 22px;
                    border-radius: 100px;
                    border: 1.5px solid var(--border);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    white-space: nowrap;
                    background: white;
                }
                .section-link:hover {
                    background: var(--primary);
                    color: white;
                    border-color: var(--primary);
                    box-shadow: 0 8px 24px rgba(109, 40, 217, 0.25);
                    transform: translateY(-2px);
                }

                /* ── CATEGORIES ── */
                .categories-section {
                    padding: 48px 16px 0;
                    max-width: 1200px;
                    margin: 0 auto;
                }
                .cat-grid {
                    display: grid;
                    grid-template-columns: repeat(6, 1fr);
                    gap: 16px;
                }
                @media (max-width: 1024px) { .cat-grid { grid-template-columns: repeat(4, 1fr); } }
                @media (max-width: 640px) { .cat-grid { grid-template-columns: repeat(3, 1fr); gap: 10px; } }
                .cat-card {
                    background: white;
                    border-radius: 24px;
                    padding: 20px 12px 16px;
                    text-align: center;
                    text-decoration: none;
                    border: 1.5px solid var(--border);
                    box-shadow: var(--shadow-card);
                    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                    display: block;
                    position: relative;
                    overflow: hidden;
                }
                .cat-card::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(180deg, rgba(109,40,217,0.02) 0%, transparent 100%);
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }
                .cat-card:hover::before { opacity: 1; }
                .cat-card:hover {
                    border-color: var(--primary-light);
                    transform: translateY(-8px) scale(1.02);
                    box-shadow: var(--shadow-purple);
                }
                .cat-img-wrap {
                    width: 84px; height: 84px;
                    margin: 0 auto 14px;
                    border-radius: 20px;
                    overflow: hidden;
                    display: flex; align-items: center; justify-content: center;
                    background: var(--surface-3);
                    border: 1px solid var(--border);
                    transition: all 0.4s ease;
                }
                .cat-card:hover .cat-img-wrap {
                    transform: scale(1.1);
                    background: white;
                    border-color: var(--primary-light);
                    box-shadow: 0 8px 20px rgba(109, 40, 217, 0.1);
                }
                .cat-name {
                    font-size: 0.82rem;
                    font-weight: 800;
                    color: var(--text-dark);
                    line-height: 1.3;
                    letter-spacing: -0.01em;
                    position: relative;
                }
                .cat-count {
                    font-size: 0.68rem;
                    color: var(--text-light);
                    margin-top: 4px;
                    font-weight: 600;
                }

                /* ── PRODUCTS ── */
                .products-section {
                    padding: 80px 16px 0;
                    max-width: 1200px;
                    margin: 0 auto;
                }
                .products-grid {
                    display: grid;
                    grid-template-columns: repeat(5, 1fr);
                    gap: 16px;
                }
                @media (max-width: 1024px) { .products-grid { grid-template-columns: repeat(3, 1fr); } }
                @media (max-width: 640px) { .products-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; } }

                /* ── EMAIL BANNER ── */
                .email-banner {
                    margin: 60px 16px 0;
                    max-width: 1200px;
                    margin-left: auto;
                    margin-right: auto;
                    margin-top: 60px;
                    border-radius: 32px;
                    background: var(--gradient-card);
                    padding: 60px 44px;
                    text-align: center;
                    color: white;
                    position: relative;
                    overflow: hidden;
                }
                .email-banner::before {
                    content: '';
                    position: absolute;
                    width: 500px; height: 500px;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(96,165,250,0.25) 0%, transparent 70%);
                    top: -200px; right: -120px;
                }
                .email-banner::after {
                    content: '';
                    position: absolute;
                    width: 400px; height: 400px;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(167,139,250,0.2) 0%, transparent 70%);
                    bottom: -150px; left: -80px;
                }
                .email-banner-content { position: relative; z-index: 2; }
                .email-banner h2 { font-size: 2.2rem; font-weight: 900; margin-bottom: 12px; letter-spacing: -0.02em; }
                .email-banner p { font-size: 1.05rem; opacity: 0.85; margin-bottom: 32px; max-width: 440px; margin-left: auto; margin-right: auto; line-height: 1.8; }
                .email-form {
                    display: flex;
                    gap: 12px;
                    max-width: 420px;
                    margin: 0 auto;
                }
                .email-input {
                    flex: 1;
                    background: rgba(255,255,255,0.12);
                    backdrop-filter: blur(16px);
                    border: 1.5px solid rgba(255,255,255,0.2);
                    border-radius: 16px;
                    padding: 16px 20px;
                    color: white;
                    font-family: 'Cairo', sans-serif;
                    font-size: 0.95rem;
                    text-align: right;
                    outline: none;
                    transition: all 0.3s ease;
                }
                .email-input::placeholder { color: rgba(255,255,255,0.45); }
                .email-input:focus { border-color: rgba(255,255,255,0.5); background: rgba(255,255,255,0.18); }
                .email-btn {
                    background: white;
                    color: var(--primary);
                    border: none;
                    border-radius: 16px;
                    padding: 16px 28px;
                    font-family: 'Cairo', sans-serif;
                    font-weight: 900;
                    font-size: 0.95rem;
                    cursor: pointer;
                    white-space: nowrap;
                    transition: all 0.3s ease;
                }
                .email-btn:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(0,0,0,0.25); }

                /* ── REFERRAL BANNER ── */
                .referral-section {
                    padding: 80px 16px 0;
                    max-width: 1200px;
                    margin: 0 auto;
                }
                .referral-card {
                    border-radius: 32px;
                    background: linear-gradient(135deg, #0C0420 0%, #1E0A4E 35%, #172554 100%);
                    padding: 60px 52px;
                    display: grid;
                    grid-template-columns: 1fr auto;
                    align-items: center;
                    gap: 48px;
                    position: relative;
                    overflow: hidden;
                    border: 1px solid rgba(139,92,246,0.25);
                }
                @media (max-width: 768px) { .referral-card { grid-template-columns: 1fr; text-align: center; padding: 40px 24px; } }
                .referral-card::before {
                    content: '';
                    position: absolute;
                    width: 600px; height: 600px;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(109,40,217,0.35) 0%, transparent 60%);
                    top: -250px; left: -150px;
                }
                .referral-card::after {
                    content: '';
                    position: absolute;
                    width: 400px; height: 400px;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(59,130,246,0.25) 0%, transparent 60%);
                    bottom: -150px; right: 50px;
                }
                .referral-content { position: relative; z-index: 2; }
                .referral-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: rgba(139,92,246,0.15);
                    border: 1px solid rgba(139,92,246,0.35);
                    border-radius: 100px;
                    padding: 8px 20px;
                    font-size: 0.82rem;
                    font-weight: 800;
                    color: #C4B5FD;
                    margin-bottom: 20px;
                    backdrop-filter: blur(8px);
                }
                .referral-title {
                    font-size: 2.4rem;
                    font-weight: 900;
                    color: white;
                    line-height: 1.25;
                    margin-bottom: 16px;
                    letter-spacing: -0.02em;
                }
                .referral-text {
                    font-size: 1.05rem;
                    color: rgba(255,255,255,0.65);
                    line-height: 1.9;
                    max-width: 520px;
                    margin-bottom: 32px;
                }
                .referral-highlight {
                    color: #A78BFA;
                    font-weight: 900;
                }
                .referral-steps {
                    display: flex;
                    gap: 14px;
                    margin-bottom: 32px;
                }
                @media (max-width: 768px) { .referral-steps { justify-content: center; flex-wrap: wrap; gap: 10px; } }
                .referral-step {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    background: rgba(255,255,255,0.05);
                    backdrop-filter: blur(12px);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 16px;
                    padding: 10px 16px;
                    font-size: 0.84rem;
                    color: rgba(255,255,255,0.85);
                    font-weight: 700;
                    transition: all 0.3s ease;
                }
                .referral-step:hover {
                    background: rgba(255,255,255,0.1);
                    border-color: rgba(255,255,255,0.15);
                    transform: translateY(-2px);
                }
                .referral-step-num {
                    width: 26px; height: 26px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, var(--violet), var(--accent));
                    color: white;
                    font-size: 0.72rem;
                    font-weight: 900;
                    display: flex; align-items: center; justify-content: center;
                    flex-shrink: 0;
                    box-shadow: 0 4px 12px rgba(139,92,246,0.4);
                }
                .referral-cta {
                    display: inline-flex;
                    align-items: center;
                    gap: 12px;
                    background: linear-gradient(135deg, var(--primary-light), var(--accent));
                    color: white;
                    font-weight: 900;
                    font-size: 1.05rem;
                    padding: 18px 36px;
                    border-radius: 20px;
                    text-decoration: none;
                    box-shadow: 0 12px 40px rgba(109,40,217,0.4);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .referral-cta:hover { transform: translateY(-4px); box-shadow: 0 20px 56px rgba(109,40,217,0.5); }
                .referral-visual {
                    position: relative;
                    z-index: 2;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 16px;
                }
                .referral-circle {
                    width: 160px; height: 160px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, var(--primary-light), var(--accent));
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 64px;
                    box-shadow: 0 0 80px rgba(109,40,217,0.45), 0 0 120px rgba(59,130,246,0.2);
                    animation: floatOrb 4s ease-in-out infinite;
                    border: 3px solid rgba(255,255,255,0.1);
                }
                @keyframes floatOrb {
                    0%, 100% { transform: translateY(0) scale(1); }
                    50% { transform: translateY(-14px) scale(1.05); }
                }
                .referral-discount-tag {
                    background: rgba(255,255,255,0.08);
                    backdrop-filter: blur(12px);
                    border: 1px solid rgba(255,255,255,0.15);
                    border-radius: 100px;
                    padding: 10px 24px;
                    color: white;
                    font-size: 1.25rem;
                    font-weight: 900;
                    white-space: nowrap;
                }
                .referral-discount-tag span { color: #A78BFA; }

                /* ── ABOUT SECTION ── */
                .about-section {
                    background: var(--surface-2);
                    margin-top: 80px;
                    padding: 96px 16px;
                    border-top: 1px solid var(--border);
                    border-bottom: 1px solid var(--border);
                }
                .about-inner {
                    max-width: 960px;
                    margin: 0 auto;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 72px;
                    align-items: center;
                }
                @media (max-width: 768px) { .about-inner { grid-template-columns: 1fr; gap: 40px; text-align: center; } }
                .about-logo-wrap {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .about-logo-bg {
                    width: 260px; height: 260px;
                    border-radius: 50%;
                    background: linear-gradient(145deg, white, var(--surface-3));
                    border: 2px solid var(--border);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: var(--shadow-purple), 0 0 0 12px rgba(109,40,217,0.03);
                    position: relative;
                }
                .about-logo-bg::before {
                    content: '';
                    position: absolute;
                    inset: -12px;
                    border-radius: 50%;
                    background: conic-gradient(from 0deg, transparent 50%, rgba(109,40,217,0.15) 80%, rgba(59,130,246,0.1) 100%);
                    animation: spin 8s linear infinite;
                }
                @keyframes spin { to { transform: rotate(360deg); } }
                .about-tag { margin-bottom: 14px; }
                .about-title { font-size: 2.2rem; font-weight: 900; color: var(--text-dark); margin-bottom: 20px; line-height: 1.25; letter-spacing: -0.02em; }
                .about-text { font-size: 1rem; color: var(--text-mid); line-height: 2.1; margin-bottom: 32px; }
                .about-link {
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    background: var(--gradient-main);
                    color: white;
                    font-weight: 900;
                    padding: 15px 32px;
                    border-radius: 18px;
                    text-decoration: none;
                    font-size: 1rem;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 8px 28px rgba(109,40,217,0.3);
                }
                .about-link:hover { transform: translateY(-3px); box-shadow: 0 16px 44px rgba(109,40,217,0.4); }

                /* ── SPACER ── */
                .page-spacer { height: 80px; }
            ` }} />

            <main className="home-page" style={{ background: 'var(--surface-2)' }}>

                {/* ── BRAND CARD (FULL-WIDTH HEADER) ── */}
                <BrandCard />

                {/* ── ADVERTISING SLIDER ── */}
                <AdvertisingSlider images={adImages} />

                {/* ── FEATURE HIGHLIGHTS ROTATOR ── */}
                <FeatureHighlightsRotator />

                {/* ── CATEGORIES ── */}
                <div className="categories-section">
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
                        {categories.slice(0, 12).map((cat: any) => {
                            const localImagePath = `/صور الاقسام/${cat.nameAr}.png`;
                            const fullPath = path.join(process.cwd(), 'public', 'صور الاقسام', `${cat.nameAr}.png`);
                            const hasLocalImage = fs.existsSync(fullPath);

                            return (
                                <Link key={cat.id} href={`/products?categoryId=${cat.id}`} className="cat-card">
                                    <div className="cat-img-wrap">
                                        {hasLocalImage ? (
                                            <Image src={localImagePath} alt={cat.nameAr} width={80} height={80} style={{ objectFit: 'contain', width: '100%', height: '100%' }} />
                                        ) : cat.imageUrl ? (
                                            <Image src={cat.imageUrl} alt={cat.nameAr} width={80} height={80} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                                        ) : (
                                            <span style={{ fontSize: 32 }}>📦</span>
                                        )}
                                    </div>
                                    <div className="cat-name">{cat.nameAr}</div>
                                    {cat._count?.products > 0 && (
                                        <div className="cat-count">{cat._count.products} منتج</div>
                                    )}
                                </Link>
                            );
                        })}
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