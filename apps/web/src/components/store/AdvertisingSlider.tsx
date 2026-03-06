'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

interface AdvertisingSliderProps {
    images: string[]; // paths like /Advertising/banner1.jpg
}

export default function AdvertisingSlider({ images }: AdvertisingSliderProps) {
    const [current, setCurrent] = useState(0);
    const [mounted, setMounted] = useState(false);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Avoid hydration mismatch — only render dynamic state after mount
    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted || images.length <= 1) return;

        timerRef.current = setInterval(() => {
            setCurrent(prev => (prev + 1) % images.length);
        }, 4000);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [mounted, images.length]);

    const goTo = (idx: number) => {
        setCurrent(idx);
        // Reset timer on manual nav
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setCurrent(prev => (prev + 1) % images.length);
        }, 4000);
    };

    if (!images || images.length === 0) return null;

    return (
        <section
            dir="rtl"
            className="w-full relative mb-12"
            style={{ fontFamily: "'Cairo', 'Tajawal', sans-serif" }}
        >
            <div
                className="relative w-full overflow-hidden bg-[#EEE8FF] h-[300px] md:h-[420px] lg:h-[520px]"
            >
                {/* Slides */}
                {images.map((src, idx) => (
                    <div
                        key={src}
                        className="absolute inset-0 transition-opacity duration-700 ease-in-out"
                        style={{
                            opacity: (!mounted || idx === current) ? 1 : 0,
                            zIndex: (!mounted || idx === current) ? 10 : 0,
                            pointerEvents: (!mounted || idx === current) ? 'auto' : 'none',
                        }}
                    >
                        <Image
                            src={src}
                            alt={`إعلان ${idx + 1}`}
                            fill
                            sizes="100vw"
                            style={{ objectFit: 'contain', objectPosition: 'center' }}
                            priority={idx === 0}
                        />
                    </div>
                ))}

                {/* Prev / Next arrows */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={() => goTo((current - 1 + images.length) % images.length)}
                            aria-label="السابق"
                            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-14 sm:h-14 flex items-center justify-center bg-white/80 text-[#5B2D8E] rounded-full shadow-lg hover:bg-white hover:scale-105 transition-all outline-none pb-1"
                            style={{ fontSize: '28px', fontWeight: 900 }}
                        >
                            <span className="-mr-1">›</span>
                        </button>
                        <button
                            onClick={() => goTo((current + 1) % images.length)}
                            aria-label="التالي"
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-14 sm:h-14 flex items-center justify-center bg-white/80 text-[#5B2D8E] rounded-full shadow-lg hover:bg-white hover:scale-105 transition-all outline-none pb-1"
                            style={{ fontSize: '28px', fontWeight: 900 }}
                        >
                            <span className="-ml-1">‹</span>
                        </button>
                    </>
                )}

                {/* Dot indicators */}
                {images.length > 1 && (
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2.5 z-20">
                        {images.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => goTo(idx)}
                                aria-label={`الانتقال إلى الصورة ${idx + 1}`}
                                className="h-2.5 rounded-full border-none cursor-pointer transition-all duration-300 ease-in-out shadow-sm"
                                style={{
                                    width: mounted && idx === current ? 36 : 10,
                                    background: mounted && idx === current
                                        ? 'white'
                                        : 'rgba(255,255,255,0.6)',
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}