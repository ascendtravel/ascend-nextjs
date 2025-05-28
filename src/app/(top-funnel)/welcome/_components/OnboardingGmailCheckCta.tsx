import Image from 'next/image';

export default function OnboardingGmailCheckCta() {
    return (
        <div className='flex h-[200px] w-full items-center justify-center px-2'>
            <div className='relative flex h-full w-full items-center justify-center'>
                <div className='absolute inset-0 flex w-full items-center justify-center px-3'>
                    {/* Optimize for iphone  */}
                    <Image
                        src='/onboarding-assets/gmail-check-user-cta.png'
                        alt='Gmail Check CTA'
                        className='object-contain'
                        fill
                        priority
                        quality={100}
                        sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                    />
                </div>
            </div>
        </div>
    );
}
