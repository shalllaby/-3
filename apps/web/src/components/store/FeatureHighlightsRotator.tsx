'use client';

import React, { useState, useEffect } from 'react';

const FEATURES = [
    { icon: '🌿', title: 'مواد حلال', desc: 'نسبة نقاء 100%', bg: '#E8F5E9', color: '#2E7D32' },
    { icon: '🏆', title: 'شهادة جودة', desc: 'معتمدة عالمياً', bg: '#F3EEFF', color: '#5B2D8E' },
    { icon: '🚀', title: 'سرعة توصيل', desc: 'أينما كنتم في الكويت', bg: '#E3F2FD', color: '#1565C0' },
    { icon: '💎', title: 'أسعار تنافسية', desc: 'أفضل قيمة لعملائنا', bg: '#E8EAF6', color: '#3949AB' },
];

export default function FeatureHighlightsRotator() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % FEATURES.length);
        }, 3500); // Rotates every ~3.5 seconds
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="feature-rotator-wrapper px-4 relative z-10 w-full max-w-[1200px] mx-auto mt-8">
            <div className="relative overflow-hidden bg-white border border-zinc-100 shadow-[0_8px_32px_rgba(30,58,138,0.06)] rounded-[24px] h-[100px] md:h-[110px] flex items-center justify-center transition-all duration-300 hover:shadow-[0_24px_64px_rgba(30,58,138,0.12)] hover:border-blue-500">
                {FEATURES.map((feature, index) => {
                    const isActive = index === currentIndex;
                    return (
                        <div
                            key={index}
                            className={`absolute inset-0 flex items-center justify-center px-6 transition-all duration-[600ms] ease-out ${isActive
                                ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
                                : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
                                }`}
                        >
                            <div className="flex items-center gap-4 w-full md:max-w-md mx-auto justify-center">
                                <div
                                    className="w-[52px] h-[52px] md:w-[60px] md:h-[60px] flex-shrink-0 rounded-[18px] flex items-center justify-center text-2xl md:text-3xl transition-transform duration-500 hover:scale-110"
                                    style={{ backgroundColor: feature.bg, color: feature.color, boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}
                                >
                                    {feature.icon}
                                </div>
                                <div className="flex flex-col text-right">
                                    <h3 className="font-[900] text-slate-900 text-[1.1rem] md:text-[1.25rem] leading-tight mb-1">
                                        {feature.title}
                                    </h3>
                                    <p className="text-slate-500 text-[0.8rem] md:text-[0.9rem] font-[500] leading-none">
                                        {feature.desc}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Indicator dots for better UX */}
                <div className="absolute bottom-2 md:bottom-3 left-0 right-0 flex justify-center gap-1.5">
                    {FEATURES.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`h-1.5 transition-all duration-300 rounded-full ${idx === currentIndex ? 'w-8 bg-blue-600' : 'w-2 bg-zinc-100 hover:bg-blue-200'
                                }`}
                            aria-label={`Go to feature slide ${idx + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
