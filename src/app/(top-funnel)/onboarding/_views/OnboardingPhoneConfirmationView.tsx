import { useSearchParams } from 'next/navigation';

import OnboardingFooterWithLock from '../_components/OnboardingFooterWithLock';
import OnboardingHeader from '../_components/OnboardingHeader';
import OnboardingPhoneRegisterFlipCard from '../_components/OnboardingPhoneRegisterFlipCard';
import { OnboardingSteps } from '../_types';

export default function OnboardingPhoneConfirmationView({ onVerify }: { onVerify: () => void }) {
    const searchParams = useSearchParams();
    const state_id = searchParams.get('state_id');

    return (
        <div className='flex h-full w-full flex-col items-center justify-start pt-18'>
            <div className='mb-4 flex flex-col items-center justify-center gap-4 px-2'>
                <p className='font-figtree max-w-md px-6 text-center text-[24px] leading-[28px] font-extrabold tracking-[-0.02em] text-white'>
                    We'll text you when prices drop on your trips
                </p>
                <p className='font-figtree max-w-xs px-2 text-center text-[14px] leading-[20px] font-medium text-white'>
                    Prices are time-sensitive, so we'll text you as soon as we see an opportunity.
                </p>
            </div>

            <div className='flex w-full items-center justify-center px-6'>
                <OnboardingPhoneRegisterFlipCard state_id={state_id ?? ''} onVerify={onVerify} />
            </div>

            <OnboardingFooterWithLock
                stringContentOverride={
                    <p>
                        We only use your number for authentication purposes and to only strictly-necessary account
                        messages.{' '}
                    </p>
                }
            />
        </div>
    );
}
