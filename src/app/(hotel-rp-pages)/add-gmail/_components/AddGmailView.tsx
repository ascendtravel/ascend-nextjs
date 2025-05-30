'use client';

import { Suspense, useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { FRAMER_LINKS } from '@/config/navigation';
import { useUser } from '@/contexts/UserContext';
import { identifyUserByStateId } from '@/lib/analytics';
import { urls } from '@/lib/urls';

import AddGmailCheckboxCTA from './AddGmailCheckboxCTA';
import Cookies from 'js-cookie';
import { Lock } from 'lucide-react';

function AddGmailView() {
    const [stateId, setStateId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const searchParams = useSearchParams();
    const { user } = useUser();

    useEffect(() => {
        async function getStateId() {
            try {
                const response = await fetch('/api/gmail/state', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        customer_id: user?.id
                    })
                });

                if (!response.ok) throw new Error('Failed to get state ID');
                const data = await response.json();
                // IDENTIFY USER BY STATE ID
                identifyUserByStateId(data.state_id);
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
        <div className='flex h-full w-full flex-col overflow-y-auto'>
            <div className='mb-4 flex flex-col items-center justify-center gap-4 px-2'>
                <p className='font-figtree max-w-md px-6 text-center text-[24px] leading-[28px] font-extrabold tracking-[-0.02em] text-white'>
                    Connect your Gmail to import your reservations
                </p>
                <p className='font-figtree max-w-xs px-2 text-center text-[14px] leading-[20px] font-medium text-white'>
                    Remember to check the first checkbox when connecting your account:
                </p>
            </div>

            <Link href={stateId ? urls.gmailLinkStartUrl(stateId) : ''}>
                <div className='mb-12 flex flex-col items-center justify-center gap-4 overflow-clip rounded-3xl'>
                    <div
                        onClick={() => (window.location.href = urls.gmailLinkStartUrl(stateId || ''))}
                        className='cursor-pointer'>
                        <AddGmailCheckboxCTA width={260} height={120} showText={false} />
                    </div>
                </div>
            </Link>

            <div className='flex flex-1 flex-col items-center'>
                {stateId ? (
                    <Link
                        href={urls.gmailLinkStartUrl(stateId)}
                        className='font-figtree animate-shake animate-fade-in mt-2 flex origin-center items-center gap-2 rounded-full bg-white px-6 py-4 font-semibold text-neutral-900 transition-all hover:bg-white/90'>
                        <Image
                            src='/images/google-icon.png'
                            alt='Gmail icon'
                            width={24}
                            height={24}
                            className='size-6'
                        />
                        Connect your Gmail
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
            <AddGmailView />
        </Suspense>
    );
}
