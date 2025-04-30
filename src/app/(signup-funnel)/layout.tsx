'use client';

import { Figtree } from 'next/font/google';
import localFont from 'next/font/local';

import { ThemeProvider } from 'next-themes';

import '@/app/globals.css';
import { Toaster } from '@/components/ui/sooner';
import { cn } from '@/lib/utils';

const geistSans = localFont({
    src: '../fonts/GeistVF.woff',
    variable: '--font-geist-sans',
    weight: '100 900'
});
const geistMono = localFont({
    src: '../fonts/GeistMonoVF.woff',
    variable: '--font-geist-mono',
    weight: '100 900'
});

const figtree = Figtree({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-figtree'
});

// This layout is in a route group which tells Next.js to use this layout
// instead of the root layout for all routes within the (signup-funnel) group
export default function SignupLayout({ children }: { children: React.ReactNode }) {
    return <div className='flex h-full min-h-screen flex-col'>{children}</div>;
}
