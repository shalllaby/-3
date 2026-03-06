/**
 * Auth Store — Zustand with localStorage persistence.
 * Manages JWT token and current user state.
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: 'ADMIN' | 'CUSTOMER';
    referralCode?: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    setAuth: (user: User, token: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,

            setAuth: (user, token) => {
                localStorage.setItem('auth_token', token);
                // Set cookie for middleware (Next.js server-side)
                document.cookie = `auth_token=${token}; path=/; max-age=86400; samesite=lax`;
                set({ user, token, isAuthenticated: true });
            },

            logout: () => {
                localStorage.removeItem('auth_token');
                // Remove cookie
                document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                set({ user: null, token: null, isAuthenticated: false });
            },
        }),
        {
            name: 'kuwait-store-auth',
            partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
        },
    ),
);
