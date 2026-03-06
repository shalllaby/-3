import CheckoutSteps from '@/components/store/CheckoutSteps';
import { Metadata } from 'next';
import { ShieldCheck } from 'lucide-react';
import { STORE_NAME } from '@/lib/constants';

export const metadata: Metadata = {
    title: 'إتمام الطلب',
    description: `أكمل طلبك الآن من ${STORE_NAME}. دفع آمن وتوصيل سريع.`
};

export default function CheckoutPage() {
    return (
        <main className="min-h-screen bg-slate-50 py-8 lg:py-12">
            {/* Header Section */}
            <div className="max-w-4xl mx-auto px-4 mb-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">إتمام الطلب</h1>
                        <p className="text-gray-500 mt-2">يرجى ملء بيانات التوصيل واختيار طريقة الدفع المفضلة لديك</p>
                    </div>
                    <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-xl text-sm font-medium border border-green-100">
                        <ShieldCheck className="w-4 h-4" />
                        دفع آمن 100%
                    </div>
                </div>
            </div>

            {/* Checkout Process */}
            <section>
                <CheckoutSteps />
            </section>

            {/* Support Info */}
            <div className="max-w-4xl mx-auto px-4 mt-12 text-center text-gray-400 text-sm">
                <p>هل تواجه مشكلة في إتمام الطلب؟ تواصل معنا عبر الواتساب على 965XXXXXXXX+</p>
            </div>
        </main>
    );
}
