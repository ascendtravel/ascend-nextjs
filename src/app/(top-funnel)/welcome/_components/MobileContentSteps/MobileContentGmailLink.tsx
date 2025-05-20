import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import OnboardingFooterWithLock from '../OnboardingFooterWithLock';
import OnboardingGmailCheckCta from '../OnboardingGmailCheckCta';

export default function MobileContentGmailLink() {
    const searchParams = useSearchParams();
    const state_id = searchParams.get('state_id');

    return (
        <div className='flex h-screen w-full flex-col items-center justify-start bg-gradient-to-t from-[#5AA6DA] from-0% via-[#006DBC] via-[22.5%] to-[#006DBC] pt-32 sm:pt-36'>
            <div className='mb-4 flex flex-col items-center justify-center gap-4 px-2'>
                <p className='font-figtree max-w-md px-6 text-center text-[24px] leading-[28px] font-extrabold tracking-[-0.02em] text-white'>
                    Use Gmail to automatically import your reservations
                </p>
                <p className='font-figtree max-w-xs px-2 text-center text-[14px] leading-[20px] font-medium text-white'>
                    We'll only import your existing and upcoming travel reservations
                </p>
            </div>

            <OnboardingGmailCheckCta />

            <OnboardingFooterWithLock />
        </div>
    );
}
