'use client';

import IconNewWhite from '@/components/Icon/IconNewWhite';
import UserDetailsMenu from '@/components/UserDetailsMenu';
import { useUser } from '@/contexts/UserContext';

export default function UserRpsLayout({ children }: { children: React.ReactNode }) {
    const { isLoading, user } = useUser();

    if (isLoading || !user) {
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
        <div className='flex h-full flex-col'>
            {/* Fixed header with backdrop blur */}
            <header className='fixed top-0 right-0 left-0 z-50 bg-[#006DBC]/80 backdrop-blur-sm'>
                <div className='flex w-full flex-row items-center justify-between px-6 py-4'>
                    <div className='flex max-w-[90px] flex-row items-center justify-center'>
                        <IconNewWhite />
                    </div>
                    <UserDetailsMenu />
                </div>
            </header>

            {/* Scrollable content area */}
            <div
                id='rp-main-content'
                className='flex-1 overflow-y-auto overscroll-none'
                style={{
                    paddingTop: '72px',
                    WebkitOverflowScrolling: 'touch'
                }}>
                {children}
            </div>
        </div>
    );
}
