import type { ReactNode } from 'react';

import type { Metadata } from 'next';
import { Figtree } from 'next/font/google';
import localFont from 'next/font/local';

import { ThemeProvider } from 'next-themes';

import '@/app/globals.css';
import { CookiesBanner } from '@/components/CookiesBanner';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import NavigationBar from '@/components/NavigationBar';
import { Analytics } from '@/components/analytics/analytics';
import { Toaster } from '@/components/ui/sooner';
import { cn } from '@/lib/utils';

const geistSans = localFont({
    src: './fonts/GeistVF.woff',
    variable: '--font-geist-sans',
    weight: '100 900'
});
const geistMono = localFont({
    src: './fonts/GeistMonoVF.woff',
    variable: '--font-geist-mono',
    weight: '100 900'
});

const figtree = Figtree({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-figtree'
});

export const metadata: Metadata = {
    title: 'Ascend Travel | The travel agent that pays you back',
    description: 'Save money on your trips with Ascend',
    applicationName: 'Ascend Travel',
    appleWebApp: {
        title: 'Ascend Travel',
        capable: true,
        statusBarStyle: 'default'
    }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html
            lang='en'
            className={cn(
                geistSans.variable,
                geistMono.variable,
                figtree.variable,
                'bg-background text-foreground overscroll-none antialiased'
            )}
            suppressHydrationWarning>
            <head>
                {/* Standard icons */}
                <link rel='icon' type='image/svg+xml' href='/favicon.svg' />
                <link rel='shortcut icon' href='/favicon.ico' />
                <link rel='icon' type='image/png' href='/favicon-96x96.png' sizes='96x96' />

                {/* Light mode favicons */}
                <link
                    rel='icon'
                    type='image/png'
                    sizes='32x32'
                    href='/favicon-32x32.png'
                    media='(prefers-color-scheme: light)'
                />
                <link
                    rel='icon'
                    type='image/png'
                    sizes='16x16'
                    href='/favicon-16x16.png'
                    media='(prefers-color-scheme: light)'
                />

                {/* Dark mode favicons */}
                <link
                    rel='icon'
                    type='image/png'
                    sizes='32x32'
                    href='/favicon-32x32-dark-mode.png'
                    media='(prefers-color-scheme: dark)'
                />
                <link
                    rel='icon'
                    type='image/png'
                    sizes='16x16'
                    href='/favicon-16x16-dark-mode.png'
                    media='(prefers-color-scheme: dark)'
                />

                {/* Apple specific */}
                <link rel='apple-touch-icon' sizes='180x180' href='/apple-touch-icon.png' />
                <meta name='apple-mobile-web-app-title' content='Ascend Travel' />

                {/* Microsoft specific */}
                <meta name='msapplication-config' content='/browserconfig.xml' />
                <meta name='msapplication-TileColor' content='#da532c' />
                <link rel='mask-icon' href='/safari-pinned-tab.svg' color='#da532c' />

                {/* PWA manifest */}
                <link rel='manifest' href='/site.webmanifest' />

                {/* Preload critical images */}
                <link
                    rel='preload'
                    href='/images/clouds-bg.webp'
                    as='image'
                    type='image/webp'
                    fetchPriority='high'
                    imageSizes='(max-width: 768px) 100vw, 1920px'
                />
                {/* Fallback preload for browsers without WebP support */}
                <link
                    rel='preload'
                    href='/images/clouds-bg.png'
                    as='image'
                    type='image/png'
                    fetchPriority='high'
                    imageSizes='(max-width: 768px) 100vw, 1920px'
                />
            </head>
            <body>
                <ThemeProvider attribute='class' defaultTheme='light' enableSystem={false} disableTransitionOnChange>
                    <NavigationBar />
                    {children}
                    <Toaster />
                    <Analytics />
                    <CookiesBanner />
                </ThemeProvider>
            </body>
        </html>
    );
}
