'use client';

import React from 'react';

export default function NewsletterBanner() {
    return (
        <div style={{ padding: '100px 16px 0', maxWidth: 1200, margin: '100px auto 0' }}>
            <div className="email-banner" style={{
                background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
                borderRadius: '32px',
                padding: '80px 48px',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 20px 50px rgba(37, 99, 235, 0.2)'
            }}>
                {/* Decorative circles */}
                <div style={{ position: 'absolute', top: -100, right: -100, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)' }} />
                <div style={{ position: 'absolute', bottom: -100, left: -100, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(251, 207, 51, 0.05) 0%, transparent 70%)' }} />

                <div className="email-banner-content" style={{ position: 'relative', zIndex: 2 }}>
                    <div style={{ fontSize: '3.5rem', marginBottom: 24, filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.1))' }}>📩</div>
                    <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter" style={{ color: '#fbcf33' }}>وفّر أكثر مع انهار الديرة</h2>
                    <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
                        انضم إلى أكثر من ٥٠٠٠ عميل يستلمون أحدث العروض والخصومات الحصرية أسبوعياً.
                        اشترك الآن واحصل على <span style={{ color: '#fbcf33', fontWeight: 900 }}>خصم ١٥٪</span> على طلبك الأول.
                    </p>
                    <form
                        className="email-form"
                        style={{ display: 'flex', gap: 12, maxWidth: 600, margin: '0 auto', flexWrap: 'wrap', justifyContent: 'center' }}
                        onSubmit={(e) => {
                            e.preventDefault();
                            alert('سجلنا اهتمامك! سيصلك رابط الخصم قريباً.');
                        }}
                    >
                        <input
                            type="email"
                            placeholder="أدخل بريدك الإلكتروني"
                            style={{
                                flex: 1,
                                minWidth: 280,
                                padding: '20px 28px',
                                borderRadius: '16px',
                                border: '1px solid rgba(255,255,255,0.2)',
                                background: 'rgba(255,255,255,0.1)',
                                color: 'white',
                                fontSize: '1.1rem',
                                outline: 'none',
                                backdropFilter: 'blur(10px)'
                            }}
                            required
                        />
                        <button type="submit" className="email-btn" style={{
                            padding: '20px 48px',
                            borderRadius: '16px',
                            background: '#fbcf33',
                            color: '#1e3a8a',
                            fontWeight: 900,
                            fontSize: '1.1rem',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                        }}>اشترك الآن</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
