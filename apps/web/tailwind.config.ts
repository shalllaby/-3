import type { Config } from 'tailwindcss';
import forms from '@tailwindcss/forms';

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    // Dark mode via class on <html>
    darkMode: 'class',
    theme: {
        extend: {
            // ── Anhar Al-Deera — Premium Purple → Indigo Brand System ──────────────
            colors: {
                // Primary brand: Purple → Indigo gradient family
                brand: {
                    50: '#f5f3ff',
                    100: '#ede9fe',
                    200: '#ddd6fe',
                    300: '#c4b5fd',
                    400: '#a78bfa',
                    500: '#8b5cf6', // primary
                    600: '#7c3aed',
                    700: '#6d28d9',
                    800: '#5b21b6',
                    900: '#4c1d95',
                    950: '#2e1065',
                },
                // Accent: Indigo complement
                accent: {
                    50: '#eef2ff',
                    100: '#e0e7ff',
                    200: '#c7d2fe',
                    300: '#a5b4fc',
                    400: '#818cf8',
                    500: '#6366f1', // indigo-500
                    600: '#4f46e5',
                    700: '#4338ca',
                    800: '#3730a3',
                    900: '#312e81',
                    950: '#1e1b4b',
                },
                // Surface hierarchy (light)
                surface: {
                    0: '#ffffff',
                    1: '#fafafa',
                    2: '#f4f4f5',
                    3: '#e4e4e7',
                    4: '#d4d4d8',
                },
                // Dark surface hierarchy — 'night' avoids conflict with Tailwind's dark: modifier
                night: {
                    0: '#09090b',
                    1: '#18181b',
                    2: '#27272a',
                    3: '#3f3f46',
                    4: '#52525b',
                },
                // Semantic colors
                success: {
                    50: '#f0fdf4',
                    500: '#22c55e',
                    600: '#16a34a',
                    900: '#14532d',
                },
                warning: {
                    50: '#fffbeb',
                    500: '#f59e0b',
                    600: '#d97706',
                    900: '#78350f',
                },
                danger: {
                    50: '#fef2f2',
                    500: '#ef4444',
                    600: '#dc2626',
                    900: '#7f1d1d',
                },
                info: {
                    50: '#eff6ff',
                    500: '#3b82f6',
                    600: '#2563eb',
                    900: '#1e3a8a',
                },
            },

            // ── Typography ──────────────────────────────────────────────────────
            fontFamily: {
                sans: ['IBM Plex Sans Arabic', 'Tajawal', 'system-ui', 'sans-serif'],
                display: ['IBM Plex Sans Arabic', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
            },

            // ── Radius scale ────────────────────────────────────────────────────
            borderRadius: {
                'xs': '4px',
                'sm': '6px',
                DEFAULT: '8px',
                'md': '10px',
                'lg': '14px',
                'xl': '18px',
                '2xl': '24px',
                '3xl': '32px',
                '4xl': '40px',
                'full': '9999px',
            },

            // ── Shadow / Elevation scale ─────────────────────────────────────────
            boxShadow: {
                'xs': '0 1px 2px 0 rgb(0 0 0 / 0.04)',
                'sm': '0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.06)',
                DEFAULT: '0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.06)',
                'md': '0 6px 16px -2px rgb(0 0 0 / 0.10), 0 4px 8px -2px rgb(0 0 0 / 0.06)',
                'lg': '0 12px 32px -4px rgb(0 0 0 / 0.12), 0 6px 12px -4px rgb(0 0 0 / 0.06)',
                'xl': '0 24px 48px -8px rgb(0 0 0 / 0.14), 0 12px 20px -8px rgb(0 0 0 / 0.08)',
                '2xl': '0 40px 64px -12px rgb(0 0 0 / 0.18)',
                // Brand colored glow shadows
                'brand': '0 8px 32px -4px rgb(139 92 246 / 0.35)',
                'brand-lg': '0 16px 48px -6px rgb(139 92 246 / 0.45)',
                'accent': '0 8px 32px -4px rgb(99 102 241 / 0.35)',
                'none': 'none',
            },

            // ── Spacing ──────────────────────────────────────────────────────────
            spacing: {
                '4.5': '1.125rem',
                '13': '3.25rem',
                '15': '3.75rem',
                '18': '4.5rem',
                '22': '5.5rem',
                '88': '22rem',
                '100': '25rem',
                '112': '28rem',
                '120': '30rem',
            },

            // ── Motion duration scale ────────────────────────────────────────────
            transitionDuration: {
                '50': '50ms',
                '250': '250ms',
                '350': '350ms',
                '400': '400ms',
                '600': '600ms',
            },

            // ── Animations ───────────────────────────────────────────────────────
            animation: {
                'fade-in': 'fadeIn 0.25s ease-out',
                'fade-in-up': 'fadeInUp 0.35s ease-out',
                'slide-down': 'slideDown 0.3s ease-out',
                'slide-up': 'slideUp 0.3s ease-out',
                'scale-in': 'scaleIn 0.2s ease-out',
                'spin-slow': 'spin 2s linear infinite',
                'pulse-brand': 'pulseBrand 2s ease-in-out infinite',
                'cart-bounce': 'cartBounce 0.4s ease-out',
                'shimmer': 'shimmer 1.5s infinite linear',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(12px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideDown: {
                    '0%': { opacity: '0', transform: 'translateY(-10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(16px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                scaleIn: {
                    '0%': { opacity: '0', transform: 'scale(0.95)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                pulseBrand: {
                    '0%, 100%': { boxShadow: '0 0 0 0 rgb(139 92 246 / 0.4)' },
                    '50%': { boxShadow: '0 0 0 12px rgb(139 92 246 / 0)' },
                },
                cartBounce: {
                    '0%': { transform: 'scale(1)' },
                    '30%': { transform: 'scale(1.25)' },
                    '60%': { transform: 'scale(0.92)' },
                    '100%': { transform: 'scale(1)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-500px 0' },
                    '100%': { backgroundPosition: '500px 0' },
                },
            },
        },
    },
    plugins: [
        forms({ strategy: 'class' }),
    ],
};

export default config;
