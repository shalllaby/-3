/**
 * i18n Translation System — Anhar Al-Deera
 * useTranslation() hook for client-side translations.
 * Loads locale JSON lazily. No route changes needed.
 */
'use client';

import { useCallback, useEffect, useState } from 'react';
import { useLocaleStore, Locale } from '@/store/locale.store';

type NestedRecord = Record<string, Record<string, string>>;

const cache: Partial<Record<Locale, NestedRecord>> = {};

async function loadLocale(locale: Locale): Promise<NestedRecord> {
    if (cache[locale]) return cache[locale]!;

    try {
        const mod = await import(`./locales/${locale}.json`);
        cache[locale] = mod.default as NestedRecord;
        return cache[locale]!;
    } catch {
        // Fallback to Arabic if locale not found
        if (locale !== 'ar') return loadLocale('ar');
        return {};
    }
}

export function useTranslation() {
    const { locale } = useLocaleStore();
    const [translations, setTranslations] = useState<NestedRecord>({});

    useEffect(() => {
        loadLocale(locale).then(setTranslations);
    }, [locale]);

    /**
     * Translate a key like 'nav.home' → looks up translations.nav.home
     * Falls back to the key itself if not found.
     */
    const t = useCallback(
        (key: string, params?: Record<string, string>): string => {
            const [section, ...rest] = key.split('.');
            const subKey = rest.join('.');

            let value = translations[section]?.[subKey] ?? key;

            if (params) {
                Object.entries(params).forEach(([k, v]) => {
                    value = value.replace(`{{${k}}}`, v);
                });
            }

            return value;
        },
        [translations],
    );

    return { t, locale };
}

/**
 * Simple number formatter using the current locale.
 */
export function useNumberFormat() {
    const { locale } = useLocaleStore();
    const format = useCallback(
        (n: number, opts?: Intl.NumberFormatOptions) =>
            new Intl.NumberFormat(locale, opts).format(n),
        [locale],
    );
    return { format };
}

/**
 * Currency formatter: always KWD, locale-aware display.
 */
export function useCurrencyFormat() {
    const { locale } = useLocaleStore();
    const format = useCallback(
        (amount: number) =>
            new Intl.NumberFormat(locale, {
                style: 'currency',
                currency: 'KWD',
                minimumFractionDigits: 3,
                maximumFractionDigits: 3,
            }).format(amount),
        [locale],
    );
    return { format };
}

/**
 * Date formatter using the current locale.
 */
export function useDateFormat() {
    const { locale } = useLocaleStore();
    const format = useCallback(
        (date: Date | string, opts?: Intl.DateTimeFormatOptions) =>
            new Intl.DateTimeFormat(locale, opts).format(new Date(date)),
        [locale],
    );
    return { format };
}
