import { FRAMER_LINKS } from '@/config/navigation';

import { Lock } from 'lucide-react';

export default function OnboardingFooterWithLock({
    stringContentOverride
}: {
    stringContentOverride?: string | React.ReactNode;
}) {
    return (
        <div className='mt-3 flex max-w-[260px] flex-row items-center justify-center gap-2 font-semibold'>
            <Lock className='size-6 text-white/70' />
            <div className='font-figtree max-w-sm text-left text-xs font-light text-white/90'>
                {!stringContentOverride && (
                    <>
                        <p>
                            We only receive your travel reservations, and store data according to our{' '}
                            <a
                                href={FRAMER_LINKS.privacy}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='font-figtree text-sm text-white/90 underline transition-colors hover:text-white'>
                                Privacy Policy
                            </a>
                        </p>
                    </>
                )}
                {stringContentOverride ? stringContentOverride : null}
            </div>
        </div>
    );
}
