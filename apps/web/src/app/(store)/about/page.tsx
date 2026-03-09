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
        <main className="min-h-screen bg-white">
            {/* ── HERO BANNER ── */}
            <section className="relative py-28 lg:py-40 bg-blue-700 overflow-hidden text-center text-white">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/40 to-blue-600/40 z-10" />
                <div className="absolute inset-0 z-0">
                    {/* Background pattern */}
                    <div className="w-full h-full opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20px 20px, white 2px, transparent 0)', backgroundSize: '40px 40px' }} />
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/20 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-yellow-400/10 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />
                </div>

                <div className="relative z-20 max-w-5xl mx-auto px-4">
                    <div className="w-28 h-28 bg-white rounded-[32px] flex items-center justify-center mx-auto mb-10 shadow-2xl p-5 rotate-3 hover:rotate-0 transition-transform duration-500">
                        <Image src="/logo-2.png" alt={STORE_NAME} width={90} height={90} className="object-contain" />
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-black mb-8 tracking-tight">
                        {STORE_NAME} <br />
                        <span className="text-xl lg:text-3xl font-bold mt-6 block text-blue-100/80 uppercase tracking-widest">{STORE_NAME_EN}</span>
                    </h1>
                </div>

                {/* Wave bottom */}
                <div className="absolute bottom-[-1px] left-0 right-0 w-full z-20">
                    <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto text-white block">
                        <path d="M0,60 C360,0 1080,0 1440,60 L0,60 Z" fill="currentColor" />
                    </svg>
                </div>
            </section>

            {/* ── COMPANY MESSAGE ── */}
            <section className="py-20 max-w-5xl mx-auto px-4 text-center">
                <h2 className="text-3xl font-black text-slate-800 mb-10 tracking-tight">كلمة انهار الديرة</h2>
                <div className="bg-slate-50 p-10 lg:p-16 rounded-[40px] border border-slate-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/30 blur-[60px] rounded-full" />
                    <span className="text-8xl text-blue-200/50 absolute top-2 right-10 font-serif leading-none">"</span>
                    <p className="text-xl lg:text-3xl text-slate-700 leading-[1.8] font-bold relative z-10 tracking-tight">
                        لأننا عيال الديرة.. ونعرف احتياجاتكم، وفرنا لكم في موقع "انهار الديرة" مجموعة ضخمة ومتنوعة من كافة التشكيلات التي تخص المنازل والديوانيات وحتى المطاعم بأسعار تنافسية.. ولأن الجودة تهمنا، فنحن في "انهار الديرة" نحرص على تقديم أفضل المنتجات وأأمنها.
                    </p>
                </div>
            </section>

            {/* ── QUALITY ICONS ── */}
            <section className="py-20 bg-white border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
                        {[
                            { icon: <Shield className="w-10 h-10" />, title: 'جودة مضمونة', desc: 'أعلى معايير الفحص' },
                            { icon: <ThumbsUp className="w-10 h-10" />, title: 'أسعار تنافسية', desc: 'أفضل قيمة لعملائنا' },
                            { icon: <Award className="w-10 h-10" />, title: 'مواد أصلية', desc: 'خامات آمنة تماماً' },
                            { icon: <Leaf className="w-10 h-10" />, title: 'حلال 100%', desc: 'كافة المواد معتمدة' },
                        ].map((item, idx) => (
                            <div key={idx} className="flex flex-col items-center space-y-6 group">
                                <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-[28px] flex items-center justify-center transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 group-hover:rotate-3 shadow-sm">
                                    {item.icon}
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-800">{item.title}</h3>
                                    <p className="text-slate-500 font-medium mt-2">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── AL-DEERA GROUP OF COMPANIES ── */}
            <section className="py-24 max-w-7xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-black text-slate-800 mb-6 tracking-tight">مجموعة شركاتنا لخدمتكم</h2>
                    <p className="text-slate-500 max-w-2xl mx-auto font-medium text-lg">نفخر في مجموعة الديرة بتلبية كافة احتياجات السوق الكويتي من خلال شركات متخصصة تعمل جميعها لخدمتكم.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        { name: 'اسواق انهار الديرة', desc: 'سوقك المركزي لكل احتياجات المنزل واليوميات.', phone: '+965 51625057', brand: 'bg-blue-600' },
                        { name: 'الديرة باك', desc: 'متخصصون في الأكياس، التغليف، والمواد البلاستيكية والورقية.', phone: '+965 56501168', brand: 'bg-blue-800' },
                        { name: 'الديرة هوم', desc: 'أجمل أواني الضيافة وأدوات المطبخ والمنزل بتصاميم عصرية.', phone: '+965 67776402', brand: 'bg-blue-700' },
                        { name: 'أنهار الديرة', desc: 'مواد التنظيف، المعطرات، والمنظفات العالمية لحياة خالية من البكتيريا.', phone: '+965 55853177', brand: 'bg-slate-800' },
                        { name: 'سحاري الديرة', desc: 'طاولات طعام، كراسي، ومستلزمات الحدائق والرحلات (كشتة).', phone: '+965 66038481', brand: 'bg-blue-600' },
                    ].map((comp, idx) => (
                        <div key={idx} className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all relative overflow-hidden group">
                            <div className={`absolute top-0 right-0 w-2 h-full ${comp.brand}`} />
                            <h3 className="text-2xl font-black text-slate-800 mb-3">{comp.name}</h3>
                            <p className="text-slate-600 font-medium leading-relaxed mb-8 min-h-[48px]">{comp.desc}</p>

                            <a href={`tel:${comp.phone.replace(/\\s/g, '')}`} className="inline-flex items-center gap-3 bg-slate-50 hover:bg-blue-600 hover:text-white text-blue-600 px-6 py-3 rounded-2xl transition-all font-bold w-full justify-center">
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
