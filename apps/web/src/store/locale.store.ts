/**
 * Locale Zustand Store — Anhar Al-Deera
 * Supports Arabic (RTL) and English (LTR) only.
 * Persists selected language in localStorage + cookie.
 * NO hydration errors: locale is read client-side only.
 */
'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Locale = 'ar' | 'en';
export type Direction = 'rtl' | 'ltr';

export interface LocaleState {
    locale: Locale;
    direction: Direction;
    setLocale: (locale: Locale) => void;
}

const RTL_LOCALES: Locale[] = ['ar'];

export function getDirection(locale: Locale): Direction {
    return RTL_LOCALES.includes(locale) ? 'rtl' : 'ltr';
}

export const LOCALE_META: Record<Locale, { label: string; flag: string; nativeName: string }> = {
    ar: { label: 'Arabic', flag: '🇰🇼', nativeName: 'العربية' },
    en: { label: 'English', flag: '🇬🇧', nativeName: 'English' },
};

export const useLocaleStore = create<LocaleState>()(
    persist(
        (set) => ({
            locale: 'ar',
            direction: 'rtl',

            setLocale: (locale: Locale) => {
                const direction = getDirection(locale);

                if (typeof document !== 'undefined') {
                    document.documentElement.dir = direction;
                    document.documentElement.lang = locale;
                    document.cookie = `locale=${locale}; path=/; max-age=31536000; samesite=lax`;
                }

                set({ locale, direction });
            },
        }),
        {
            name: 'anhar-locale',
            partialize: (state) => ({ locale: state.locale, direction: state.direction }),
        },
    ),
);
