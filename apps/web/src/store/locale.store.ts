/**
 * Locale Zustand Store — Anhar Al-Deera
 * Arabic (RTL) only.
 * Persists locale in localStorage.
 */
'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Locale = 'ar';
export type Direction = 'rtl';

export interface LocaleState {
    locale: Locale;
    direction: Direction;
    setLocale: (locale: Locale) => void;
}

export const LOCALE_META: Record<Locale, { label: string; flag: string; nativeName: string }> = {
    ar: { label: 'Arabic', flag: '🇰🇼', nativeName: 'العربية' },
};

export const useLocaleStore = create<LocaleState>()(
    persist(
        (set) => ({
            locale: 'ar',
            direction: 'rtl',

            setLocale: (locale: Locale) => {
                if (typeof document !== 'undefined') {
                    document.documentElement.dir = 'rtl';
                    document.documentElement.lang = locale;
                    document.cookie = `locale=${locale}; path=/; max-age=31536000; samesite=lax`;
                }
                set({ locale, direction: 'rtl' });
            },
        }),
        {
            name: 'anhar-locale',
            partialize: (state) => ({ locale: state.locale, direction: state.direction }),
        },
    ),
);
