'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { User, Lock, ArrowLeft, Loader2, Mail } from 'lucide-react';
import apiClient from '@/lib/api-client';
import { useAuthStore } from '@/store/auth.store';
import toast from 'react-hot-toast';
import { STORE_NAME } from '@/lib/constants';

/** Inner form — must be wrapped in <Suspense> because it uses useSearchParams() */
function RegisterForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const setAuth = useAuthStore(state => state.setAuth);

    const [refCode, setRefCode] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);

    // Capture the referral code from the URL ?ref= on mount
    useEffect(() => {
        const ref = searchParams.get('ref');
        if (ref) setRefCode(ref);
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Include referralCode in the registration body — backend handles tracking atomically
            const payload: Record<string, string> = { ...formData };
            if (refCode) payload.referralCode = refCode;

            const { data } = await apiClient.post('/auth/register', payload);
            setAuth(data.user, data.token);
            toast.success(`مرحباً بك في ${STORE_NAME}!`);
            router.push('/account');
        } catch (error: any) {
            const msg = error.response?.data?.message || 'فشل إنشاء الحساب. تأكد من البيانات.';
            toast.error(Array.isArray(msg) ? msg[0] : msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-slate-50 flex flex-col lg:flex-row" dir="rtl">
            {/* Visual Side */}
            <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center p-12">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-900/80 via-slate-900/90 to-brand-700/80 z-10" />
                <div className="relative z-20 text-center max-w-md animate-fade-in">
                    <div className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-white/20 shadow-2xl font-black text-4xl text-white">
                        ١
                    </div>
                    <h1 className="text-4xl font-black text-white mb-6 uppercase tracking-tight">ابدأ رحلتك معنا</h1>
                    <p className="text-brand-100 text-lg font-medium opacity-80 leading-relaxed">
                        انضم إلى آلاف العملاء في الكويت واستمتع بأفضل منتجات النظافة والمنزل مع عروض حصرية تصلك أولاً بأول.
                    </p>
                </div>
            </div>

            {/* Form Side */}
            <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
                <div className="w-full max-w-lg animate-slide-up">
                    <div className="mb-10 text-center lg:text-right">
                        <h2 className="text-3xl font-black text-slate-900 mb-2">إنشاء حساب جديد</h2>
                        <p className="text-slate-500 font-bold">خطوة واحدة تفصلك عن عروضنا الحصرية</p>
                    </div>

                    {/* Referral Banner — shown when arriving via a referral link */}
                    {refCode && (
                        <div className="mb-6 flex items-center gap-3 bg-green-50 border border-green-200 rounded-2xl px-5 py-4">
                            <span className="text-2xl">🎁</span>
                            <div>
                                <p className="font-black text-green-800 text-sm">تسجّلت عبر رابط إحالة صديق!</p>
                                <p className="text-green-600 text-xs font-bold mt-0.5">سيحصل صديقك على مكافأة بمجرد إتمام تسجيلك.</p>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 col-span-2">
                            <label className="text-sm font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
                                <User className="w-4 h-4 text-brand-500" /> الاسم بالكامل
                            </label>
                            <input
                                required
                                type="text"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                placeholder="أحمد الكويتي"
                                className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all"
                            />
                        </div>

                        <div className="space-y-2 col-span-2">
                            <label className="text-sm font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
                                <Mail className="w-4 h-4 text-brand-500" /> البريد الإلكتروني
                            </label>
                            <input
                                required
                                type="email"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                placeholder="mail@example.kw"
                                className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all font-mono"
                                dir="ltr"
                            />
                        </div>

                        <div className="space-y-2 col-span-2">
                            <label className="text-sm font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
                                <Lock className="w-4 h-4 text-brand-500" /> كلمة المرور
                            </label>
                            <input
                                required
                                type="password"
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                placeholder="••••••••"
                                className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all font-mono"
                                dir="ltr"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="col-span-2 bg-slate-900 text-white font-black py-5 rounded-2xl shadow-xl hover:bg-black active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'إنشاء الحساب'}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-slate-500 text-sm font-bold">
                        لديك حساب بالفعل؟{' '}
                        <Link href="/login" className="text-brand-600 hover:underline">سجل دخولك</Link>
                    </div>

                    <div className="mt-12 flex items-center gap-4">
                        <div className="h-px bg-slate-200 flex-1" />
                        <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors text-xs font-black uppercase tracking-tighter group">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> العودة للمتجر
                        </Link>
                        <div className="h-px bg-slate-200 flex-1" />
                    </div>
                </div>
            </div>
        </main>
    );
}

/** Default export wraps RegisterForm in Suspense (required for useSearchParams in Next.js 14) */
export default function RegisterPage() {
    return (
        <Suspense fallback={
            <main className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full" />
            </main>
        }>
            <RegisterForm />
        </Suspense>
    );
}
