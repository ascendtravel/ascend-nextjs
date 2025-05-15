import Image from 'next/image';
import Link from 'next/link';

import IconNewWhite from '@/components/Icon/IconNewWhite';
import { YcombBanner } from '@/components/YcombBanner/YcombBanner';
import { FRAMER_LINKS } from '@/config/navigation';

import { format } from 'date-fns';

export default function OnboardingLandingView() {
    return (
        <div className='flex flex-col items-center justify-center'>
            <div className='flex w-full flex-col items-center justify-center bg-[#00345A]'>
                <YcombBanner />
            </div>
            <IconNewWhite className='size-24' />
            <div className='relative h-[170px] w-[90%] max-w-lg sm:h-[200px]'>
                <Image
                    src='/onboarding-assets/landing-saving-notifications.png'
                    alt='Ascend Logo'
                    className='object-contain'
                    fill
                    priority
                    quality={100}
                />
            </div>
            <div className='mx-6 mt-8 mb-4 flex flex-col items-center justify-center gap-6 px-2 sm:mt-12'>
                <p className='font-figtree max-w-md px-6 text-center text-[36px] leading-[28px] font-extrabold tracking-[-0.02em] text-white'>
                    Smart travelers don't overpay
                </p>
                <p className='font-figtree max-w-xs px-2 text-center text-[16px] leading-[20px] font-medium text-white'>
                    Ascend watches your bookings and gets you money back when <b>Big Travel</b> drops prices.
                </p>
            </div>
            <Link href='/onboarding'>
                <div className='mt-2 gap-6 rounded-full bg-white px-8 py-4 text-center text-lg font-bold text-neutral-700 shadow-md'>
                    Import my travel bookings
                </div>
            </Link>

            <div className='fixed bottom-12 flex w-full max-w-6xl flex-col items-center px-6 text-center md:flex-col md:justify-between'>
                <div className='flex items-center justify-center gap-2'>
                    <a
                        href={FRAMER_LINKS.privacy}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='font-figtree text-sm text-neutral-900/60 transition-colors hover:text-neutral-900'>
                        Privacy Policy
                    </a>
                    <span className='font-figtree text-sm text-neutral-900/60'>&</span>
                    <a
                        href={FRAMER_LINKS.terms}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='font-figtree text-sm text-neutral-900/60 transition-colors hover:text-neutral-900'>
                        Terms of Service
                    </a>
                </div>
                <p className='font-figtree text-sm text-neutral-900/60'>
                    Copyright {format(new Date(), 'yyyy')} © Ascend. All Rights Reserved.
                </p>
            </div>
        </div>
    );
}
