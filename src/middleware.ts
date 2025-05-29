import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import * as Sentry from '@sentry/nextjs';

import { LINK_FAILURE_PARAM, PERMISSIONS_FAILURE_PARAM } from './app/[locale]/(top-funnel)/welcome/_types';
import createIntlMiddleware from 'next-intl/middleware';

// Create the internationalization middleware
const intlMiddleware = createIntlMiddleware({
    locales: ['en', 'es'],
    defaultLocale: 'en'
});

// Helper function to preserve query parameters
const redirectWithParams = (baseUrl: string, searchParams: URLSearchParams) => {
    const newUrl = new URL(baseUrl);
    searchParams.forEach((value, key) => {
        newUrl.searchParams.append(key, value);
    });
    console.log(`Redirecting to: ${newUrl.toString()}`);

    return NextResponse.redirect(newUrl);
};

type WelcomeRedirect = {
    path: string;
    step?: string;
    extraParams?: {
        [LINK_FAILURE_PARAM]?: string;
        [PERMISSIONS_FAILURE_PARAM]?: string;
    };
};

export async function middleware(request: NextRequest) {
    // Initialize Sentry
    Sentry.init({
        dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
        environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT,
        tracesSampleRate: 1.0,
        debug: process.env.NODE_ENV === 'development'
    });

    const { pathname, searchParams } = request.nextUrl;

    // Determine environment using the custom env var
    const isLocalDev = process.env.NEXT_PUBLIC_IS_LOCAL_DEV === 'true';

    // Base URLs based on environment
    const localRedirectUrl = process.env.NEXT_PUBLIC_LOCAL_REDIRECT_URL || 'http://localhost:3003';
    const baseAppUrl = isLocalDev ? localRedirectUrl : 'https://app.heyascend.com';
    const baseMarketingUrl = isLocalDev ? localRedirectUrl : 'https://heyascend.com';
    const legacyUrl = isLocalDev ? localRedirectUrl : 'https://app.ascend.travel';

    // Handle legacy redirects first
    if (pathname.startsWith('/picksV2') || pathname.startsWith('/pick')) {
        return redirectWithParams(`${legacyUrl}${pathname}`, searchParams);
    }

    if (pathname.startsWith('/flight') || pathname.startsWith('/flights')) {
        return redirectWithParams(`${legacyUrl}${pathname}`, searchParams);
    }

    // Handle special routes that need to be redirected to welcome page
    const welcomeRedirects: WelcomeRedirect[] = [
        {
            path: '/',
            step: undefined
        },
        {
            path: '/gmail-link-landing',
            step: undefined
        },
        {
            path: '/gmail-link_b',
            step: '1'
        },
        {
            path: '/auth/phone-register',
            step: '2'
        },
        {
            path: '/gmail-link_b/success',
            step: '3'
        },
        {
            path: '/gmail-link_b/failure',
            step: '1',
            extraParams: { [LINK_FAILURE_PARAM]: 'true' }
        },
        {
            path: '/gmail-link_b/permissions-failure',
            step: '1',
            extraParams: { [PERMISSIONS_FAILURE_PARAM]: 'true' }
        }
    ];

    for (const redirect of welcomeRedirects) {
        if (pathname === redirect.path) {
            const newUrl = new URL(`${baseAppUrl}/welcome`);
            if (redirect.step) {
                newUrl.searchParams.append('step', redirect.step);
            }
            if (redirect.extraParams) {
                Object.entries(redirect.extraParams).forEach(([key, value]) => {
                    if (value) {
                        newUrl.searchParams.append(key, value);
                    }
                });
            }
            searchParams.forEach((value, key) => {
                if (!redirect.step || key !== 'step') {
                    if (!redirect.extraParams || !(key in redirect.extraParams)) {
                        newUrl.searchParams.append(key, value);
                    }
                }
            });
            console.log(`Redirecting ${redirect.path} to: ${newUrl.toString()}`);

            return NextResponse.redirect(newUrl);
        }
    }

    // Handle internationalization for all other routes
    return intlMiddleware(request);
}

export const config = {
    // Match all paths except static files and api routes
    matcher: [
        // Match all pathnames except for
        // - api routes
        // - static files (/_next/, /images/, /favicon.ico, etc)
        // - public files (robots.txt, etc)
        '/((?!api|_next|.*\\..*).*)',
    ]
};

// http://localhost:3003/gmail-link_b/permissions-failure?state_id=state_id=5d252757-fe8d-48f6-a777-1fe6ec401256
// http://localhost:3003/gmail-link_b/failure?state_id=state_id=5d252757-fe8d-48f6-a777-1fe6ec401256
