'use client';

import IconNewWhite from '@/components/Icon/IconNewWhite';
import RpHeaderNav from '@/components/RpHeaderNav';
import { useUser } from '@/contexts/UserContext';

export default function RpSuccessLayout({ children }: { children: React.ReactNode }) {
    const { isLoading, user } = useUser();

    if (isLoading) {
        return (
            <div className='flex h-full flex-col'>
                <div className='flex h-full w-full items-center justify-center'>
                    <div className='flex flex-col items-center justify-center gap-4'>
                        <div className='flex flex-row items-center justify-center gap-2'>
                            <IconNewWhite />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='flex h-full flex-col items-center justify-center'>
            {/* Use the new header component */}
            <RpHeaderNav />

            {/* Scrollable content area */}
            <div
                id='rp-main-content'
                className='flex w-full max-w-lg flex-1 flex-col items-center justify-center overflow-y-auto overscroll-none'
                style={{
                    paddingTop: 'var(--rp-header-height)',
                    WebkitOverflowScrolling: 'touch'
                }}>
                {children}
            </div>
        </div>
    );
}
