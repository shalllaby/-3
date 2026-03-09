'use client';

import React from 'react';

export default function NewsletterBanner() {
    return (
        <div style={{ padding: '80px 16px 0', maxWidth: 1200, margin: '80px auto 0' }}>
            <div className="email-banner">
                <div className="email-banner-content">
                    <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>💌</div>
                    <h2 className="text-2xl font-black mb-2">وفّر أكثر مع الاشتراك</h2>
                    <p className="text-white/80 mb-7 max-w-md mx-auto">
                        اشترك في نشرتنا البريدية واحصل على خصم 15% على طلبك الأول، إضافة إلى أحدث العروض الحصرية
                    </p>
                    <form
                        className="email-form"
                        onSubmit={(e) => {
                            e.preventDefault();
                            alert('سجلنا اهتمامك! سيصلك رابط الخصم قريباً.');
                        }}
                    >
                        <input
                            type="email"
                            placeholder="بريدك الإلكتروني"
                            className="email-input"
                            required
                        />
                        <button type="submit" className="email-btn">اشترك</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
