import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import * as Sentry from '@sentry/nextjs';

export function middleware(request: NextRequest) {
    // Initialize Sentry
    Sentry.init({
        dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
        environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT,
        tracesSampleRate: 1.0,
        debug: process.env.NODE_ENV === 'development'
    });

    const { pathname, searchParams } = request.nextUrl;
    const url = request.nextUrl.clone();

    /**
     * ========================================================================
     * WELCOME PAGE PATCH
     *
     * TEMPORARY REDIRECT - TO BE REMOVED AFTER BACKEND CHANGES ARE MERGED
     * This patch ensures the welcome page works in production while backend
     * changes are being integrated.
     *
     * REMOVAL INSTRUCTIONS:
     * Delete everything between the "WELCOME PAGE PATCH" comment blocks
     * (including the blocks themselves) once the backend changes are merged.
     * ========================================================================
     */
    if (pathname === '/user-rps/welcome') {
        // Preserve all query parameters in the redirect
        const redirectUrl = new URL('/user-rps', url);
        searchParams.forEach((value, key) => {
            redirectUrl.searchParams.append(key, value);
        });

        console.log(`WELCOME PAGE PATCH: Redirecting ${pathname} to /user-rps`);

        return NextResponse.redirect(redirectUrl);
    }
    /**
     * ========================================================================
     * END OF WELCOME PAGE PATCH
     * ========================================================================
     */

    // Determine environment using the custom env var
    const isLocalDev = process.env.NEXT_PUBLIC_IS_LOCAL_DEV === 'true';

    // Base URLs based on environment
    const localRedirectUrl = process.env.NEXT_PUBLIC_LOCAL_REDIRECT_URL || 'http://localhost:3003';
    const baseAppUrl = isLocalDev ? localRedirectUrl : 'https://app.ascend.travel';
    const baseMainUrl = isLocalDev ? localRedirectUrl : 'https://ascend.travel';
    const baseMarketingUrl = isLocalDev ? localRedirectUrl : 'https://heyascend.com';

    // Helper function to preserve query parameters
    const redirectWithParams = (baseUrl: string) => {
        // Create the new URL with the base destination
        const newUrl = new URL(baseUrl);

        // Copy all search params from the original URL
        searchParams.forEach((value, key) => {
            newUrl.searchParams.append(key, value);
        });

        console.log(`Redirecting to: ${newUrl.toString()}`);

        return NextResponse.redirect(newUrl);
    };

    // Redirect old picks paths to app URL
    if (pathname.startsWith('/picksV2') || pathname.startsWith('/pick')) {
        return NextResponse.redirect(`https://app.ascend.travel${pathname}`);
    }

    // Redirect flight paths to app.ascend.travel
    if (pathname.startsWith('/flight') || pathname.startsWith('/flights')) {
        return NextResponse.redirect(`https://app.ascend.travel${pathname}`);
    }

    // Redirect root path to heyascend.com
    if (pathname === '/') {
        return NextResponse.redirect('https://heyascend.com');
    }

    return NextResponse.next();
}

// Configure which paths the middleware will run on
export const config = {
    matcher: ['/', '/pick/:path*', '/picksV2/:path*', '/flight/:path*', '/flights/:path*']
};
