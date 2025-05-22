'use client';

// Required for Lottie component and useEffect/useState if used for options
import Link from 'next/link';

import animationData from '@/../public/lotties/404-lottie.json';
// Import Lottie

import IconNewWhite from '@/components/Icon/IconNewWhite';

import Lottie from 'react-lottie';

// Adjust path as necessary

export default function NotFound() {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };

    return (
        <div className='relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-t from-[#5AA6DA] from-0% via-[#006DBC] via-[22.5%] to-[#006DBC] px-4 text-white md:py-24'>
            <Link href='/' className='absolute top-6 left-6 z-10 md:top-8 md:left-8'>
                <IconNewWhite className='size-12 text-white md:size-16' />
            </Link>

            <div className='flex w-full max-w-lg flex-col items-center text-center'>
                {/* Lottie Animation */}
                <div className='pointer-events-none w-full max-w-xs sm:max-w-sm md:max-w-md'>
                    <Lottie options={defaultOptions} height={'auto'} width={'100%'} />
                </div>

                <h1 className='font-figtree mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl'>
                    How did you get here?
                </h1>
                <p className='font-figtree mt-4 text-base font-medium text-white/80 md:text-lg'>
                    Looks like you're way off the map! Let's get you back on track.
                </p>

                <Link
                    href='/welcome'
                    className='font-figtree mt-10 rounded-full bg-white px-8 py-3 text-base font-bold text-[#006DBC] shadow-lg transition-all hover:scale-105 hover:bg-white/90 active:scale-95 md:mt-12 md:px-10 md:py-4 md:text-lg'>
                    Explore Ascend
                </Link>

                <div className='font-figtree mt-8 flex flex-col items-center gap-3 text-sm md:mt-10 md:flex-row md:gap-6'>
                    <Link
                        href='/auth/phone-login'
                        className='font-medium text-white/70 transition-colors hover:text-white hover:underline'>
                        Login to your account
                    </Link>
                    <span className='hidden text-white/50 md:block'>|</span>
                    <Link
                        href='/welcome'
                        className='font-medium text-white/70 transition-colors hover:text-white hover:underline'>
                        Need an account?
                    </Link>
                </div>
            </div>
        </div>
    );
}
