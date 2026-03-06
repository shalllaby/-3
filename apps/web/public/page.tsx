import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft } from 'lucide-react';
import ProductCard from '@/components/store/ProductCard';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export const metadata: Metadata = {
    title: 'انهار الديرة | Anhar AL-Deera',
    description: 'أكبر تشكيلة من منتجات ومستلزمات المنزل العصري والنظافة — تحت سقف الديرة',
};

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

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&display=swap');

                /* ─────────────────────────────────────────
                   LIGHT THEME — Anhar AL-Deera
                   Primary  : #6C3EB8  (soft purple)
                   Accent   : #5B7FE8  (periwinkle blue)
                   Surface  : #FFFFFF / #F7F5FF / #EEE9FF
                   Text     : #1E1035 / #4B3B7A / #8E82AA
                ───────────────────────────────────────── */
                :root {
                    --p:       #6C3EB8;
                    --p-mid:   #8B5CF6;
                    --p-light: #A78BFA;
                    --p-soft:  #EDE9FE;
                    --p-xsoft: #F5F3FF;
                    --a:       #5B7FE8;
                    --a-light: #93ACFF;
                    --a-soft:  #EEF2FF;
                    --grad:    linear-gradient(135deg,#7C4DBC 0%,#6C3EB8 30%,#5B7FE8 70%,#93ACFF 100%);
                    --grad-card: linear-gradient(135deg,#8058C8 0%,#6C3EB8 50%,#5268D5 100%);
                    --t1: #1E1035;
                    --t2: #4B3B7A;
                    --t3: #8E82AA;
                    --s0: #FFFFFF;
                    --s1: #F7F5FF;
                    --s2: #EDE9FE;
                    --bd: #DDD5F5;
                    --sh: 0 4px 28px rgba(108,62,184,0.10);
                    --sh-hover: 0 12px 40px rgba(108,62,184,0.18);
                }

                .hp * { font-family:'Cairo',sans-serif; direction:rtl; }
                .hp { background:var(--s1); }

                /* ── ANIMATIONS ── */
                @keyframes floatY   { 0%,100%{transform:translateY(0)}  50%{transform:translateY(-18px)} }
                @keyframes spinRing { to{transform:rotate(360deg)} }
                @keyframes blink    { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.6)} }
                @keyframes shimmer  { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
                @keyframes fadeUp   { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }

                /* ════════════════════════════════════════
                   HERO
                ════════════════════════════════════════ */
                .hero {
                    position:relative; overflow:hidden;
                    background: var(--grad);
                    min-height:82vh;
                    display:flex; align-items:center;
                }
                /* subtle grid */
                .hero::before {
                    content:'';
                    position:absolute; inset:0;
                    background-image:
                        linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px),
                        linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px);
                    background-size:56px 56px;
                }
                /* soft orbs */
                .h-orb { position:absolute; border-radius:50%; pointer-events:none; }
                .h-orb-1 { width:580px;height:580px; background:radial-gradient(circle,rgba(160,130,255,.28) 0%,transparent 70%); top:-220px;left:-160px; animation:floatY 9s ease-in-out infinite; }
                .h-orb-2 { width:360px;height:360px; background:radial-gradient(circle,rgba(100,150,255,.22) 0%,transparent 70%); bottom:-120px;right:-80px;  animation:floatY 11s ease-in-out infinite reverse; }
                .h-orb-3 { width:180px;height:180px; background:radial-gradient(circle,rgba(255,255,255,.12) 0%,transparent 70%); top:38%;right:22%;       animation:floatY 7s ease-in-out infinite; }

                .hero-inner {
                    position:relative; z-index:4;
                    max-width:1200px; margin:0 auto;
                    padding:88px 24px 116px;
                    width:100%; text-align:center;
                    animation:fadeUp .8s ease both;
                }

                /* logo ring */
                .logo-ring { position:relative; width:116px;height:116px; margin:0 auto 30px; }
                .logo-ring-bg {
                    position:absolute; inset:-3px; border-radius:50%;
                    background:conic-gradient(from 0deg,#C4B5FD,#93ACFF,#8B5CF6,#C4B5FD);
                    animation:spinRing 5s linear infinite;
                }
                .logo-ring-white { position:absolute; inset:1px; border-radius:50%; background:#fff; z-index:1; }
                .logo-ring-img   { position:absolute; inset:7px; border-radius:50%; background:#fff; z-index:2; display:flex; align-items:center; justify-content:center; padding:6px; }

                /* badge */
                .hero-badge {
                    display:inline-flex; align-items:center; gap:8px;
                    background:rgba(255,255,255,.18); backdrop-filter:blur(14px);
                    border:1px solid rgba(255,255,255,.3); border-radius:100px;
                    padding:7px 20px; font-size:.85rem; color:#fff; font-weight:700;
                    margin-bottom:24px;
                }
                .badge-dot { width:7px;height:7px; background:#C4B5FD; border-radius:50%; animation:blink 2s ease-in-out infinite; }

                .hero-title {
                    font-size:clamp(2.2rem,5vw,3.6rem);
                    font-weight:900; color:#fff;
                    line-height:1.22; margin-bottom:18px;
                    text-shadow:0 2px 24px rgba(0,0,0,.15);
                }
                .hero-title-sub {
                    background:linear-gradient(135deg,#DDD6FE,#BAC9FF);
                    -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
                }
                .hero-sub {
                    font-size:1.05rem; color:rgba(255,255,255,.82);
                    line-height:1.9; max-width:520px; margin:0 auto 36px;
                }
                .cta-row { display:flex; justify-content:center; gap:12px; flex-wrap:wrap; }
                .cta-main {
                    display:inline-flex; align-items:center; gap:9px;
                    background:#fff; color:var(--p);
                    font-weight:800; font-size:.97rem;
                    padding:14px 34px; border-radius:14px; text-decoration:none;
                    box-shadow:0 6px 28px rgba(0,0,0,.18);
                    transition:all .28s cubic-bezier(.34,1.56,.64,1);
                }
                .cta-main:hover { transform:translateY(-3px) scale(1.02); box-shadow:0 14px 40px rgba(0,0,0,.22); }
                .cta-sec {
                    display:inline-flex; align-items:center; gap:9px;
                    background:rgba(255,255,255,.14); backdrop-filter:blur(12px);
                    border:1.5px solid rgba(255,255,255,.32); color:#fff;
                    font-weight:700; font-size:.97rem;
                    padding:14px 28px; border-radius:14px; text-decoration:none;
                    transition:all .25s ease;
                }
                .cta-sec:hover { background:rgba(255,255,255,.22); transform:translateY(-2px); }

                /* stats row */
                .hero-stats {
                    display:flex; justify-content:center; gap:44px; flex-wrap:wrap;
                    margin-top:52px; padding-top:36px;
                    border-top:1px solid rgba(255,255,255,.18);
                }
                .stat-n { font-size:1.9rem; font-weight:900; color:#fff; }
                .stat-l { font-size:.8rem; color:rgba(255,255,255,.62); margin-top:2px; }

                /* wave */
                .hero-wave { position:absolute; bottom:-1px; left:0; right:0; z-index:5; }

                /* ════════════════════════════════════════
                   TRUST CARDS — float up from hero
                ════════════════════════════════════════ */
                .trust-wrap { background:var(--s0); }
                .trust-grid {
                    max-width:1200px; margin:-34px auto 0; padding:0 16px;
                    display:grid; grid-template-columns:repeat(4,1fr); gap:14px;
                }
                @media(max-width:768px){ .trust-grid{grid-template-columns:repeat(2,1fr);} }
                .trust-card {
                    background:#fff; border-radius:18px;
                    padding:18px 14px;
                    display:flex; align-items:center; gap:13px;
                    box-shadow:var(--sh); border:1.5px solid var(--bd);
                    transition:all .28s ease;
                }
                .trust-card:hover { transform:translateY(-5px); box-shadow:var(--sh-hover); border-color:var(--p-light); }
                .t-icon { width:46px;height:46px; border-radius:13px; display:flex; align-items:center; justify-content:center; font-size:21px; flex-shrink:0; }
                .t-title { font-weight:800; font-size:.88rem; color:var(--t1); }
                .t-desc  { font-size:.72rem; color:var(--t3); margin-top:1px; }

                /* ════════════════════════════════════════
                   SHARED SECTION HELPERS
                ════════════════════════════════════════ */
                .sec-wrap { max-width:1200px; margin:0 auto; padding:64px 16px 0; }
                .sec-hd   { display:flex; align-items:flex-end; justify-content:space-between; margin-bottom:26px; }
                .sec-tag  {
                    display:inline-block; font-size:.72rem; font-weight:800;
                    color:var(--p); background:var(--p-soft);
                    padding:3px 11px; border-radius:100px; margin-bottom:7px;
                    letter-spacing:.4px;
                }
                .sec-title { font-size:1.6rem; font-weight:900; color:var(--t1); line-height:1.2; }
                .sec-sub   { font-size:.87rem; color:var(--t3); margin-top:3px; }
                .sec-link  {
                    display:flex; align-items:center; gap:5px;
                    color:var(--p); font-weight:700; font-size:.87rem;
                    text-decoration:none; padding:7px 14px; border-radius:10px;
                    border:1.5px solid var(--bd); white-space:nowrap;
                    transition:all .2s ease;
                }
                .sec-link:hover { background:var(--p-soft); border-color:var(--p-light); }

                /* ════════════════════════════════════════
                   CATEGORIES
                ════════════════════════════════════════ */
                .cat-grid {
                    display:grid;
                    grid-template-columns:repeat(6,1fr); gap:11px;
                }
                @media(max-width:1024px){ .cat-grid{grid-template-columns:repeat(4,1fr);} }
                @media(max-width:640px) { .cat-grid{grid-template-columns:repeat(3,1fr);} }

                .cat-card {
                    background:#fff; border-radius:16px; padding:14px 8px;
                    text-align:center; text-decoration:none;
                    border:1.5px solid var(--bd);
                    transition:all .3s cubic-bezier(.34,1.56,.64,1);
                    display:block;
                }
                .cat-card:hover { border-color:var(--p-light); transform:translateY(-6px) scale(1.02); box-shadow:var(--sh-hover); }
                .cat-ico {
                    width:50px;height:50px; margin:0 auto 9px; border-radius:13px;
                    background:var(--p-soft); overflow:hidden;
                    display:flex; align-items:center; justify-content:center;
                    transition:transform .3s ease;
                }
                .cat-card:hover .cat-ico { transform:scale(1.1); }
                .cat-nm   { font-size:.78rem; font-weight:700; color:var(--t1); line-height:1.3; }
                .cat-cnt  { font-size:.68rem; color:var(--t3); margin-top:2px; }

                /* ════════════════════════════════════════
                   PRODUCTS
                ════════════════════════════════════════ */
                .prod-grid {
                    display:grid;
                    grid-template-columns:repeat(5,1fr); gap:13px;
                }
                @media(max-width:1024px){ .prod-grid{grid-template-columns:repeat(3,1fr);} }
                @media(max-width:640px) { .prod-grid{grid-template-columns:repeat(2,1fr);} }

                /* ════════════════════════════════════════
                   PROMO STRIP  (between cats & products)
                ════════════════════════════════════════ */
                .promo-strip {
                    max-width:1200px; margin:52px auto 0; padding:0 16px;
                    display:grid; grid-template-columns:repeat(3,1fr); gap:14px;
                }
                @media(max-width:768px){ .promo-strip{grid-template-columns:1fr;} }
                .promo-card {
                    border-radius:20px; padding:24px 22px;
                    display:flex; align-items:center; gap:16px;
                    border:1.5px solid var(--bd); background:#fff;
                    transition:all .28s ease; text-decoration:none;
                }
                .promo-card:hover { box-shadow:var(--sh-hover); transform:translateY(-3px); border-color:var(--p-light); }
                .promo-ico { width:52px;height:52px; border-radius:14px; display:flex; align-items:center; justify-content:center; font-size:24px; flex-shrink:0; }
                .promo-title { font-size:.95rem; font-weight:800; color:var(--t1); margin-bottom:3px; }
                .promo-sub   { font-size:.78rem; color:var(--t3); line-height:1.5; }

                /* ════════════════════════════════════════
                   EMAIL BANNER
                ════════════════════════════════════════ */
                .email-wrap { max-width:1200px; margin:60px auto 0; padding:0 16px; }
                .email-card {
                    border-radius:24px;
                    background:var(--grad-card);
                    padding:48px 36px; text-align:center; color:#fff;
                    position:relative; overflow:hidden;
                }
                .email-card::before {
                    content:''; position:absolute;
                    width:380px;height:380px; border-radius:50%;
                    background:radial-gradient(circle,rgba(180,150,255,.22) 0%,transparent 70%);
                    top:-160px;right:-80px;
                }
                .email-card::after {
                    content:''; position:absolute;
                    width:260px;height:260px; border-radius:50%;
                    background:radial-gradient(circle,rgba(120,160,255,.18) 0%,transparent 70%);
                    bottom:-80px;left:-40px;
                }
                .email-inner { position:relative; z-index:2; }
                .email-card h2 { font-size:1.8rem; font-weight:900; margin-bottom:8px; }
                .email-card p  { font-size:.92rem; opacity:.82; margin-bottom:24px; max-width:400px; margin-left:auto; margin-right:auto; }
                .email-row { display:flex; gap:10px; max-width:380px; margin:0 auto; }
                .email-inp {
                    flex:1; background:rgba(255,255,255,.18); backdrop-filter:blur(10px);
                    border:1.5px solid rgba(255,255,255,.3); border-radius:12px;
                    padding:12px 16px; color:#fff; font-family:'Cairo',sans-serif;
                    font-size:.9rem; text-align:right; outline:none;
                    transition:border-color .2s;
                }
                .email-inp::placeholder { color:rgba(255,255,255,.5); }
                .email-inp:focus { border-color:rgba(255,255,255,.65); }
                .email-btn {
                    background:#fff; color:var(--p); border:none; border-radius:12px;
                    padding:12px 22px; font-family:'Cairo',sans-serif;
                    font-weight:800; font-size:.9rem; cursor:pointer; white-space:nowrap;
                    transition:all .22s ease;
                }
                .email-btn:hover { transform:translateY(-2px); box-shadow:0 6px 20px rgba(0,0,0,.18); }

                /* ════════════════════════════════════════
                   REFERRAL CARD
                ════════════════════════════════════════ */
                .ref-wrap { max-width:1200px; margin:48px auto 0; padding:0 16px; }
                .ref-card {
                    border-radius:24px;
                    background:linear-gradient(135deg,#F5F3FF 0%,#EDE9FE 50%,#E0E7FF 100%);
                    border:1.5px solid var(--bd);
                    padding:48px 44px;
                    display:grid; grid-template-columns:1fr auto; align-items:center; gap:36px;
                    position:relative; overflow:hidden;
                }
                @media(max-width:768px){ .ref-card{grid-template-columns:1fr;text-align:center;} }
                .ref-card::before {
                    content:''; position:absolute;
                    width:320px;height:320px; border-radius:50%;
                    background:radial-gradient(circle,rgba(108,62,184,.09) 0%,transparent 70%);
                    top:-100px;right:-60px;
                }
                .ref-content { position:relative; z-index:2; }
                .ref-badge {
                    display:inline-flex; align-items:center; gap:7px;
                    background:var(--p-soft); border:1px solid var(--p-light);
                    border-radius:100px; padding:5px 14px;
                    font-size:.78rem; font-weight:800; color:var(--p); margin-bottom:14px;
                }
                .ref-title  { font-size:1.8rem; font-weight:900; color:var(--t1); line-height:1.3; margin-bottom:12px; }
                .ref-text   { font-size:.94rem; color:var(--t2); line-height:1.9; max-width:500px; margin-bottom:22px; }
                .ref-hl     { color:var(--p); font-weight:900; }
                .ref-steps  { display:flex; gap:9px; margin-bottom:26px; flex-wrap:wrap; }
                @media(max-width:768px){ .ref-steps{justify-content:center;} }
                .ref-step {
                    display:flex; align-items:center; gap:7px;
                    background:#fff; border:1.5px solid var(--bd);
                    border-radius:11px; padding:7px 13px;
                    font-size:.8rem; color:var(--t2); font-weight:700;
                    transition:all .2s ease;
                }
                .ref-step:hover { border-color:var(--p-light); background:var(--p-xsoft); }
                .ref-num {
                    width:21px;height:21px; border-radius:50%;
                    background:var(--grad); color:#fff;
                    font-size:.7rem; font-weight:900;
                    display:flex; align-items:center; justify-content:center; flex-shrink:0;
                }
                .ref-cta {
                    display:inline-flex; align-items:center; gap:9px;
                    background:var(--grad); color:#fff;
                    font-weight:800; font-size:.97rem;
                    padding:14px 28px; border-radius:14px; text-decoration:none;
                    box-shadow:0 6px 24px rgba(108,62,184,.28);
                    transition:all .28s ease;
                }
                .ref-cta:hover { transform:translateY(-3px); box-shadow:0 12px 36px rgba(108,62,184,.36); }
                /* visual side */
                .ref-visual { position:relative; z-index:2; display:flex; flex-direction:column; align-items:center; gap:12px; }
                .ref-circle {
                    width:130px;height:130px; border-radius:50%;
                    background:var(--grad);
                    display:flex; align-items:center; justify-content:center; font-size:52px;
                    box-shadow:0 0 48px rgba(108,62,184,.28);
                    animation:floatY 4s ease-in-out infinite;
                }
                .ref-tag {
                    background:#fff; border:1.5px solid var(--bd);
                    border-radius:100px; padding:7px 18px;
                    font-size:1rem; font-weight:900; color:var(--t1); white-space:nowrap;
                }
                .ref-tag span { color:var(--p); }

                /* ════════════════════════════════════════
                   ABOUT STRIP
                ════════════════════════════════════════ */
                .about-strip {
                    background:#fff;
                    margin-top:56px;
                    padding:68px 16px;
                    border-top:1px solid var(--bd);
                }
                .about-inner {
                    max-width:920px; margin:0 auto;
                    display:grid; grid-template-columns:1fr 1fr; gap:60px; align-items:center;
                }
                @media(max-width:768px){ .about-inner{grid-template-columns:1fr;gap:28px;text-align:center;} }
                .about-logo-wrap { display:flex; align-items:center; justify-content:center; }
                .about-logo-bg {
                    width:210px;height:210px; border-radius:50%;
                    background:linear-gradient(135deg,var(--p-soft),#fff);
                    border:2px solid var(--bd);
                    display:flex; align-items:center; justify-content:center;
                    box-shadow:var(--sh-hover); position:relative;
                }
                .about-logo-bg::before {
                    content:''; position:absolute; inset:-7px; border-radius:50%;
                    background:conic-gradient(from 0deg,transparent 55%,rgba(108,62,184,.18) 100%);
                    animation:spinRing 7s linear infinite;
                }
                .about-title { font-size:1.7rem; font-weight:900; color:var(--t1); margin-bottom:13px; line-height:1.3; }
                .about-txt   { font-size:.92rem; color:var(--t2); line-height:2; margin-bottom:24px; }
                .about-badges { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:22px; }
                @media(max-width:768px){ .about-badges{justify-content:center;} }
                .about-badge {
                    display:inline-flex; align-items:center; gap:5px;
                    background:var(--p-soft); border:1px solid var(--bd);
                    border-radius:100px; padding:5px 13px;
                    font-size:.76rem; font-weight:700; color:var(--p);
                }
                .about-link {
                    display:inline-flex; align-items:center; gap:8px;
                    background:var(--grad); color:#fff;
                    font-weight:800; font-size:.95rem;
                    padding:12px 26px; border-radius:13px; text-decoration:none;
                    box-shadow:0 5px 20px rgba(108,62,184,.26);
                    transition:all .28s ease;
                }
                .about-link:hover { transform:translateY(-2px); box-shadow:0 10px 32px rgba(108,62,184,.34); }

                /* ════════════════════════════════════════
                   SPACER
                ════════════════════════════════════════ */
                .page-end { height:64px; }
            `}</style>

            <main className="hp">

                {/* ══════════════════════════════ HERO ══════════════════════════════ */}
                <section className="hero">
                    <div className="h-orb h-orb-1" />
                    <div className="h-orb h-orb-2" />
                    <div className="h-orb h-orb-3" />

                    <div className="hero-inner">

                        {/* Logo Ring */}
                        <div className="logo-ring">
                            <div className="logo-ring-bg" />
                            <div className="logo-ring-white" />
                            <div className="logo-ring-img">
                                <Image src="/logo 2.png" alt="انهار الديرة" width={86} height={86} className="object-contain" priority />
                            </div>
                        </div>

                        {/* Badge */}
                        <div style={{ display:'flex', justifyContent:'center', marginBottom:22 }}>
                            <span className="hero-badge">
                                <span className="badge-dot" />
                                تحت سقف الديرة — كل ما تحتاج
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="hero-title">
                            انهار الديرة
                            <br />
                            <span className="hero-title-sub">عالمك المتكامل للتسوق</span>
                        </h1>

                        {/* Subtitle */}
                        <p className="hero-sub">
                            أكبر تشكيلة من منتجات ومستلزمات المنزل العصري والنظافة —
                            خامات آمنة، مواد حلال، وشهادات جودة معتمدة.
                        </p>

                        {/* CTAs */}
                        <div className="cta-row">
                            <Link href="/products" className="cta-main">
                                تسوق الآن
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
                            </Link>
                            <Link href="/about" className="cta-sec">من نحن</Link>
                        </div>

                        {/* Stats */}
                        <div className="hero-stats">
                            {[
                                { n:'+500', l:'منتج متنوع' },
                                { n:'5',    l:'شركات شقيقة' },
                                { n:'100%', l:'مواد حلال' },
                                { n:'🇰🇼',  l:'نخدم الكويت' },
                            ].map(s => (
                                <div key={s.l} style={{ textAlign:'center' }}>
                                    <div className="stat-n">{s.n}</div>
                                    <div className="stat-l">{s.l}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Wave */}
                    <div className="hero-wave">
                        <svg viewBox="0 0 1440 90" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width:'100%', display:'block' }}>
                            <path d="M0 90 C320 18 640 72 960 32 C1120 10 1300 56 1440 24 L1440 90 L0 90Z" fill="#F7F5FF"/>
                        </svg>
                    </div>
                </section>

                {/* ══════════════════════════════ TRUST ══════════════════════════════ */}
                <div className="trust-wrap" style={{ paddingBottom:0 }}>
                    <div className="trust-grid">
                        {[
                            { ico:'🏆', title:'شهادة جودة',     desc:'معتمدة عالمياً',          bg:'#F3EEFF', col:'#6C3EB8' },
                            { ico:'🌿', title:'مواد حلال',       desc:'نسبة نقاء 100%',           bg:'#ECFDF5', col:'#059669' },
                            { ico:'💎', title:'أسعار تنافسية',   desc:'أفضل قيمة لعملائنا',       bg:'#EEF2FF', col:'#4338CA' },
                            { ico:'🚀', title:'سرعة توصيل',      desc:'أينما كنتم في الكويت',     bg:'#EFF6FF', col:'#1D4ED8' },
                        ].map(c => (
                            <div key={c.title} className="trust-card">
                                <div className="t-icon" style={{ background:c.bg }}>{c.ico}</div>
                                <div>
                                    <div className="t-title">{c.title}</div>
                                    <div className="t-desc">{c.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ══════════════════════════════ CATEGORIES ══════════════════════════════ */}
                <div className="sec-wrap">
                    <div className="sec-hd">
                        <div>
                            <span className="sec-tag">التصنيفات</span>
                            <h2 className="sec-title">تسوق حسب التصنيف</h2>
                            <p className="sec-sub">اكتشف مجموعتنا الواسعة من المنتجات</p>
                        </div>
                        <Link href="/products" className="sec-link">عرض الكل <ChevronLeft size={15}/></Link>
                    </div>
                    <div className="cat-grid">
                        {categories.slice(0,12).map((cat:any) => (
                            <Link key={cat.id} href={`/products?categoryId=${cat.id}`} className="cat-card">
                                <div className="cat-ico">
                                    {cat.imageUrl
                                        ? <Image src={cat.imageUrl} alt={cat.nameAr} width={50} height={50} style={{ objectFit:'cover' }}/>
                                        : <span style={{ fontSize:24 }}>📦</span>
                                    }
                                </div>
                                <div className="cat-nm">{cat.nameAr}</div>
                                {cat._count?.products > 0 && <div className="cat-cnt">{cat._count.products} منتج</div>}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* ══════════════════════════════ PROMO STRIP ══════════════════════════════ */}
                <div className="promo-strip">
                    {[
                        { href:'/products?tag=halal',    ico:'🌿', bg:'#ECFDF5', title:'منتجات حلال معتمدة',   sub:'خامات آمنة وشهادات جودة دولية' },
                        { href:'/products?featured=true',ico:'⭐', bg:'#FFFBEB', title:'العروض المميزة',         sub:'أفضل الأسعار على أشهر المنتجات' },
                        { href:'/products?isNew=true',   ico:'✨', bg:'#F5F3FF', title:'وصل حديثاً',            sub:'أحدث الإضافات لمتجر الديرة' },
                    ].map(p => (
                        <Link key={p.href} href={p.href} className="promo-card">
                            <div className="promo-ico" style={{ background:p.bg }}>{p.ico}</div>
                            <div>
                                <div className="promo-title">{p.title}</div>
                                <div className="promo-sub">{p.sub}</div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* ══════════════════════════════ PRODUCTS ══════════════════════════════ */}
                {latestProducts.length > 0 && (
                    <div className="sec-wrap">
                        <div className="sec-hd">
                            <div style={{ display:'flex', alignItems:'center', gap:13 }}>
                                <div style={{ width:5, height:34, background:'var(--grad)', borderRadius:3 }}/>
                                <div>
                                    <span className="sec-tag">جديد</span>
                                    <h2 className="sec-title">وصل حديثاً</h2>
                                    <p className="sec-sub">أحدث المنتجات المضافة لمتجرنا</p>
                                </div>
                            </div>
                            <Link href="/products" className="sec-link">عرض الكل <ChevronLeft size={15}/></Link>
                        </div>
                        <div className="prod-grid">
                            {latestProducts.map((product:any) => (
                                <ProductCard key={product.id} product={product} compact/>
                            ))}
                        </div>
                    </div>
                )}

                {/* ══════════════════════════════ EMAIL BANNER ══════════════════════════════ */}
                <div className="email-wrap">
                    <div className="email-card">
                        <div className="email-inner">
                            <div style={{ fontSize:'2.2rem', marginBottom:10 }}>💌</div>
                            <h2>وفّر أكثر مع الاشتراك</h2>
                            <p>اشترك في نشرتنا البريدية واحصل على خصم 15% على طلبك الأول، إضافة إلى أحدث العروض الحصرية</p>
                            <div className="email-row">
                                <input type="email" placeholder="بريدك الإلكتروني" className="email-inp"/>
                                <button className="email-btn">اشترك</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ══════════════════════════════ REFERRAL ══════════════════════════════ */}
                <div className="ref-wrap">
                    <div className="ref-card">
                        <div className="ref-content">
                            <div className="ref-badge">🎁 برنامج الإحالة</div>
                            <h2 className="ref-title">شارك واكسب<br/>مع الديرة</h2>
                            <p className="ref-text">
                                ادعُ 5 من أصدقائك للتسجيل في متجر انهار الديرة، واحصل فوراً على{' '}
                                <span className="ref-hl">خصم 5%</span>{' '}
                                المرة القادمة التي تتسوق فيها معنا!
                            </p>
                            <div className="ref-steps">
                                {[['1','سجّل الآن'],['2','شارك الرابط'],['3','5 أصدقاء'],['✓','خصم 5%']].map(([n,l]) => (
                                    <div key={n} className="ref-step">
                                        <div className="ref-num">{n}</div>
                                        {l}
                                    </div>
                                ))}
                            </div>
                            <Link href="/cart" className="ref-cta">
                                🔗 أنشئ رابط الإحالة الخاص بك
                            </Link>
                        </div>
                        <div className="ref-visual">
                            <div className="ref-circle">🎁</div>
                            <div className="ref-tag">خصم <span>5%</span> مضمون</div>
                        </div>
                    </div>
                </div>

                {/* ══════════════════════════════ ABOUT ══════════════════════════════ */}
                <div className="about-strip">
                    <div className="about-inner">
                        <div className="about-logo-wrap">
                            <div className="about-logo-bg">
                                <Image
                                    src="/logo 2.png"
                                    alt="انهار الديرة"
                                    width={155}
                                    height={155}
                                    style={{ objectFit:'contain', position:'relative', zIndex:1 }}
                                />
                            </div>
                        </div>
                        <div>
                            <span className="sec-tag">من نحن</span>
                            <h2 className="about-title">تحت سقف الديرة — كل ما تحتاج</h2>
                            <p className="about-txt">
                                حرصنا على توفير أكبر تشكيلة من منتجات ومستلزمات وأدوات المنزل العصري والنظافة تحت سقف واحد لخدمة أهل الديرة وتحقيق طموحاتهم.
                            </p>
                            <div className="about-badges">
                                <span className="about-badge">🏆 شهادات جودة</span>
                                <span className="about-badge">🌿 مواد حلال</span>
                                <span className="about-badge">🏠 5 شركات شقيقة</span>
                            </div>
                            <Link href="/about" className="about-link">
                                اعرف المزيد عن انهار الديرة
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="page-end"/>
            </main>
        </>
    );
}
