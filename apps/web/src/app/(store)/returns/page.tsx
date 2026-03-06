import { Metadata } from 'next';
import { RotateCcw, ShieldCheck, Clock, FileText, ChevronRight, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'سياسة الإرجاع والاستبدال — الديرة باك',
    description: 'تعرف على حقوقك في إرجاع وستبدال المنتجات في متجر الديرة باك وشروط الاسترجاع في الكويت.',
};

export default function ReturnsPage() {
    const policies = [
        {
            title: 'شروط الإرجاع العامة',
            icon: <FileText className="w-8 h-8" />,
            points: [
                'يجب أن يكون المنتج في حالته الأصلية وتغليفه الأصلي.',
                'أن لا يكون المنتج قد تم فتحه أو استخدامه (للأغراض الصحية).',
                'توفر الفاتورة الأصلية أو رقم الطلب الإلكتروني.',
                'تقديم طلب الإرجاع خلال 14 يوماً من تاريخ الاستلام.'
            ]
        },
        {
            title: 'منتجات لا يمكن إرجاعها',
            icon: <AlertCircle className="w-8 h-8" />,
            points: [
                'المنظفات الورقية بعد فتح التغليف البلاستيكي.',
                'المنتجات السائلة التي تم كسر ختم الأمان الخاص بها.',
                'المنتجات التي تم استخدامها أو تعرضت للتلف من قبل العميل.',
                'طلبات الجملة الخاصة التي تم توفيرها حسب الطلب.'
            ]
        },
        {
            title: 'آلية استرداد المبالغ',
            icon: <RotateCcw className="w-8 h-8" />,
            points: [
                'كي نت (KNET): يعاد المبلغ للبطاقة خلال 3-5 أيام عمل.',
                'البطاقات الائتمانية: قد يستغرق 7-14 يوماً حسب البنك.',
                'الدفع عند الاستلام: يتم تحويل المبلغ لحسابكم البنكي مباشرة.',
                'يتم خصم رسوم التوصيل الأصلية إلا في حال كان المنتج تالفاً.'
            ]
        }
    ];

    return (
        <main className="min-h-screen bg-white py-16 lg:py-28">
            <div className="max-w-5xl mx-auto px-4">

                {/* ── HEADER ── */}
                <div className="flex flex-col items-center text-center mb-20">
                    <div className="w-20 h-20 bg-accent-50 text-accent-600 rounded-[2rem] flex items-center justify-center mb-8 shadow-inner">
                        <RotateCcw className="w-10 h-10" />
                    </div>
                    <h1 className="text-4xl lg:text-6xl font-black text-gray-900 mb-6 tracking-tight">سياسة <span className="text-accent-600">الإرجاع</span></h1>
                    <p className="text-gray-500 font-bold text-lg max-w-2xl leading-relaxed">
                        نحن في الديرة باك نضمن لك حقك الكامل في حال لم تكن راضياً عن المنتج. سياستنا واضحة وتهدف لراحتك.
                    </p>
                </div>

                {/* ── POLICY CARDS ── */}
                <div className="grid grid-cols-1 gap-12">
                    {policies.map((policy, idx) => (
                        <div key={idx} className="bg-slate-50 rounded-[3rem] p-8 lg:p-16 border border-slate-100 relative overflow-hidden group hover:bg-white hover:shadow-2xl transition-all duration-500">
                            {/* Decorative number */}
                            <span className="absolute -top-10 -right-10 text-[10rem] font-black text-slate-100 pointer-events-none group-hover:text-accent-50 transition-colors">0{idx + 1}</span>

                            <div className="relative z-10 flex flex-col md:flex-row gap-10">
                                <div className="w-16 h-16 bg-white text-accent-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0 group-hover:bg-accent-600 group-hover:text-white transition-all">
                                    {policy.icon}
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-2xl font-black text-gray-900 mb-8">{policy.title}</h2>
                                    <ul className="space-y-4">
                                        {policy.points.map((point, pIdx) => (
                                            <li key={pIdx} className="flex items-start gap-4 text-gray-600 font-medium">
                                                <ChevronRight className="w-5 h-5 text-accent-400 mt-0.5 flex-shrink-0" />
                                                <span>{point}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── CTA / HELP ── */}
                <div className="mt-20 p-10 lg:p-16 rounded-[3rem] bg-slate-900 text-white flex flex-col lg:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl" />
                    <div className="max-w-xl relative z-10 text-center lg:text-right">
                        <h3 className="text-3xl font-black mb-4">هل ترغب في تقديم طلب إرجاع؟</h3>
                        <p className="text-slate-400 font-bold text-lg">لا تقلق، العملية بسيطة. تواصل مع فريقنا عبر الواتساب وسنقوم بترتيب استلام المنتج منك.</p>
                    </div>
                    <Link href="/contact" className="relative z-10 bg-accent-600 text-white font-black px-12 py-5 rounded-2xl hover:bg-accent-500 transition-all shadow-xl shadow-accent-900/40 active:scale-95 text-lg whitespace-nowrap">
                        ابدأ عملية الإرجاع
                    </Link>
                </div>

                {/* ── TRUST SIGNALS ── */}
                <div className="mt-20 flex flex-wrap justify-center gap-12 lg:gap-20 opacity-40 grayscale group hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                    <div className="flex items-center gap-3">
                        <ShieldCheck className="w-10 h-10 text-brand-500" />
                        <span className="font-black text-gray-900">تسوق آمن 100%</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Clock className="w-10 h-10 text-brand-500" />
                        <span className="font-black text-gray-900">14 يوماً للإرجاع</span>
                    </div>
                </div>
            </div>
        </main>
    );
}
