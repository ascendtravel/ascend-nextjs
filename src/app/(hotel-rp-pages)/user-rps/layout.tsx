'use client';

import IconNewWhite from '@/components/Icon/IconNewWhite';
import UserDetailsMenu from '@/components/UserDetailsMenu';
import { useUser } from '@/contexts/UserContext';

export default function UserRpsLayout({ children }: { children: React.ReactNode }) {
    const { isLoading } = useUser();

    if (isLoading) {
        return (
            <div>
                <div className='flex h-screen w-full items-center justify-center'>
                    <div className='flex flex-col items-center justify-center gap-4'>
                        <div className='flex flex-row items-center justify-center gap-2 text-neutral-900 dark:text-neutral-50'>
                            <IconNewWhite />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='relative min-h-screen overflow-y-scroll'>
            {/* Fixed header with backdrop blur */}
            <header className='fixed top-0 right-0 left-0 z-50 bg-[#006DBC]/80 backdrop-blur-sm'>
                <div className='flex w-full flex-row items-center justify-between px-6 py-4'>
                    <div className='flex max-w-[90px] flex-row items-center justify-center'>
                        <IconNewWhite />
                    </div>
                    <UserDetailsMenu />
                </div>
            </header>

            {/* Main content with padding for header */}
            <main className='absolute inset-0 flex flex-col items-center justify-center overflow-scroll pt-[72px]'>
                {children}
            </main>
        </div>
    );
}
