'use client';

import { Suspense, useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { FRAMER_LINKS } from '@/config/navigation';

import { CheckboxNotice } from '../../gmail-link/_components/CheckboxNotice';
import Cookies from 'js-cookie';
import { Lock } from 'lucide-react';

function GmailLinkB() {
    const [stateId, setStateId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const searchParams = useSearchParams();
    const getUtmParams = () => {
        const utmParams = new URLSearchParams();
        const utmParamsObject: { [key: string]: string } = {};

        searchParams.forEach((value, key) => {
            if (key.startsWith('utm_')) {
                utmParams.append(key, value);
            }
        });

        const utmParamsString = utmParams.toString();
        const utmParamsArray = utmParamsString.split('&');

        utmParamsArray.forEach((param) => {
            const [key, value] = param.split('=');
            utmParamsObject[key] = value;
        });
        console.log(utmParamsObject);

        return utmParamsObject;
    };

    useEffect(() => {
        async function getStateId() {
            try {
                const fbp = Cookies.get('_fbp');
                const fbc = Cookies.get('_fbc');

                const utmParams = getUtmParams();
                const response = await fetch('/api/gmail/state', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...(fbp ? { fbp } : {}),
                        ...(fbc ? { fbc } : {}),
                        ...(utmParams ? { utm_params: utmParams } : {})
                    })
                });

                if (!response.ok) throw new Error('Failed to get state ID');
                const data = await response.json();
                setStateId(data.state_id);
            } catch (err) {
                setError('Failed to initialize. Please try again.');
            } finally {
                setIsLoading(false);
            }
        }

        getStateId();
    }, [searchParams]);

    return (
        <div className='flex h-screen flex-col'>
            <div className='flex flex-col items-center justify-center gap-4 px-2'>
                <p className='font-figtree max-w-md px-6 text-center text-[32px] leading-[28px] font-extrabold tracking-[-0.02em] text-white'>
                    Here's how it works:
                </p>
            </div>

            <div className='my-12 flex flex-col items-center justify-center gap-8 px-2'>
                <div className='flex max-w-sm flex-row items-center justify-center gap-8 rounded-3xl bg-neutral-50/10 p-6'>
                    <p className='font-figtree text-4xl font-bold text-white'>1</p>
                    <p className='font-figtree text-xl font-semibold text-white'>
                        Create a free Ascend account to get access to our price drop alerts on your existing
                        reservations, access to backdoor hotel discounts, and more.
                    </p>
                </div>

                <div className='flex max-w-sm flex-row items-center justify-center gap-8 rounded-3xl bg-neutral-50/10 p-6'>
                    <p className='font-figtree text-4xl font-bold text-white'>2</p>
                    <p className='font-figtree text-xl font-semibold text-white'>
                        Text us your destination and travel dates on WhatsApp, and our AI Travel Concierge will find you
                        discounts up to 40% off.
                    </p>
                </div>
            </div>

            <div className='flex flex-1 flex-col items-center'>
                {stateId ? (
                    <Link
                        href={`https://gmail.heyascend.com/gmail/import/start/${stateId} `}
                        className='font-figtree animate-shake animate-fade-in mt-2 flex origin-center items-center gap-2 rounded-full bg-white px-6 py-4 font-semibold text-neutral-900 transition-all hover:bg-white/90'>
                        <Image
                            src='/images/google-icon.png'
                            alt='Gmail icon'
                            width={24}
                            height={24}
                            className='size-6'
                        />
                        Continue with Gmail
                    </Link>
                ) : isLoading ? (
                    <div className='font-figtree mt-8 rounded-full bg-white/80 px-6 py-4 font-semibold text-neutral-900'>
                        Loading...
                    </div>
                ) : (
                    <div className='mt-8 text-center text-red-500'>
                        {error}
                        <button className='mt-2 underline' onClick={() => setStateId(null)}>
                            Try again
                        </button>
                    </div>
                )}

                <div className='mt-3 flex max-w-[260px] flex-row items-center justify-center gap-2'>
                    <Lock className='size-6 text-white/90' />
                    <div className='font-figtree max-w-sm text-left text-xs font-light text-white/90'>
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
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <GmailLinkB />
        </Suspense>
    );
}
