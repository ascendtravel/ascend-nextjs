'use client';

import { useEffect } from 'react';

import Script from 'next/script';

import { useUser } from '@/contexts/UserContext';
import { Analytics as VercelAnalytics } from '@vercel/analytics/react';

import { MetaPixel } from './MetaPixel';

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

export function Analytics() {
    return (
        <>
            <VercelAnalytics />
            <LuckyOrange />
            <MetaPixel />
        </>
    );
}

// Add TypeScript interface for the window object to handle LOQ
declare global {
    interface Window {
        LOQ: any[];
    }
}
