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
            className="w-full relative mt-8 mb-4 px-4 max-w-[1200px] mx-auto"
            style={{ fontFamily: "'Cairo', 'Tajawal', sans-serif" }}
        >
            <div
                className="relative w-full overflow-hidden rounded-[24px] bg-[#F8F6FF] aspect-[16/9] sm:aspect-[2/1] md:aspect-[2.5/1] lg:aspect-[3/1] shadow-[0_8px_30px_rgba(109,40,217,0.08)] border border-[#E8E0F8] transition-all duration-300 hover:shadow-[0_12px_40px_rgba(109,40,217,0.12)]"
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
                            sizes="(max-width: 1200px) 100vw, 1200px"
                            style={{ objectFit: 'cover', objectPosition: 'center' }}
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
                            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-white/70 backdrop-blur-md text-[#6D28D9] rounded-full shadow-lg hover:bg-white hover:scale-110 active:scale-95 transition-all outline-none"
                            style={{ fontSize: '24px', fontWeight: 900 }}
                        >
                            <span className="-mr-1 mb-1">›</span>
                        </button>
                        <button
                            onClick={() => goTo((current + 1) % images.length)}
                            aria-label="التالي"
                            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-white/70 backdrop-blur-md text-[#6D28D9] rounded-full shadow-lg hover:bg-white hover:scale-110 active:scale-95 transition-all outline-none"
                            style={{ fontSize: '24px', fontWeight: 900 }}
                        >
                            <span className="-ml-1 mb-1">‹</span>
                        </button>
                    </>
                )}

                {/* Dot indicators */}
                {images.length > 1 && (
                    <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-2.5 z-20 bg-black/20 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full">
                        {images.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => goTo(idx)}
                                aria-label={`الانتقال إلى الصورة ${idx + 1}`}
                                className="h-1.5 sm:h-2 rounded-full border-none cursor-pointer transition-all duration-300 ease-in-out shadow-sm"
                                style={{
                                    width: mounted && idx === current ? 24 : 8,
                                    background: mounted && idx === current
                                        ? 'white'
                                        : 'rgba(255,255,255,0.5)',
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}