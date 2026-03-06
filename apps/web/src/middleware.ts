import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware — Aldeera Pack
 * Strictly protects /admin and /account routes.
 * 
 * Note: Since we use JWT with custom backend, we can't easily verify the signature 
 * on the edge without the secret, but we can check for existence and decode 
 * the payload to see the role for UI redirection.
 */

export function middleware(request: NextRequest) {
    const token = request.cookies.get('auth_token')?.value;
    const { pathname } = request.nextUrl;

    // 1. Protect Admin routes
    if (pathname.startsWith('/admin')) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        try {
            // Basic decode (not verification) to check role
            const payloadBase64 = token.split('.')[1];
            const payload = JSON.parse(atob(payloadBase64));

            if (payload.role !== 'ADMIN') {
                // Not an admin? Send home
                return NextResponse.redirect(new URL('/', request.url));
            }
        } catch (e) {
            // Malformed token? Send to login
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // 2. Protect Account routes
    if (pathname.startsWith('/account')) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/account/:path*'],
};
