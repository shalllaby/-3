import Link from 'next/link';
import Image from 'next/image';

export default function BrandCard() {
    return (
        <div
            dir="rtl"
            style={{
                width: '100%',
                background: 'linear-gradient(135deg, #3D1A6E 0%, #5B2D8E 40%, #4169E1 80%, #6B8FFF 100%)',
                position: 'relative',
                overflow: 'hidden',
                fontFamily: "'Cairo', 'Tajawal', sans-serif",
                borderBottom: '1px solid rgba(255,255,255,0.1)',
            }}
        >
            {/* Subtle orb overlays for background texture */}
            <div style={{
                position: 'absolute', top: -100, right: -50,
                width: 300, height: 300, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)',
                pointerEvents: 'none',
            }} />
            <div style={{
                position: 'absolute', bottom: -100, left: 100,
                width: 250, height: 250, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(107,143,255,0.1) 0%, transparent 70%)',
                pointerEvents: 'none',
            }} />

            {/* Inner Container */}
            <div style={{
                maxWidth: '72rem', // max-w-6xl
                margin: '0 auto',
                padding: '24px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '24px',
                position: 'relative',
                zIndex: 1,
            }}
                className="flex-col md:flex-row text-center md:text-right"
            >
                {/* Brand Info (Left/Start) */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }} className="flex-col md:flex-row">
                    {/* Logo */}
                    <div style={{
                        width: 72, height: 72,
                        borderRadius: '50%',
                        background: 'white',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 6,
                        flexShrink: 0
                    }}>
                        <Image
                            src="/logo-2.png"
                            alt="أنهار الديرة"
                            width={54}
                            height={54}
                            style={{ objectFit: 'contain' }}
                            priority
                        />
                    </div>

                    {/* Text */}
                    <div>
                        <h1 style={{
                            fontSize: '1.75rem',
                            fontWeight: 900,
                            color: 'white',
                            margin: '0 0 4px',
                            lineHeight: 1.1,
                            letterSpacing: '-0.02em'
                        }}>
                            أنهار الديرة
                        </h1>
                        <p style={{
                            fontSize: '0.9rem',
                            color: 'rgba(255,255,255,0.85)',
                            margin: 0,
                            maxWidth: '400px',
                            lineHeight: 1.5,
                        }}>
                            أكبر تشكيلة من منتجات المنزل والنظافة — خامات آمنة، مواد حلال معتمدة، تحت سقف واحد
                        </p>
                    </div>
                </div>

                {/* CTA Button (Right/End) */}
                <Link
                    href="/products"
                    className="hover:-translate-y-0.5 hover:shadow-lg active:scale-95"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        background: 'white',
                        color: '#5B2D8E',
                        fontWeight: 800,
                        fontSize: '0.95rem',
                        padding: '12px 28px',
                        borderRadius: '12px',
                        textDecoration: 'none',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        transition: 'all 0.2s ease-out',
                        flexShrink: 0,
                        whiteSpace: 'nowrap'
                    }}
                >
                    تسوق الآن
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5M12 5l-7 7 7 7" />
                    </svg>
                </Link>
            </div>
        </div>
    );
}
