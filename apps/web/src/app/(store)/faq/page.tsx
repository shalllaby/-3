import { Metadata } from 'next';
import { HelpCircle, ChevronLeft, Truck, CreditCard, RotateCcw, ShieldCheck, MessageCircle } from 'lucide-react';
import { STORE_WHATSAPP } from '@/lib/constants';

export const metadata: Metadata = {
    title: 'الأسئلة الشائعة — الديرة باك',
    description: 'كل ما تحتاج معرفته عن الطلب، التوصيل، الدفع، وسياسة الإرجاع في الديرة باك الكويت.',
};

export default function FAQPage() {
    const faqData = [
        {
            category: 'الطلب والتوصيل',
            icon: <Truck className="w-6 h-6" />,
            questions: [
                {
                    q: 'كم يستغرق التوصيل داخل الكويت؟',
                    a: 'نوصل طلباتكم خلال مدة تتراوح بين 24 إلى 48 ساعة كحد أقصى لجميع المحافظات الست.'
                },
                {
                    q: 'هل التوصيل مجاني؟',
                    a: 'نعم، التوصيل مجاني لجميع الطلبات التي تتجاوز قيمتها 10 د.ك. للطلبات الأقل، يتم احتساب رسوم توصيل رمزية تظهر لك في صفحة الدفع.'
                },
                {
                    q: 'كيف يمكنني تتبع طلبي؟',
                    a: 'بمجرد خروج الطلب للتوصيل، ستصلك رسالة نصية (SMS) تحتوي على رابط لتتبع السائق مباشرة أو يمكنك التواصل مع خدمة العملاء.'
                }
            ]
        },
        {
            category: 'الدفع والأمان',
            icon: <CreditCard className="w-6 h-6" />,
            questions: [
                {
                    q: 'ما هي طرق الدفع المتاحة؟',
                    a: 'نوفر جميع طرق الدفع المحلية والعالمية: كي نت (KNET)، Apple Pay، بطاقات الفيزا والماستركارد، بالإضافة إلى الدفع عند الاستلام.'
                },
                {
                    q: 'هل الدفع عبر موقعكم آمن؟',
                    a: 'نعم تماماً، نستخدم بوابات دفع مشفرة بمعايير عالمية ولا نقوم بتخزين بيانات بطاقتكم البنكية في أنظمتنا.'
                }
            ]
        },
        {
            category: 'الإرجاع والاستبدال',
            icon: <RotateCcw className="w-6 h-6" />,
            questions: [
                {
                    q: 'ما هي سياسة الإرجاع لديكم؟',
                    a: 'يمكنكم إرجاع المنتج خلال 14 يوماً من تاريخ الاستلام، بشرط أن يكون المنتج في حالته الأصلية وتغليفه الأصلي ولم يتم استخدامه.'
                },
                {
                    q: 'كيف يمكنني استرداد أموالي؟',
                    a: 'في حال الإرجاع، يتم إعادة المبلغ لنفس وسيلة الدفع المستخدمة. في حال الدفع عند الاستلام، يتم التحويل لحسابكم البنكي خلال 3-5 أيام عمل.'
                }
            ]
        }
    ];

    return (
        <main className="min-h-screen bg-slate-50 py-12 lg:py-24">
            <div className="max-w-4xl mx-auto px-4">

                {/* ── HEADER ── */}
                <div className="text-center mb-16 lg:mb-24">
                    <div className="w-16 h-16 bg-brand-500 text-white rounded-[1.5rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-brand-100">
                        <HelpCircle className="w-10 h-10" />
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6">التعليمات والأسئلة الشائعة</h1>
                    <p className="text-gray-500 font-bold text-lg max-w-xl mx-auto">
                        جمعنا لك أكثر الأسئلة تكراراً لتوفير وقتك. إذا لم تجد إجابتك هنا، فريقنا متاح دائماً.
                    </p>
                </div>

                {/* ── FAQ LIST ── */}
                <div className="space-y-12">
                    {faqData.map((group, idx) => (
                        <div key={idx} className="space-y-6">
                            <div className="flex items-center gap-3 px-4">
                                <span className="p-2 bg-brand-50 text-brand-600 rounded-lg">{group.icon}</span>
                                <h2 className="text-2xl font-black text-gray-900 leading-none">{group.category}</h2>
                            </div>

                            <div className="space-y-4">
                                {group.questions.map((item, qIdx) => (
                                    <details key={qIdx} className="group bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                        <summary className="flex items-center justify-between p-7 cursor-pointer list-none">
                                            <span className="text-lg font-bold text-gray-900 group-open:text-brand-600 transition-colors pl-6">
                                                {item.q}
                                            </span>
                                            <ChevronLeft className="w-5 h-5 text-gray-300 group-open:-rotate-90 transition-transform" />
                                        </summary>
                                        <div className="px-7 pb-8">
                                            <div className="h-px bg-slate-50 mb-6" />
                                            <p className="text-gray-600 font-medium leading-relaxed">
                                                {item.a}
                                            </p>
                                        </div>
                                    </details>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── STILL NEED HELP? ── */}
                <div className="mt-20 p-10 lg:p-16 rounded-[3rem] bg-brand-600 text-white text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                    <div className="relative z-10">
                        <h2 className="text-3xl font-black mb-6 flex items-center justify-center gap-3">
                            <ShieldCheck className="w-8 h-8" /> ما زلت بحاجة للمساعدة؟
                        </h2>
                        <p className="text-brand-50 text-lg font-bold mb-10 max-w-md mx-auto leading-relaxed">
                            خبراء خدمة العملاء لدينا مستعدون للإجابة على جميع تساؤلاتكم عبر الواتساب في أي وقت.
                        </p>
                        <a
                            href={STORE_WHATSAPP}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 bg-white text-brand-600 font-black px-12 py-5 rounded-2xl hover:bg-brand-50 transition-all shadow-xl active:scale-95 text-lg"
                        >
                            <MessageCircle className="w-6 h-6" />
                            <span>تحدث معنا الآن</span>
                        </a>
                    </div>
                </div>
            </div>
        </main>
    );
}
