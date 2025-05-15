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
        return redirectWithParams(`${baseAppUrl}${pathname}`);
    }

    // Redirect flight paths to app URL
    if (pathname.startsWith('/flight') || pathname.startsWith('/flights')) {
        return redirectWithParams(`${baseAppUrl}${pathname}`);
    }

    // Redirect root path to marketing site
    if (pathname === '/') {
        return redirectWithParams(baseMarketingUrl);
    }

    // Gmail link redirects with query param preservation
    if (pathname === '/gmail-link_b' || pathname === '/gmail-link-landing') {
        // /Users/jesuslopez/Sprout/ascend-nextjs/src/app/(top-funnel)/onboarding-landing/page.tsx
        return redirectWithParams(`${baseMainUrl}/onboarding-landing`);
    }

    if (pathname === '/auth/phone-register') {
        // Create URL with the mandatory step parameter and preserve existing params
        const newUrl = new URL(`${baseMainUrl}/onboarding`);
        newUrl.searchParams.append('step', 'phone-confirmation');

        // Copy all search params from the original URL
        searchParams.forEach((value, key) => {
            // Skip if it's the step parameter we already added
            if (key !== 'step') {
                newUrl.searchParams.append(key, value);
            }
        });

        console.log(`Redirecting to: ${newUrl.toString()}`);

        return NextResponse.redirect(newUrl);
    }

    if (pathname === '/gmail-link_b/success') {
        // Create URL with the mandatory step parameter and preserve existing params
        const newUrl = new URL(`${baseMainUrl}/onboarding`);
        newUrl.searchParams.append('step', 'subscription');

        // Copy all search params from the original URL
        searchParams.forEach((value, key) => {
            // Skip if it's the step parameter we already added
            if (key !== 'step') {
                newUrl.searchParams.append(key, value);
            }
        });

        console.log(`Redirecting to: ${newUrl.toString()}`);

        return NextResponse.redirect(newUrl);
    }

    return NextResponse.next();
}

// Configure which paths the middleware will run on
export const config = {
    matcher: [
        '/',
        '/pick/:path*',
        '/picksV2/:path*',
        '/flight/:path*',
        '/flights/:path*',
        '/gmail-link_b',
        '/gmail-link-landing',
        '/auth/phone-register',
        '/gmail-link_b/success'
    ]
};
