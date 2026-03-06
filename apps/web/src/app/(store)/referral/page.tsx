'use client';

/**
 * Referral Page — أنهار الديرة
 * Shows the user's referral code, share link, progress toward 5 confirmed referrals,
 * and discount eligibility status.
 */
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth.store';
import apiClient from '@/lib/api-client';
import { Gift, Copy, CheckCheck, Users, Share2, Percent, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

interface ReferralStatus {
    code: string;
    link: string;
    confirmedCount: number;
    pendingCount: number;
    target: number;
    progressPct: number;
    discountEligible: boolean;
    discountUsed: boolean;
    discountCode: string | null;
}

export default function ReferralPage() {
    const { user } = useAuthStore();
    const [status, setStatus] = useState<ReferralStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState<'code' | 'link' | null>(null);

    useEffect(() => {
        if (!user) return;
        apiClient.get('/referral/status')
            .then(res => setStatus(res.data))
            .catch(() => toast.error('فشل تحميل بيانات الإحالة'))
            .finally(() => setLoading(false));
    }, [user]);

    const copyToClipboard = async (text: string, type: 'code' | 'link') => {
        await navigator.clipboard.writeText(text);
        setCopied(type);
        toast.success(type === 'code' ? 'تم نسخ الرمز!' : 'تم نسخ الرابط!');
        setTimeout(() => setCopied(null), 2500);
    };

    if (!user) {
        return (
            <main className="min-h-screen bg-slate-50 flex items-center justify-center" dir="rtl">
                <div className="text-center">
                    <Lock className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="font-black text-slate-600 text-lg">يجب تسجيل الدخول أولاً</p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 py-12 lg:py-20" dir="rtl">
            <div className="max-w-4xl mx-auto px-4">

                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-brand-600 to-purple-600 rounded-[1.75rem] shadow-2xl shadow-brand-500/30 mb-6">
                        <Gift className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 mb-3">برنامج الإحالة</h1>
                    <p className="text-slate-500 font-bold text-lg max-w-md mx-auto leading-relaxed">
                        ادعُ أصدقاءك وكافئهم — واحصل على خصم <span className="text-brand-600">5%</span> عند تسجيل 5 أصدقاء عن طريقك.
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-24">
                        <div className="animate-spin w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full" />
                    </div>
                ) : status ? (
                    <div className="space-y-6">

                        {/* Discount Status Banner */}
                        {status.discountEligible && !status.discountUsed && (
                            <div className="bg-gradient-to-l from-green-500 to-emerald-600 rounded-[2rem] p-8 text-white flex items-center gap-6 shadow-xl shadow-green-500/20">
                                <Percent className="w-14 h-14 shrink-0 opacity-80" />
                                <div>
                                    <p className="font-black text-2xl mb-1">🎉 تهانينا! أنت مؤهل للخصم</p>
                                    <p className="opacity-90 font-bold">سيُطبق خصم 5% تلقائياً على طلبك القادم عند الدفع.</p>
                                    {status.discountCode && (
                                        <p className="mt-2 text-sm bg-white/20 rounded-xl px-3 py-1 inline-block font-mono tracking-widest">{status.discountCode}</p>
                                    )}
                                </div>
                            </div>
                        )}
                        {status.discountUsed && (
                            <div className="bg-slate-100 rounded-[2rem] p-6 flex items-center gap-4 border border-slate-200">
                                <CheckCheck className="w-8 h-8 text-slate-400 shrink-0" />
                                <div>
                                    <p className="font-black text-slate-700">تم استخدام الخصم</p>
                                    <p className="text-slate-500 text-sm font-bold">لقد استفدت بالفعل من خصم الإحالة 5%.</p>
                                </div>
                            </div>
                        )}

                        {/* Referral Code Card */}
                        <div className="bg-white rounded-[2rem] p-8 shadow-lg border border-slate-100">
                            <h2 className="font-black text-slate-900 text-xl mb-2 flex items-center gap-2">
                                <Share2 className="w-5 h-5 text-brand-500" /> رمز الإحالة الخاص بك
                            </h2>
                            <p className="text-slate-400 font-bold text-sm mb-6">شارك هذا الرمز أو الرابط مع أصدقائك ليسجلوا بواسطتك.</p>

                            {/* Code row */}
                            <div className="flex items-center gap-3 mb-4">
                                <div className="flex-1 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl px-6 py-4 text-center">
                                    <p className="font-mono font-black text-2xl tracking-[0.3em] text-slate-900">{status.code}</p>
                                </div>
                                <button
                                    onClick={() => copyToClipboard(status.code, 'code')}
                                    className="flex items-center gap-2 bg-brand-600 text-white font-black px-5 py-4 rounded-2xl hover:bg-brand-700 active:scale-95 transition-all shadow-lg whitespace-nowrap"
                                >
                                    {copied === 'code' ? <CheckCheck className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                    نسخ الرمز
                                </button>
                            </div>

                            {/* Link row */}
                            <div className="flex items-center gap-3">
                                <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 overflow-hidden">
                                    <p className="font-mono text-xs text-slate-500 truncate" dir="ltr">{status.link}</p>
                                </div>
                                <button
                                    onClick={() => copyToClipboard(status.link, 'link')}
                                    className="flex items-center gap-2 bg-slate-800 text-white font-black px-5 py-3 rounded-2xl hover:bg-black active:scale-95 transition-all whitespace-nowrap"
                                >
                                    {copied === 'link' ? <CheckCheck className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    نسخ الرابط
                                </button>
                            </div>
                        </div>

                        {/* Progress Card */}
                        <div className="bg-white rounded-[2rem] p-8 shadow-lg border border-slate-100">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="font-black text-slate-900 text-xl flex items-center gap-2">
                                    <Users className="w-5 h-5 text-brand-500" /> تقدمك
                                </h2>
                                <div className="text-left">
                                    <span className="text-3xl font-black text-brand-600">{status.confirmedCount}</span>
                                    <span className="text-slate-400 font-black text-lg">/{status.target}</span>
                                    <p className="text-xs font-bold text-slate-400">إحالات مؤكدة</p>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full bg-slate-100 rounded-full h-4 mb-4 overflow-hidden">
                                <div
                                    className="h-4 rounded-full bg-gradient-to-l from-brand-600 to-purple-500 transition-all duration-700 ease-out"
                                    style={{ width: `${status.progressPct}%` }}
                                />
                            </div>

                            {/* Step dots */}
                            <div className="flex justify-between px-1">
                                {Array.from({ length: status.target }, (_, i) => (
                                    <div key={i} className="flex flex-col items-center gap-1">
                                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-black transition-all ${i < status.confirmedCount
                                            ? 'border-brand-500 bg-brand-500 text-white shadow-md shadow-brand-300'
                                            : 'border-slate-200 bg-white text-slate-400'
                                            }`}>
                                            {i < status.confirmedCount ? <CheckCheck className="w-4 h-4" /> : i + 1}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {status.pendingCount > 0 && (
                                <p className="mt-4 text-center text-sm font-bold text-amber-600 bg-amber-50 rounded-xl py-2">
                                    ⏳ لديك {status.pendingCount} {status.pendingCount === 1 ? 'صديق' : 'أصدقاء'} بانتظار تأكيد التسجيل
                                </p>
                            )}
                        </div>

                        {/* How it works */}
                        <div className="bg-white rounded-[2rem] p-8 shadow-lg border border-slate-100">
                            <h2 className="font-black text-slate-900 text-xl mb-6">كيف يعمل البرنامج؟</h2>
                            <div className="space-y-4">
                                {[
                                    { step: '1', text: 'شارك رمزك أو رابطك مع أصدقائك', icon: '🔗' },
                                    { step: '2', text: 'يسجّل صديقك عبر رابطك', icon: '👤' },
                                    { step: '3', text: 'بمجرد تسجيل حساب، يُحتسب لك كإحالة مؤكدة', icon: '✅' },
                                    { step: '4', text: 'بعد 5 إحالات مؤكدة، تحصل على خصم 5% على طلبك القادم', icon: '🎁' },
                                ].map(item => (
                                    <div key={item.step} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50">
                                        <span className="text-2xl">{item.icon}</span>
                                        <p className="font-bold text-slate-700">{item.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                ) : (
                    <div className="text-center py-24 text-slate-400 font-bold">لا توجد بيانات متاحة.</div>
                )}
            </div>
        </main>
    );
}
