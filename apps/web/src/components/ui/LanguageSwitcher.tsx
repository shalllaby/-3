'use client';

/**
 * LanguageSwitcher — Anhar Al-Deera
 * Arabic / English two-option switcher.
 * Switches RTL ↔ LTR and persists selection.
 */
import { useLocaleStore, LOCALE_META, Locale } from '@/store/locale.store';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
    const { locale, setLocale } = useLocaleStore();

    const locales = Object.entries(LOCALE_META) as [Locale, typeof LOCALE_META[Locale]][];

    const handleSelect = (l: Locale) => {
        setLocale(l);
    };

    const current = LOCALE_META[locale];

    return (
        <div className="flex items-center gap-1">
            {compact ? (
                <Globe className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
            ) : null}
            {locales.map(([code, meta]) => (
                <button
                    key={code}
                    onClick={() => handleSelect(code)}
                    aria-pressed={locale === code}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold
                                transition-all duration-200 select-none
                                ${locale === code
                            ? 'bg-brand-100 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800'
                            : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-transparent'
                        }`}
                >
                    <span className="text-base leading-none">{meta.flag}</span>
                    {!compact && (
                        <span className="hidden sm:inline">{meta.nativeName}</span>
                    )}
                </button>
            ))}
        </div>
    );
}
