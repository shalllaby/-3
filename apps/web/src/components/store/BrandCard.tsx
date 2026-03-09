import Link from 'next/link';
import Image from 'next/image';

export default function BrandCard() {
    return (
        <div
            dir="rtl"
            style={{
                width: '100%',
                background: 'linear-gradient(135deg, #4C1D95 0%, #6D28D9 40%, #3B82F6 80%, #60A5FA 100%)',
                position: 'relative',
                overflow: 'hidden',
                fontFamily: "'Cairo', 'Tajawal', sans-serif",
                borderBottom: '1px solid rgba(255,255,255,0.08)',
            }}
        >
            {/* Subtle orb overlays for background texture */}
            <div style={{
                position: 'absolute', top: -120, right: -60,
                width: 350, height: 350, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 70%)',
                pointerEvents: 'none',
            }} />
            <div style={{
                position: 'absolute', bottom: -120, left: 80,
                width: 300, height: 300, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(96,165,250,0.12) 0%, transparent 70%)',
                pointerEvents: 'none',
            }} />

            {/* Inner Container */}
            <div style={{
                maxWidth: '72rem',
                margin: '0 auto',
                padding: '32px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '28px',
                position: 'relative',
                zIndex: 1,
            }}
                className="flex-col md:flex-row text-center md:text-right"
            >
                {/* Brand Info (Left/Start) */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }} className="flex-col md:flex-row">
                    {/* Logo */}
                    <div
                        className="w-16 h-16 md:w-[88px] md:h-[88px] flex-shrink-0"
                        style={{
                            borderRadius: '50%',
                            background: 'white',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.12), 0 0 0 4px rgba(255,255,255,0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: 8,
                        }}>
                        <Image
                            src="/logo-2.png"
                            alt="أنهار الديرة"
                            width={60}
                            height={60}
                            style={{ objectFit: 'contain', width: '100%', height: '100%' }}
                            priority
                        />
                    </div>

                    {/* Text */}
                    <div>
                        <h1
                            className="text-2xl md:text-[2.5rem] font-black text-white mb-1.5 leading-tight"
                            style={{ letterSpacing: '-0.03em' }}
                        >
                            أنهار الديرة
                        </h1>
                        <p className="text-sm md:text-base leading-relaxed font-medium" style={{ color: 'rgba(255,255,255,0.8)', maxWidth: '420px' }}>
                            أكبر تشكيلة من منتجات المنزل والنظافة — خامات آمنة، مواد حلال معتمدة، تحت سقف واحد
                        </p>
                    </div>
                </div>

                {/* CTA Button (Right/End) */}
                <Link
                    href="/products"
                    className="hover:-translate-y-1 hover:shadow-xl active:scale-95"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 10,
                        background: 'white',
                        color: '#6D28D9',
                        fontWeight: 900,
                        fontSize: '1rem',
                        padding: '14px 32px',
                        borderRadius: '16px',
                        textDecoration: 'none',
                        boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        flexShrink: 0,
                        whiteSpace: 'nowrap'
                    }}
                >
                    تسوق الآن
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5M12 5l-7 7 7 7" />
                    </svg>
                </Link>
            </div>
        </div>
    );
}

