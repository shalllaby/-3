'use client';

/**
 * ThemeProvider — Anhar Al-Deera
 * Applies dark/light theme class on <html> based on Zustand store.
 * Reads OS preference on first load (no hydration flash).
 */
import { useEffect } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
    theme: Theme;
    resolvedTheme: 'light' | 'dark';
    setTheme: (theme: Theme) => void;
}

function getOSTheme(): 'light' | 'dark' {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export const useThemeStore = create<ThemeState>()(
    persist(
        (set, get) => ({
            theme: 'light',
            resolvedTheme: 'light',

            setTheme: (theme: Theme) => {
                const resolved = theme === 'system' ? getOSTheme() : theme;
                applyTheme(resolved);
                set({ theme, resolvedTheme: resolved });
            },
        }),
        { name: 'anhar-theme', partialize: (s) => ({ theme: s.theme }) },
    ),
);

function applyTheme(resolved: 'light' | 'dark') {
    const root = document.documentElement;
    if (resolved === 'dark') {
        root.classList.add('dark');
    } else {
        root.classList.remove('dark');
    }
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
    const { theme, setTheme } = useThemeStore();

    useEffect(() => {
        // Apply stored or system theme on mount
        setTheme(theme);

        // Listen to OS theme changes when in 'system' mode
        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            if (useThemeStore.getState().theme === 'system') {
                setTheme('system');
            }
        };
        mq.addEventListener('change', handleChange);
        return () => mq.removeEventListener('change', handleChange);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Apply the locale direction on mount to avoid hydration flash
    useEffect(() => {
        const stored = localStorage.getItem('anhar-locale');
        if (stored) {
            try {
                const { state } = JSON.parse(stored);
                if (state?.locale) {
                    document.documentElement.lang = state.locale;
                    document.documentElement.dir = ['ar', 'ur'].includes(state.locale) ? 'rtl' : 'ltr';
                }
            } catch { /* ignore */ }
        }
    }, []);

    return <>{children}</>;
}
