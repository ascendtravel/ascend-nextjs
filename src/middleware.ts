import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import * as Sentry from '@sentry/nextjs';

import { LINK_FAILURE_PARAM, PERMISSIONS_FAILURE_PARAM } from './app/(top-funnel)/welcome/_types';
import { FRAMER_LINKS } from './config/navigation';

export async function middleware(request: NextRequest) {
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
    const baseAppUrl = isLocalDev ? localRedirectUrl : 'https://app.heyascend.com';
    const baseMarketingUrl = isLocalDev ? localRedirectUrl : 'https://heyascend.com';
    const legacyUrl = isLocalDev ? localRedirectUrl : 'https://app.ascend.travel';
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
        return redirectWithParams(`${legacyUrl}${pathname}`);
    }

    // Redirect flight paths to app URL
    if (pathname.startsWith('/flight') || pathname.startsWith('/flights')) {
        return redirectWithParams(`${legacyUrl}${pathname}`);
    }

    // Redirect root path to marketing site
    if (pathname === '/') {
        // change this to go to / welcome of our app
        return redirectWithParams(`${baseAppUrl}/welcome`);
    }

    // Gmail link redirects
    if (pathname === '/gmail-link-landing') {
        // Redirect to /welcome, preserving existing query parameters
        const newUrl = new URL(`${baseAppUrl}/welcome`);
        searchParams.forEach((value, key) => {
            newUrl.searchParams.append(key, value);
        });
        console.log(`Redirecting /gmail-link-landing to: ${newUrl.toString()}`);

        return NextResponse.redirect(newUrl);
    }

    if (pathname === '/gmail-link_b') {
        // Redirect to /welcome?step=1, preserving other query parameters
        const newUrl = new URL(`${baseAppUrl}/welcome`);
        newUrl.searchParams.append('step', '1');
        searchParams.forEach((value, key) => {
            if (key !== 'step') {
                newUrl.searchParams.append(key, value);
            }
        });
        console.log(`Redirecting /gmail-link_b to: ${newUrl.toString()}`);

        return NextResponse.redirect(newUrl);
    }

    if (pathname === '/auth/phone-register') {
        // Redirect to /welcome?step=2, preserving other query parameters
        const newUrl = new URL(`${baseAppUrl}/welcome`);
        newUrl.searchParams.append('step', '2');
        searchParams.forEach((value, key) => {
            if (key !== 'step') {
                newUrl.searchParams.append(key, value);
            }
        });
        console.log(`Redirecting /auth/phone-register to: ${newUrl.toString()}`);

        return NextResponse.redirect(newUrl);
    }

    if (pathname === '/gmail-link_b/success') {
        // Redirect to /welcome?step=3, preserving other query parameters
        const newUrl = new URL(`${baseAppUrl}/welcome`);
        newUrl.searchParams.append('step', '3');
        searchParams.forEach((value, key) => {
            if (key !== 'step') {
                newUrl.searchParams.append(key, value);
            }
        });
        console.log(`Redirecting /gmail-link_b/success to: ${newUrl.toString()}`);

        return NextResponse.redirect(newUrl);
    }

    if (pathname === '/gmail-link_b/failure') {
        // Check if it's actually a failure by calling our check API
        const stateId = searchParams.get('state_id');

        if (stateId) {
            try {
                const checkResponse = await fetch(
                    `${baseAppUrl}/api/gmail/check?state_id=${stateId}&baseUrl=${baseAppUrl}`,
                    {
                        method: 'GET',
                        headers: {
                            'X-API-KEY': process.env.PICKS_BACKEND_API_KEY!
                        }
                    }
                );

                const checkData = await checkResponse.json();
                console.log('Check data:', checkData);

                // If check returns a redirect (meaning Gmail linking was successful)
                if (checkData.redirect) {
                    console.log(`Gmail linking was actually successful, redirecting to: ${checkData.redirect}`);

                    return NextResponse.redirect(checkData.redirect);
                }

                console.log('[Middleware] Confirmed Gmail linking failure, proceeding with failure flow');
            } catch (error) {
                console.error('[Middleware] Error checking Gmail status, assuming failure:', error);
                // Continue with failure flow if check fails
            }
        }

        // Redirect to /welcome?step=1&failure=true, preserving other query parameters
        const newUrl = new URL(`${baseAppUrl}/welcome`);
        newUrl.searchParams.append('step', '1');
        newUrl.searchParams.append(LINK_FAILURE_PARAM, 'true');
        searchParams.forEach((value, key) => {
            if (key !== 'step' && key !== LINK_FAILURE_PARAM) {
                newUrl.searchParams.append(key, value);
            }
        });
        console.log(`Redirecting /gmail-link_b/failure to: ${newUrl.toString()}`);

        return NextResponse.redirect(newUrl);
    }

    if (pathname === '/gmail-link_b/permissions-failure') {
        // Redirect to /welcome?step=2&failure=true, preserving other query parameters
        const newUrl = new URL(`${baseAppUrl}/welcome`);
        newUrl.searchParams.append('step', '1');

        newUrl.searchParams.append(PERMISSIONS_FAILURE_PARAM, 'true');
        searchParams.forEach((value, key) => {
            if (key !== 'step' && key !== PERMISSIONS_FAILURE_PARAM) {
                newUrl.searchParams.append(key, value);
            }
        });
        console.log(`Redirecting /gmail-link_b/permissions-failure to: ${newUrl.toString()}`);

        return NextResponse.redirect(newUrl);
    }

    if (pathname === '/terms') {
        return redirectWithParams(`${FRAMER_LINKS.terms}`);
    }

    if (pathname === '/privacy') {
        return redirectWithParams(`${FRAMER_LINKS.privacy}`);
    }

    if (pathname === '/support') {
        return redirectWithParams(`${FRAMER_LINKS.support}`);
    }

    if (pathname === '/about') {
        return redirectWithParams(`${FRAMER_LINKS.about}`);
    }

    if (pathname === '/careers') {
        return redirectWithParams(`${FRAMER_LINKS.careers}`);
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
        '/gmail-link_b/success',

        // Failure paths
        '/gmail-link_b/failure',
        '/gmail-link_b/permissions-failure',

        '/terms',
        '/privacy',
        '/support',
        '/about',
        '/careers'
    ]
};
// http://localhost:3003/gmail-link_b/permissions-failure?state_id=state_id=5d252757-fe8d-48f6-a777-1fe6ec401256
// http://localhost:3003/gmail-link_b/failure?state_id=state_id=5d252757-fe8d-48f6-a777-1fe6ec401256
