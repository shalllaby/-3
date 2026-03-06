import type { Metadata, Viewport } from 'next';
import { IBM_Plex_Sans_Arabic } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';
import { STORE_NAME } from '@/lib/constants';
import ThemeProvider from '@/components/ui/ThemeProvider';

const arabicFont = IBM_Plex_Sans_Arabic({
    subsets: ['arabic', 'latin'],
    weight: ['300', '400', '500', '600', '700'],
    variable: '--font-arabic',
    display: 'swap',
    fallback: ['system-ui', 'Tajawal', 'sans-serif'],
});

export const metadata: Metadata = {
    title: {
        default: `${STORE_NAME} | متجر الكويت`,
        template: `%s | ${STORE_NAME} | Anhar AL-Deera`,
    },
    description:
        'انهار الديرة — متجرك الإلكتروني الأول في الكويت. إلكترونيات، أزياء، منزل وأكثر. ' +
        'ادفع بكي نت، Pay Deema، Apple Pay، أو فيزا. أسرع توصيل لجميع المحافظات.',
    keywords: [
        'أنهار الديرة', 'تسوق الكويت', 'متجر إلكتروني', 'الكويت',
        'كي نت', 'Pay Deema', 'Apple Pay', 'توصيل الكويت',
    ],
    openGraph: {
        locale: 'ar_KW',
        type: 'website',
        siteName: 'انهار الديرة | Anhar AL-Deera',
        title: 'انهار الديرة | Anhar AL-Deera',
    },
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: '#8b5cf6' },
        { media: '(prefers-color-scheme: dark)', color: '#4c1d95' },
    ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ar" dir="rtl" className={arabicFont.variable}>
            <body className="font-sans antialiased bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 transition-colors duration-200">
                <ThemeProvider>
                    {children}
                    <Toaster
                        position="top-left"
                        toastOptions={{
                            style: {
                                fontFamily: 'var(--font-arabic)',
                                direction: 'rtl',
                                borderRadius: '14px',
                                background: 'var(--surface-0)',
                                color: 'var(--text-primary)',
                                border: '1px solid var(--border-subtle)',
                                boxShadow: 'var(--shadow-elevated)',
                            },
                            success: {
                                iconTheme: { primary: '#22c55e', secondary: '#fff' },
                            },
                            error: {
                                iconTheme: { primary: '#ef4444', secondary: '#fff' },
                            },
                            duration: 3500,
                        }}
                    />
                </ThemeProvider>
            </body>
        </html>
    );
}
