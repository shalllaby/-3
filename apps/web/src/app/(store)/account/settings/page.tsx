'use client';

/**
 * Account Settings Page — أنهار الديرة
 * Allows users to update their profile and change their password.
 */
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, User, Lock, Save, CheckCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth.store';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export default function AccountSettingsPage() {
    const { user, token, setAuth } = useAuthStore();

    // Profile state
    const [name, setName] = useState(user?.name ?? '');
    const [phone, setPhone] = useState(user?.phone ?? '');
    const [profileLoading, setProfileLoading] = useState(false);
    const [profileSuccess, setProfileSuccess] = useState(false);
    const [profileError, setProfileError] = useState('');

    // Password state
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNew, setShowNew] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordSuccess, setPasswordSuccess] = useState(false);
    const [passwordError, setPasswordError] = useState('');

    const handleProfileSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setProfileLoading(true);
        setProfileError('');
        setProfileSuccess(false);
        try {
            const res = await fetch(`${API_BASE}/users/me`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ name, phone }),
            });
            if (!res.ok) throw new Error('فشل تحديث البيانات');
            const updated = await res.json();
            if (user && token) {
                setAuth(updated, token);
            }
            setProfileSuccess(true);
            setTimeout(() => setProfileSuccess(false), 3000);
        } catch (err: any) {
            setProfileError(err.message ?? 'حدث خطأ غير متوقع');
        } finally {
            setProfileLoading(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setPasswordError('كلمات المرور غير متطابقة');
            return;
        }
        if (newPassword.length < 8) {
            setPasswordError('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
            return;
        }
        setPasswordLoading(true);
        setPasswordError('');
        setPasswordSuccess(false);
        try {
            const res = await fetch(`${API_BASE}/users/me/password`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ currentPassword, newPassword }),
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.message ?? 'كلمة المرور الحالية غير صحيحة');
            }
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setPasswordSuccess(true);
            setTimeout(() => setPasswordSuccess(false), 3000);
        } catch (err: any) {
            setPasswordError(err.message ?? 'حدث خطأ غير متوقع');
        } finally {
            setPasswordLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-slate-50 py-12 lg:py-20">
            <div className="max-w-2xl mx-auto px-4">

                {/* Back link */}
                <Link
                    href="/account"
                    className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-brand-600 transition-colors mb-8"
                >
                    <ArrowRight className="w-4 h-4" />
                    العودة إلى حسابي
                </Link>

                <h1 className="text-3xl font-black text-gray-900 mb-8">إعدادات الحساب</h1>

                <div className="space-y-6">

                    {/* ── Profile Section ── */}
                    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
                        <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                            <div className="w-10 h-10 bg-brand-50 text-brand-600 rounded-xl flex items-center justify-center">
                                <User className="w-5 h-5" />
                            </div>
                            البيانات الشخصية
                        </h2>

                        <form onSubmit={handleProfileSave} dir="rtl" className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">الاسم الكامل</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="أدخل اسمك الكامل"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-400 transition"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">البريد الإلكتروني</label>
                                <input
                                    type="email"
                                    value={user?.email ?? ''}
                                    disabled
                                    className="w-full px-4 py-3 border border-gray-100 rounded-xl text-sm text-gray-400 bg-gray-50 cursor-not-allowed"
                                />
                                <p className="text-xs text-gray-400 mt-1">لا يمكن تغيير البريد الإلكتروني</p>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">رقم الهاتف</label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="965XXXXXXXX+"
                                    dir="ltr"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-400 transition text-right"
                                />
                            </div>

                            {profileError && (
                                <p className="text-sm font-bold text-red-600 bg-red-50 px-4 py-2 rounded-xl">{profileError}</p>
                            )}

                            <button
                                type="submit"
                                disabled={profileLoading}
                                className="w-full flex items-center justify-center gap-2 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-black rounded-xl transition-all active:scale-[0.98] disabled:opacity-60"
                            >
                                {profileLoading
                                    ? <Loader2 className="w-5 h-5 animate-spin" />
                                    : profileSuccess
                                        ? <><CheckCircle className="w-5 h-5" /> تم الحفظ!</>
                                        : <><Save className="w-5 h-5" /> حفظ البيانات</>
                                }
                            </button>
                        </form>
                    </div>

                    {/* ── Password Section ── */}
                    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
                        <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                                <Lock className="w-5 h-5" />
                            </div>
                            تغيير كلمة المرور
                        </h2>

                        <form onSubmit={handlePasswordChange} dir="rtl" className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">كلمة المرور الحالية</label>
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">كلمة المرور الجديدة</label>
                                <div className="relative">
                                    <input
                                        type={showNew ? 'text' : 'password'}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full px-4 py-3 pe-11 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNew(!showNew)}
                                        className="absolute inset-y-0 end-3 flex items-center text-gray-400 hover:text-gray-600"
                                    >
                                        {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                <p className="text-xs text-gray-400 mt-1">8 أحرف على الأقل</p>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">تأكيد كلمة المرور الجديدة</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition"
                                />
                            </div>

                            {passwordError && (
                                <p className="text-sm font-bold text-red-600 bg-red-50 px-4 py-2 rounded-xl">{passwordError}</p>
                            )}

                            <button
                                type="submit"
                                disabled={passwordLoading}
                                className="w-full flex items-center justify-center gap-2 py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-black rounded-xl transition-all active:scale-[0.98] disabled:opacity-60"
                            >
                                {passwordLoading
                                    ? <Loader2 className="w-5 h-5 animate-spin" />
                                    : passwordSuccess
                                        ? <><CheckCircle className="w-5 h-5" /> تم تغيير كلمة المرور!</>
                                        : <><Lock className="w-5 h-5" /> تغيير كلمة المرور</>
                                }
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}
