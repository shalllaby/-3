'use client';

/**
 * Account Page — أنهار الديرة
 * Shows user info from auth store. Logout clears session and redirects to /login.
 */
import {
    User, ShoppingBag, MapPin, Settings, LogOut,
    ChevronLeft, Package, Clock, CreditCard, Gift
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';

export default function AccountPage() {
    const router = useRouter();
    const { user, logout } = useAuthStore();

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    const displayUser = {
        name: user?.name ?? 'ضيف',
        email: user?.email ?? '',
        orderCount: 0,
        addressCount: 0,
    };

    const sections = [
        {
            id: 'orders',
            title: 'طلباتي',
            desc: 'تتبع طلباتك الحالية ومراجعة سجل مشترياتك',
            icon: <ShoppingBag className="w-6 h-6" />,
            color: 'bg-brand-50 text-brand-600',
            href: '/account/orders'
        },
        {
            id: 'addresses',
            title: 'عناوين التوصيل',
            desc: 'إضافة وتعديل عناوينك المفضلة في جميع محافظات الكويت',
            icon: <MapPin className="w-6 h-6" />,
            color: 'bg-blue-50 text-blue-600',
            href: '/account/addresses'
        },
        {
            id: 'settings',
            title: 'إعدادات الحساب',
            desc: 'تحديث بياناتك الشخصية وتغيير كلمة المرور',
            icon: <Settings className="w-6 h-6" />,
            color: 'bg-purple-50 text-purple-600',
            href: '/account/settings'
        },
        {
            id: 'payment',
            title: 'طرق الدفع',
            desc: 'إدارة البطاقات المحفوظة للدفع السريع',
            icon: <CreditCard className="w-6 h-6" />,
            color: 'bg-green-50 text-green-600',
            href: '/account/payments'
        },
        {
            id: 'referral',
            title: 'برنامج الإحالة',
            desc: 'ادعُ أصدقاءك واحصل على خصم 5% عند تسجيل 5 منهم',
            icon: <Gift className="w-6 h-6" />,
            color: 'bg-purple-50 text-purple-600',
            href: '/referral'
        },
    ];

    const recentOrders = [
        { id: '#ORD-9821', status: 'جاري التوصيل', date: 'منذ ساعتين', total: '12.500 د.ك' },
        { id: '#ORD-9754', status: 'تم التوصيل', date: '20 فبراير 2026', total: '8.750 د.ك' },
    ];

    return (
        <main className="min-h-screen bg-slate-50 py-12 lg:py-20">
            <div className="max-w-7xl mx-auto px-4">

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* ── SIDEBAR USERCARD (4/12) ── */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-gray-100 text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-brand-600 to-brand-400 z-0" />

                            <div className="relative z-10">
                                <div className="w-24 h-24 bg-white rounded-full mx-auto mb-6 p-1 border-4 border-white shadow-xl overflow-hidden">
                                    <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
                                        <User className="w-12 h-12" />
                                    </div>
                                </div>
                                <h2 className="text-2xl font-black text-gray-900 mb-1">{displayUser.name}</h2>
                                <p className="text-gray-400 text-sm font-bold mb-8">{displayUser.email}</p>

                                <div className="grid grid-cols-2 gap-4 border-y border-gray-50 py-6 mb-8">
                                    <div className="text-center">
                                        <p className="text-lg font-black text-gray-900">{displayUser.orderCount}</p>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">طلب</p>
                                    </div>
                                    <div className="text-center border-r border-gray-50">
                                        <p className="text-lg font-black text-gray-900">{displayUser.addressCount}</p>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">عنوان</p>
                                    </div>
                                </div>

                                <button
                                    onClick={handleLogout}
                                    className="flex items-center justify-center gap-3 w-full py-4 text-red-500 font-black text-sm hover:bg-red-50 hover:text-red-600 rounded-2xl transition-colors"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span>تسجيل الخروج</span>
                                </button>
                            </div>
                        </div>

                        {/* Recent Activity Mini-List */}
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-md border border-gray-100">
                            <h3 className="font-black text-gray-900 mb-6 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-brand-500" /> آخر النشاطات
                            </h3>
                            <div className="space-y-4">
                                {recentOrders.map((order, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-brand-50 group-hover:text-brand-600 transition-all">
                                                <Package className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-gray-900">{order.id}</p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase">{order.date}</p>
                                            </div>
                                        </div>
                                        <div className="text-left">
                                            <p className="text-xs font-black text-brand-600">{order.total}</p>
                                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${order.status === 'جاري التوصيل' ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Link href="/account/orders" className="block text-center mt-6 text-xs font-black text-brand-500 hover:text-brand-600 transition-colors">عرض جميع الطلبات</Link>
                        </div>
                    </div>

                    {/* ── MAIN DASHBOARD (8/12) ── */}
                    <div className="lg:col-span-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {sections.map((section) => (
                                <Link
                                    key={section.id}
                                    href={section.href}
                                    className="bg-white p-8 rounded-[2.5rem] border border-transparent hover:border-brand-200 transition-all group shadow-sm hover:shadow-xl"
                                >
                                    <div className={`w-14 h-14 ${section.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                        {section.icon}
                                    </div>
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-xl font-black text-gray-900 group-hover:text-brand-600 transition-colors uppercase tracking-tight">{section.title}</h3>
                                        <ChevronLeft className="w-5 h-5 text-gray-300 group-hover:text-brand-400 group-hover:-translate-x-2 transition-all" />
                                    </div>
                                    <p className="text-gray-400 font-bold text-sm leading-relaxed">{section.desc}</p>
                                </Link>
                            ))}
                        </div>

                        {/* Order Help Banner */}
                        <div className="mt-10 rounded-[2.5rem] bg-slate-900 p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                            <div className="absolute bottom-0 right-0 w-40 h-40 bg-brand-500/10 rounded-full blur-3xl" />
                            <div className="relative z-10 text-center md:text-right">
                                <h3 className="text-2xl font-black mb-2">تحتاج مساعدة في طلبك؟</h3>
                                <p className="text-slate-400 font-bold text-sm">فريق الدعم الفني متواجد لمساعدتك في أي وقت</p>
                            </div>
                            <Link href="/contact" className="relative z-10 bg-white text-slate-900 font-black px-10 py-4 rounded-2xl hover:bg-brand-50 transition-all shadow-xl active:scale-95 whitespace-nowrap">
                                تواصل مع الدعم
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
