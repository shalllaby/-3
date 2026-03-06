'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Lock, ArrowLeft, Loader2, ShieldCheck, Mail } from 'lucide-react';
import apiClient from '@/lib/api-client';
import { useAuthStore } from '@/store/auth.store';
import toast from 'react-hot-toast';
import { STORE_NAME } from '@/lib/constants';

export default function LoginPage() {
    const router = useRouter();
    const setAuth = useAuthStore(state => state.setAuth);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data } = await apiClient.post('/auth/login', { email, password });
            setAuth(data.user, data.token);

            toast.success('تم تسجيل الدخول بنجاح!');

            // Redirect based on role
            if (data.user.role === 'ADMIN') {
                router.push('/admin');
            } else {
                router.push('/account');
            }
        } catch (error: any) {
            const msg = error.response?.data?.message || 'خطأ في البريد الإلكتروني أو كلمة المرور';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-slate-50 flex flex-col lg:flex-row" dir="rtl">
            {/* Visual Side (Hidden on mobile) */}
            <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center p-12">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-900/80 via-slate-900/90 to-accent-900/80 z-10" />
                <div className="absolute inset-0 z-0 opacity-20" style={{
                    backgroundImage: 'radial-gradient(circle at 50% 50%, #d4881a 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                }} />

                <div className="relative z-20 text-center max-w-md animate-fade-in">
                    <div className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-white/20 shadow-2xl">
                        <ShieldCheck className="w-12 h-12 text-brand-400" />
                    </div>
                    <h1 className="text-4xl font-black text-white mb-6 uppercase tracking-tight">مرحباً بك مجدداً</h1>
                    <p className="text-brand-100 text-lg font-medium opacity-80 leading-relaxed">
                        سجل دخولك للوصول إلى تفاصيل طلباتك، إدارة عناوينك، والاستمتاع بتجربة تسوق مخصصة في {STORE_NAME}.
                    </p>
                </div>
            </div>

            {/* Form Side */}
            <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
                <div className="w-full max-w-md animate-slide-up">
                    <div className="mb-10 text-center lg:text-right">
                        <div className="lg:hidden w-16 h-16 bg-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-brand-200">
                            <ShieldCheck className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 mb-2">تسجيل الدخول</h2>
                        <p className="text-slate-500 font-bold">يرجى إدخال بياناتك للمتابعة</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
                                <Mail className="w-4 h-4 text-brand-500" /> البريد الإلكتروني
                            </label>
                            <input
                                required
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="example@mail.com"
                                className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all font-mono"
                                dir="ltr"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
                                    <Lock className="w-4 h-4 text-brand-500" /> كلمة المرور
                                </label>
                                <button type="button" className="text-xs font-bold text-brand-600 hover:text-brand-700">نسيت كلمة المرور؟</button>
                            </div>
                            <input
                                required
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all font-mono"
                                dir="ltr"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-brand-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-brand-100 hover:bg-brand-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:active:scale-100"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'تسجيل الدخول'}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-slate-500 text-sm font-bold">
                        ليس لديك حساب بعد؟{' '}
                        <Link href="/register" className="text-brand-600 hover:underline">أنشئ حسابك الآن</Link>
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
