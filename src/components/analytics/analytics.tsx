'use client';

import { useEffect } from 'react';

import Script from 'next/script';

import { useUser } from '@/contexts/UserContext';
import { Analytics as VercelAnalytics } from '@vercel/analytics/react';

import { MetaPixel } from './MetaPixel';

// Helper function to ensure global access to Lucky Orange tracking
// This will be called from our utility function
export function trackLuckyOrangeGlobalEvent(eventName: string, metadata?: Record<string, any>): void {
    if (typeof window === 'undefined') return;

    window.LOQ = window.LOQ || [];
    window.LOQ.push([
        'ready',
        async (LO: any) => {
            try {
                await LO.$internal.ready('events');
                LO.events.track(eventName, metadata);
                if (process.env.NODE_ENV === 'development') {
                    console.log(`[LuckyOrange] Tracked global event: ${eventName}`, metadata);
                }
            } catch (err) {
                console.error(`[LuckyOrange] Error tracking global event "${eventName}":`, err);
            }
        }
    ]);
}

function LuckyOrange() {
    const { user, isImpersonating } = useUser();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Initialize LOQ for Lucky Orange
            window.LOQ = window.LOQ || [];

            // Only identify the user if they're logged in and NOT being impersonated
            if (user && user.id && !isImpersonating()) {
                window.LOQ.push([
                    'ready',
                    async (LO: any) => {
                        // Ensure visitor module is ready
                        await LO.$internal.ready('visitor');

                        // Identify the user to Lucky Orange
                        LO.visitor.identify(user.id, {
                            email: user.main_email || '',
                            name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || undefined,
                            customer_id: user.id
                        });

                        console.log('[LuckyOrange] User identified', user.id);
                    }
                ]);
            }
        }
    }, [user, isImpersonating]);

    return (
        <Script
            id='lucky-orange'
            strategy='afterInteractive'
            src='https://tools.luckyorange.com/core/lo.js?site-id=ddfef143'
            async
            defer
        />
    );
}

function GoogleTagManager() {
    // const GTM_ID = 'G-FJKMT8Y8ND'; // Consider moving this to an environment variable
    const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

    if (!GTM_ID) {
        console.error('No GTM ID found');

        return null;
    }

    return (
        <>
            <Script
                id='google-tag-manager-src'
                strategy='afterInteractive'
                src={`https://www.googletagmanager.com/gtag/js?id=${GTM_ID}`}
                async
            />
            <Script
                id='google-tag-manager-init'
                strategy='afterInteractive'
                dangerouslySetInnerHTML={{
                    __html: `
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', '${GTM_ID}');
                    `
                }}
            />
        </>
    );
}

export function Analytics() {
    return (
        <>
            <VercelAnalytics />
            <LuckyOrange />
            <MetaPixel />
            <GoogleTagManager />
        </>
    );
}

// Add TypeScript interface for the window object to handle LOQ
declare global {
    interface Window {
        LOQ: any[];
        dataLayer: any[];
        gtag: (...args: any[]) => void;
    }
}
