'use client';

import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Gift } from 'lucide-react';

const WHEEL_SEGMENTS = [
    { id: 1, label: 'خصم 1%', value: '1', type: 'DISCOUNT', color: '#1abc9c' },
    { id: 2, label: 'حظ أوفر', value: 'NO_WIN', type: 'NO_WIN', color: '#e74c3c' },
    { id: 3, label: 'خصم 2%', value: '2', type: 'DISCOUNT', color: '#f1c40f' },
    { id: 4, label: 'خصم 3%', value: '3', type: 'DISCOUNT', color: '#9b59b6' },
    { id: 5, label: 'حاول مجدداً', value: 'TRY_AGAIN', type: 'TRY_AGAIN', color: '#3498db' },
    { id: 6, label: 'خصم 4%', value: '4', type: 'DISCOUNT', color: '#e67e22' },
    { id: 7, label: 'خصم 5%', value: '5', type: 'DISCOUNT', color: '#2ecc71' },
    { id: 8, label: 'جائزة غامضة', value: 'MYSTERY', type: 'MYSTERY', color: '#e91e63' },
    { id: 9, label: 'خصم 1%', value: '1', type: 'DISCOUNT', color: '#f1c40f' },
    { id: 10, label: 'حظ أوفر', value: 'NO_WIN', type: 'NO_WIN', color: '#9b59b6' },
    { id: 11, label: 'خصم 2%', value: '2', type: 'DISCOUNT', color: '#e74c3c' },
    { id: 12, label: 'خصم 3%', value: '3', type: 'DISCOUNT', color: '#1abc9c' },
    { id: 13, label: 'حاول مجدداً', value: 'TRY_AGAIN', type: 'TRY_AGAIN', color: '#2ecc71' },
    { id: 14, label: 'خصم 4%', value: '4', type: 'DISCOUNT', color: '#e91e63' },
    { id: 15, label: 'خصم 5%', value: '5', type: 'DISCOUNT', color: '#e67e22' },
    { id: 16, label: 'جائزة غامضة', value: 'MYSTERY', type: 'MYSTERY', color: '#3498db' },
];

export default function LuckyWheel() {
    const [isSpinning, setIsSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [result, setResult] = useState<any>(null);
    const [canSpin, setCanSpin] = useState(true);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        // Normally we'd call /api/v1/lucky-wheel/status here
        setCanSpin(true);
    }, []);

    const spin = async () => {
        if (isSpinning || !canSpin) return;

        setIsSpinning(true);
        setResult(null);

        // Randomize locally for visual dummy (should come from API)
        const winningIndex = Math.floor(Math.random() * WHEEL_SEGMENTS.length);

        const baseRotation = 360 * 5; // Spin 5 times fully
        const segmentAngle = 360 / WHEEL_SEGMENTS.length;

        // Target rotation to make winning segment land at 0 degrees (Right side where the scorpion/arrow is)
        setRotation((prev) => {
            const currentSpin = prev % 360;
            const targetSpin = (360 - (winningIndex * segmentAngle + segmentAngle / 2)) % 360;
            const diff = targetSpin - currentSpin;
            const normalizedDiff = diff >= 0 ? diff : 360 + diff;
            return prev + baseRotation + normalizedDiff;
        });

        setTimeout(() => {
            setIsSpinning(false);
            const winner = WHEEL_SEGMENTS[winningIndex];
            setResult(winner);

            if (winner.type === 'DISCOUNT' || winner.type === 'MYSTERY') {
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#5B2D8E', '#4169E1', '#FFD700']
                });
            }
        }, 5000); // 5 sec CSS transition match
    };

    const drawWheel = () => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const outerRadius = Math.min(centerX, centerY) - 5;
        const innerRadius = outerRadius - 20;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 1. Draw outer ring (teal with dots)
        ctx.beginPath();
        ctx.arc(centerX, centerY, outerRadius, 0, 2 * Math.PI);
        ctx.fillStyle = '#2db88b';
        ctx.fill();
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#1e7b5d';
        ctx.stroke();

        const dotsCount = 24;
        for (let i = 0; i < dotsCount; i++) {
            const dotAngle = (i * 2 * Math.PI) / dotsCount;
            const dotX = centerX + (outerRadius - 10) * Math.cos(dotAngle);
            const dotY = centerY + (outerRadius - 10) * Math.sin(dotAngle);
            ctx.beginPath();
            ctx.arc(dotX, dotY, 4, 0, 2 * Math.PI);
            ctx.fillStyle = '#FFFFFF';
            ctx.fill();
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#CCCCCC';
            ctx.stroke();
        }

        // 2. Draw segments
        const segmentAngle = (2 * Math.PI) / WHEEL_SEGMENTS.length;

        WHEEL_SEGMENTS.forEach((segment, i) => {
            const startAngle = i * segmentAngle;
            const endAngle = startAngle + segmentAngle;

            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, innerRadius, startAngle, endAngle);
            ctx.closePath();

            ctx.fillStyle = segment.color;
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#333333';
            ctx.stroke();

            // 3. Draw Text
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(startAngle + segmentAngle / 2);
            ctx.textAlign = 'right';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#000000';
            ctx.font = 'bold 15px Cairo, sans-serif';
            ctx.fillText(segment.label, innerRadius - 15, 0);
            ctx.restore();
        });

        // 4. Draw Center Circle (Sunburst)
        ctx.beginPath();
        ctx.arc(centerX, centerY, innerRadius * 0.15, 0, 2 * Math.PI);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#333333';
        ctx.stroke();

        // Draw pink sunburst lines
        const linesCount = 30;
        ctx.beginPath();
        for (let i = 0; i < linesCount; i++) {
            const lineAngle = (i * 2 * Math.PI) / linesCount;
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(
                centerX + (innerRadius * 0.12) * Math.cos(lineAngle),
                centerY + (innerRadius * 0.12) * Math.sin(lineAngle)
            );
        }
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#e91e63';
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(centerX, centerY, innerRadius * 0.05, 0, 2 * Math.PI);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
    };

    useEffect(() => {
        // We use a slight delay so custom fonts have time to load
        setTimeout(drawWheel, 300);
    }, []);

    return (
        <div className="w-full max-w-6xl mx-auto my-16 relative" dir="rtl">
            <div className="bg-white/90 backdrop-blur-2xl rounded-[3rem] shadow-[0_20px_80px_-15px_rgba(91,45,142,0.15)] border border-white/50 p-8 md:p-14 relative overflow-hidden">
                {/* Decorative backgrounds */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#5B2D8E]/10 to-transparent rounded-full blur-3xl -mr-20 -mt-20 z-0 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#2db88b]/10 to-transparent rounded-full blur-3xl -ml-20 -mb-20 z-0 pointer-events-none"></div>

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left/Right Text Content */}
                    <div className="text-center lg:text-right order-2 lg:order-1">
                        <div className="inline-flex items-center gap-2 bg-[#2db88b]/10 text-[#2db88b] font-black px-4 py-2 rounded-full text-sm mb-6 border border-[#2db88b]/20">
                            <Gift size={16} />
                            <span>مفاجآت أنهار الديرة</span>
                        </div>
                        <h2 className="text-4xl lg:text-6xl font-black text-[#1A0A3D] mb-6 font-cairo leading-tight">
                            عجلة <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2db88b] to-[#4169E1]">الحظ</span>
                        </h2>
                        <p className="text-gray-600 font-cairo text-lg mb-10 leading-relaxed max-w-lg mx-auto lg:mx-0">
                            قم بتدوير العجلة الآن واحصل على فرصة للفوز بخصومات إضافية رائعة أو جوائز غامضة تصلك مع طلبك القادم!
                        </p>

                        <div className="max-w-md mx-auto lg:mx-0">
                            {!result ? (
                                <button
                                    onClick={spin}
                                    disabled={isSpinning || !canSpin}
                                    className={`w-full py-5 rounded-2xl font-black text-xl font-cairo shadow-[0_10px_30px_rgba(45,184,139,0.3)] transition-all ${isSpinning || !canSpin ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none' : 'bg-gradient-to-r from-[#2db88b] to-[#1e7b5d] text-white hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(45,184,139,0.4)]'}`}
                                >
                                    {isSpinning ? 'جاري الدوران...' : !canSpin ? 'لقد قمت بالتدوير سابقاً' : 'دور العجلة الآن!'}
                                </button>
                            ) : (
                                <div className="animate-in fade-in flex flex-col slide-in-from-bottom-4 duration-500">
                                    <div className="bg-[#F8F6FF] rounded-3xl p-6 border-2 border-[#E2D9F3] shadow-inner mb-4">
                                        <p className="font-black text-[#5B2D8E] text-2xl font-cairo mb-2 text-center">
                                            {result.type === 'DISCOUNT' ? `مبروك! فزت بخصم ${result.label}` : result.label}
                                        </p>
                                        {result.type === 'DISCOUNT' && (
                                            <div className="mt-4 bg-white border-2 border-dashed border-[#5B2D8E] p-4 rounded-xl flex items-center justify-between shadow-sm">
                                                <span className="font-mono font-black text-2xl text-[#1A0A3D] tracking-widest">LUCKY{result.value}-TEST</span>
                                                <button className="text-sm bg-gradient-to-r from-[#5B2D8E] to-[#4169E1] text-white font-bold py-2 px-5 rounded-lg hover:shadow-lg transition-all hover:scale-105">نسخ</button>
                                            </div>
                                        )}
                                        {(result.type === 'NO_WIN' || result.type === 'TRY_AGAIN') && (
                                            <p className="text-center text-gray-500 font-medium mt-2">عوضك الله خيراً، جرب مجدداً لاحقاً.</p>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => setResult(null)}
                                        className="w-full py-4 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200 transition-colors font-cairo"
                                    >
                                        الدوران مرة أخرى (للتجربة)
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right/Left Wheel Container (Housing + Canvas) */}
                    <div className="relative flex justify-center items-center py-6 order-1 lg:order-2">
                        {/* Housing base (teal background matching picture) */}
                        <div className="relative bg-[#3bad99] rounded-full p-3 sm:p-4 shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex justify-center items-center w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] mx-auto z-10">

                            {/* The ear for the pointer (right side block on housing) */}
                            <div className="absolute -right-6 sm:-right-8 top-1/2 -translate-y-1/2 w-16 sm:w-20 h-28 sm:h-36 bg-[#3bad99] rounded-r-[40px] z-0 shadow-[10px_10px_20px_rgba(0,0,0,0.1)]"></div>

                            {/* Inner structural border overlay for 3D effect */}
                            <div className="absolute inset-0 rounded-full border-[10px] sm:border-[16px] border-[#a0e4d7]/30 pointer-events-none mix-blend-overlay z-10"></div>

                            {/* The Arrow (Dark Red) matched to Picture - Pointing Leftwards from Right */}
                            <svg viewBox="0 0 100 100" className="w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] drop-shadow-2xl z-20 absolute -right-[45px] sm:-right-[60px] top-1/2 -translate-y-1/2 text-[#6e051a]">
                                {/* Tail + Big Triangle Arrow Head (Mirrored to face Left) */}
                                <path d="M 90 35 L 60 35 L 60 15 L 10 50 L 60 85 L 60 65 L 90 65 Z" fill="currentColor" stroke="#1A0A3D" strokeWidth="2" strokeLinejoin="round" />
                            </svg>

                            {/* Wheel Canvas Body */}
                            <div
                                className="relative z-10 rounded-full bg-white transition-transform ease-[cubic-bezier(0.2,0.8,0.2,1)]"
                                style={{
                                    transform: `rotate(${rotation}deg)`,
                                    transitionDuration: isSpinning ? '5s' : '0s'
                                }}
                            >
                                <canvas ref={canvasRef} width="400" height="400" className="block max-w-[270px] xs:max-w-[280px] sm:max-w-[360px] h-auto drop-shadow-md rounded-full" />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
