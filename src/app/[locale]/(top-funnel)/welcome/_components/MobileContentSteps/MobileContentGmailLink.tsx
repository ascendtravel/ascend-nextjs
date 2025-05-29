import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { LINK_FAILURE_PARAM, OnboardingSteps, PERMISSIONS_FAILURE_PARAM, mapNumberToStep } from '../../_types';
import OnboardingFooterWithLock from '../OnboardingFooterWithLock';
import OnboardingGmailCheckCta from '../OnboardingGmailCheckCta';

export default function MobileContentGmailLink() {
    const searchParams = useSearchParams();
    const state_id = searchParams.get('state_id');

    const isLinkFailure = searchParams.get(LINK_FAILURE_PARAM) === 'true';
    const isPermissionsFailure = searchParams.get(PERMISSIONS_FAILURE_PARAM) === 'true';

    let headerKey: OnboardingSteps.Step1 | typeof LINK_FAILURE_PARAM | typeof PERMISSIONS_FAILURE_PARAM =
        OnboardingSteps.Step1;
    if (isLinkFailure) {
        headerKey = LINK_FAILURE_PARAM;
    } else if (isPermissionsFailure) {
        headerKey = PERMISSIONS_FAILURE_PARAM;
    }

    const HeadersContent = {
        [OnboardingSteps.Step1]: {
            title: 'Use Gmail to automatically import your reservations',
            description: "We'll only import your existing and upcoming travel reservations"
        },
        [LINK_FAILURE_PARAM]: {
            title: 'Looks like something went wrong!',
            description: 'Sometimes the connection attempt fails, but worry not! Just click below to try again:'
        },
        [PERMISSIONS_FAILURE_PARAM]: {
            title: 'We need additional permissions to continue!',
            description:
                'It looks like you need a few additional boxes fo us to import your bookings. Just click below to try again:'
        }
    };

    return (
        <div className='flex h-screen w-full flex-col items-center justify-start bg-gradient-to-t from-[#5AA6DA] from-0% via-[#006DBC] via-[22.5%] to-[#006DBC] pt-[20vh] sm:pt-36'>
            <div className='mb-4 flex flex-col items-center justify-center gap-4 px-2'>
                <p className='font-figtree max-w-[300px] text-center text-[24px] leading-[28px] font-extrabold tracking-[-0.02em] text-white'>
                    {HeadersContent[headerKey].title}
                </p>
                <p className='font-figtree max-w-xs px-2 text-center text-[14px] leading-[20px] font-medium text-white'>
                    {HeadersContent[headerKey].description}
                </p>
            </div>

            <OnboardingGmailCheckCta />

            <OnboardingFooterWithLock />
        </div>
    );
}
