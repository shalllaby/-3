import { Metadata } from 'next';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

export const metadata: Metadata = {
    title: 'سياسة الخصوصية والشروط — الديرة باك',
    description: 'تعرف على كيفية حماية بياناتك وشروط استخدام متجر الديرة باك في الكويت.',
};

export default function LegalPage() {
    return (
        <main className="min-h-screen bg-slate-50 py-16 lg:py-24">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white rounded-[3rem] p-10 lg:p-20 shadow-xl border border-gray-100">

                    <div className="flex items-center gap-4 mb-12">
                        <div className="w-16 h-16 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center">
                            <Shield className="w-8 h-8" />
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-black text-gray-900">الخصوصية والشروط</h1>
                    </div>

                    <div className="prose prose-slate max-w-none space-y-12">
                        <section>
                            <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                <Lock className="w-5 h-5 text-brand-500" /> سياسة الخصوصية
                            </h2>
                            <p className="text-gray-600 font-medium leading-relaxed">
                                نحن في الديرة باك نأخذ خصوصيتكم على محمل الجد. نقوم بجمع المعلومات الضرورية فقط لإتمام عملية الشراء وتحسين تجربتكم (مثل الاسم، العنوان، ورقم الهاتف). لا نقوم ببيع معلوماتكم لأطراف ثالثة أبداً.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                <FileText className="w-5 h-5 text-brand-500" /> الشروط والأحكام
                            </h2>
                            <ul className="space-y-4 text-gray-600 font-medium list-disc list-inside">
                                <li>جميع الأسعار الموضحة هي بالدينار الكويتي.</li>
                                <li>يتم تأكيد الطلبات فور استلامها، وسنقوم بالتواصل معكم في حال وجود أي نقص في المخزون.</li>
                                <li>نحتفظ بالحق في تعديل الأسعار أو العروض في أي وقت.</li>
                                <li>استخدامكم للموقع يعني موافقتكم على هذه الشروط.</li>
                            </ul>
                        </section>

                        <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 mt-12 text-center">
                            <p className="text-sm font-bold text-gray-500">تم تحديث هذه الصفحة بتاريخ: 22 فبراير 2026</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
