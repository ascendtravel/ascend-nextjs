import Image from 'next/image';
import Link from 'next/link';

import PriceDropCards from './_components/PriceDropCards/PriceDropCards';
import AscendLogoAndHotelPrice from './_components/SvgAssets/AscendLogoAndHotelPrice';
import ExpediaLogoAndHotelPrice from './_components/SvgAssets/ExpediaLogoAndHotelPrice';

export default function GmailLinkLanding() {
    return (
        <div className='flex h-screen flex-col'>
            <div className='mb-8 flex flex-col items-center justify-center gap-4 px-4'>
                <div className='relative h-full w-full max-w-md'>
                    <div className='absolute inset-0 flex w-full flex-col items-center justify-end gap-4'>
                        <div className='relative flex w-[90%] items-center justify-center drop-shadow-lg'>
                            <AscendLogoAndHotelPrice />
                            <div className='absolute -top-1 right-1/12 rounded-full bg-[#1DC167] px-3 text-center text-xs font-bold text-white'>
                                30% discount
                            </div>
                        </div>
                        <div className='-mt-9 flex w-[60%] items-center justify-center'>
                            <ExpediaLogoAndHotelPrice />
                        </div>
                    </div>
                    <Image
                        src='/images/hotels-landing-card-bg.png'
                        alt='hotels-landing-card-bg'
                        width={200}
                        height={200}
                        className='h-full w-full object-cover'
                    />
                </div>

                <p className='font-figtree max-w-[336px] text-center text-[32px] leading-[33px] font-extrabold tracking-[-0.02em] text-white'>
                    Unlock access to backdoor hotel rates, up to 50% off.
                </p>
                <p className='font-figtree max-w-xs px-2 text-center text-[16px] leading-[20px] font-medium text-white'>
                    Hotels have exclusive rates for corporate travelers. Now, you can access them too.
                </p>
            </div>
            <Link href='/gmail-link_b'>
                <div className='flex flex-col items-center justify-center gap-2'>
                    <div className='text-md rounded-full bg-neutral-50 px-8 py-3 text-center font-semibold text-neutral-900 lg:px-16 lg:text-xl'>
                        Start Saving for free
                    </div>
                </div>
            </Link>
        </div>
    );
}
