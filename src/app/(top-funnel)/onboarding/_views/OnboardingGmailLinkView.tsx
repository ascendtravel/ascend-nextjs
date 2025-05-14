import Image from 'next/image';
import Link from 'next/link';

import OnboardingFooterWithLock from '../_components/OnboardingFooterWithLock';
import OnboardingGmailCheckCta from '../_components/OnboardingGmailCheckCta';

export default function OnboardingGmailLinkView({ stateId }: { stateId: string }) {
    return (
        <div className='flex h-full w-full flex-col items-center justify-start pt-18'>
            <div className='mb-4 flex flex-col items-center justify-center gap-4 px-2'>
                <p className='font-figtree max-w-md px-6 text-center text-[24px] leading-[28px] font-extrabold tracking-[-0.02em] text-white'>
                    Use Gmail to automatically import your reservations
                </p>
                <p className='font-figtree max-w-xs px-2 text-center text-[14px] leading-[20px] font-medium text-white'>
                    We'll only import your existing and upcoming travel reservations
                </p>
            </div>

            <OnboardingGmailCheckCta />

            <Link href={`https://gmail.heyascend.com/gmail/import/start/${stateId}`}>
                <div className='font-figtree mt-8 flex items-center gap-2 rounded-full bg-white px-6 py-4 font-semibold text-neutral-900 transition-all hover:bg-white/90'>
                    <Image src='/images/google-icon.png' alt='Gmail icon' width={24} height={24} className='size-6' />
                    Continue with Google
                </div>
            </Link>
            <OnboardingFooterWithLock />
        </div>
    );
}
