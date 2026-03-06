import { Metadata } from 'next';
import { Award, Shield, ThumbsUp, Leaf, Phone } from 'lucide-react';
import Image from 'next/image';
import { STORE_NAME, STORE_NAME_EN } from '@/lib/constants';

export const metadata: Metadata = {
    title: 'من نحن',
    description: 'تعرف على قصة أنهار الديرة ومجموعة شركاتنا التي تخدمكم في الكويت أينما كنتم.',
};

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-slate-50">
            {/* ── HERO BANNER ── */}
            <section className="relative py-24 lg:py-32 bg-brand-600 overflow-hidden text-center text-white">
                <div className="absolute inset-0 bg-gradient-to-tr from-accent-600/80 to-brand-700/80 z-10" />
                <div className="absolute inset-0 z-0">
                    {/* Background pattern */}
                    <div className="w-full h-full opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20px 20px, white 2px, transparent 0)', backgroundSize: '40px 40px' }} />
                </div>

                <div className="relative z-20 max-w-4xl mx-auto px-4">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl p-4">
                        <Image src="/logo-2.png" alt={STORE_NAME} width={80} height={80} className="object-contain" />
                    </div>
                    <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                        {STORE_NAME} <br />
                        <span className="text-xl lg:text-3xl font-medium mt-4 block text-brand-100">{STORE_NAME_EN}</span>
                    </h1>
                </div>

                {/* Wave bottom */}
                <div className="absolute bottom-[-1px] left-0 right-0 w-full z-20">
                    <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto text-slate-50 block">
                        <path d="M0,60 C360,0 1080,0 1440,60 L0,60 Z" fill="currentColor" />
                    </svg>
                </div>
            </section>

            {/* ── COMPANY MESSAGE ── */}
            <section className="py-16 max-w-4xl mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold text-navy-500 mb-8">رسالتنا</h2>
                <div className="bg-white p-8 lg:p-12 rounded-3xl shadow-sm border border-gray-100 relative">
                    <span className="text-6xl text-brand-200 absolute top-4 right-8 font-serif leading-none">"</span>
                    <p className="text-xl lg:text-2xl text-gray-700 leading-relaxed font-medium relative z-10">
                        لأننا عيال الديرة.. ونعرف احتياجاتكم، وفرنا لكم في موقع "انهار الديرة" مجموعة ضخمة ومتنوعة من كافة التشكيلات التي تخص المنازل والديوانيات وحتى المطاعم بأسعار تنافسية.. ولأن الجودة تهمنا، فنحن في "انهار الديرة" نحرص على تقديم أفضل المنتجات وأأمنها.
                    </p>
                </div>
            </section>

            {/* ── QUALITY ICONS ── */}
            <section className="py-12 bg-white border-y border-gray-100">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        {[
                            { icon: <Shield className="w-10 h-10" />, title: 'جودة مضمونة', desc: 'منتجاتنا تخضع لأعلى مسويات الفحص' },
                            { icon: <ThumbsUp className="w-10 h-10" />, title: 'أسعار تنافسية', desc: 'نوفر لكم أفضل الأسعار القيمة' },
                            { icon: <Award className="w-10 h-10" />, title: 'مواد أصلية', desc: 'خاماتنا ومنتجاتنا آمنة للاستخدام' },
                            { icon: <Leaf className="w-10 h-10" />, title: 'حلال 100%', desc: 'كافة المواد بلاستيك/ورق حلال' },
                        ].map((item, idx) => (
                            <div key={idx} className="flex flex-col items-center space-y-4 p-6 hover:bg-slate-50 rounded-2xl transition-colors">
                                <div className="w-20 h-20 bg-brand-50 text-accent-500 rounded-full flex items-center justify-center">
                                    {item.icon}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-navy-500">{item.title}</h3>
                                    <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── AL-DEERA GROUP OF COMPANIES ── */}
            <section className="py-20 max-w-7xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-navy-500 mb-4 tracking-tight">مجموعة شركاتنا لخدمتكم</h2>
                    <p className="text-gray-500 max-w-2xl mx-auto">نفخر في مجموعة الديرة بتلبية كافة احتياجات السوق الكويتي من خلال 5 شركات متخصصة تعمل جميعها لخدمتكم لتكون مسيرتكم أسهل.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        { name: 'اسواق انهار الديرة', desc: 'سوقك المركزي لكل احتياجات المنزل واليوميات.', phone: '+965 51625057', brand: 'bg-brand-600' },
                        { name: 'الديرة باك', desc: 'متخصصون في الأكياس، التغليف، والمواد البلاستيكية والورقية.', phone: '+965 56501168', brand: 'bg-accent-600' },
                        { name: 'الديرة هوم', desc: 'أجمل أواني الضيافة وأدوات المطبخ والمنزل بتصاميم عصرية.', phone: '+965 67776402', brand: 'bg-navy-500' },
                        { name: 'أنهار الديرة', desc: 'مواد التنظيف، المعطرات، والمنظفات العالمية لحياة خالية من البكتيريا.', phone: '+965 55853177', brand: 'bg-gray-800' },
                        { name: 'سحاري الديرة', desc: 'طاولات طعام، كراسي، ومستلزمات الحدائق والرحلات (كشتة).', phone: '+965 66038481', brand: 'bg-brand-500' },
                    ].map((comp, idx) => (
                        <div key={idx} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-shadow relative overflow-hidden group">
                            <div className={`absolute top-0 right-0 w-2 h-full ${comp.brand}`} />
                            <h3 className="text-xl font-bold text-navy-500 mb-2">{comp.name}</h3>
                            <p className="text-gray-600 text-sm leading-relaxed mb-6 min-h-[40px]">{comp.desc}</p>

                            <a href={`tel:${comp.phone.replace(/\\s/g, '')}`} className="inline-flex items-center gap-2 bg-slate-50 hover:bg-brand-50 text-brand-600 px-4 py-2 rounded-xl transition-colors text-sm font-medium w-fit w-full justify-center">
                                <Phone className="w-4 h-4" />
                                <span dir="ltr">{comp.phone}</span>
                            </a>
                        </div>
                    ))}
                </div>
            </section>

        </main>
    );
}
