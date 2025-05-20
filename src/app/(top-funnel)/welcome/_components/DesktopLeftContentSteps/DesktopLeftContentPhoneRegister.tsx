import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

import OnboardingFooterWithLock from '@/app/(top-funnel)/welcome/_components/OnboardingFooterWithLock';
import OnboardingGmailCheckCta from '@/app/(top-funnel)/welcome/_components/OnboardingGmailCheckCta';
import OnboardingPhoneRegisterFlipCard from '@/app/(top-funnel)/welcome/_components/OnboardingPhoneRegisterFlipCard';
import { FRAMER_LINKS } from '@/config/navigation';

import { format } from 'date-fns';
import { motion } from 'framer-motion';

export default function DesktopLeftContentPhoneRegister({ onVerify }: { onVerify: () => void }) {
    const searchParams = useSearchParams();
    const state_id = searchParams.get('state_id');

    const contentVariants = {
        hidden: { x: '-50%', opacity: 0 },
        visible: {
            x: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 50,
                damping: 18,
                duration: 0.6
            }
        }
    };

    return (
        <div className='relative z-10 flex w-1/2 items-center justify-start rounded-r-2xl bg-gradient-to-b from-[#0B74C0] to-[#57A3D9] px-[2%] py-8 backdrop-blur-md'>
            <div className='flex h-full flex-col items-start justify-between gap-4'>
                <motion.div
                    className='flex flex-1 flex-col items-center justify-center gap-4'
                    variants={contentVariants}
                    initial='hidden'
                    animate='visible'>
                    <div className='flex flex-col items-start justify-center gap-4 py-4 pt-6 sm:pt-24'>
                        <p className='font-figtree max-w-md text-[36px] leading-[40px] font-extrabold tracking-[-0.02em] text-white'>
                            We'll text you when prices drop on your trips
                        </p>
                        <p className='font-figtree mb-4 text-[20px] leading-[30px] font-medium text-white'>
                            Prices are time-sensitive, so we'll text you as soon as we see an opportunity.
                        </p>
                    </div>

                    <div className='flex w-full items-center justify-start'>
                        <OnboardingPhoneRegisterFlipCard state_id={state_id ?? ''} onVerify={onVerify} />
                    </div>
                </motion.div>
                <div className='flex w-full flex-wrap items-center justify-center text-white/60 transition-colors'>
                    <div className='flex flex-row items-center justify-center gap-2'>
                        <a
                            href={FRAMER_LINKS.privacy}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='font-figtree text-base transition-colors hover:text-white'>
                            Privacy Policy
                        </a>
                        <span className='font-figtree ml-2 pb-2 text-base'>.</span>
                        <a
                            href={FRAMER_LINKS.terms}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='font-figtree text-base transition-colors hover:text-white'>
                            Terms of Service
                        </a>
                    </div>
                    <div className='flex flex-row items-center justify-center gap-2'>
                        <span className='font-figtree base pb-2 font-bold'>.</span>
                        <p className='font-figtree text-sm'>
                            Copyright {format(new Date(), 'yyyy')} © Ascend. All Rights Reserved.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
