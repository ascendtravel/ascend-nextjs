'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import BackGreenButton from '@/components/BackGreenButton';
import UserAvatar from '@/components/UserAvatar';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';
import Intercom from '@intercom/messenger-js-sdk';

import { CopyIcon, Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function AddTripsView() {
    const { user, reloadUser } = useUser();
    const [isAccountsExpanded, setIsAccountsExpanded] = useState(true);
    const router = useRouter();

    Intercom({
        app_id: process.env.NEXT_PUBLIC_INTERCOM_APP_ID ?? '',
        user_id: user?.id ?? '',
        name: user?.first_name ?? 'Traveler',
        ...(user?.main_email && { email: user?.main_email })
    });

    useEffect(() => {
        reloadUser();
    }, []);

    return (
        <div className='mt-2 h-full w-full rounded-t-xl bg-neutral-50 transition-all duration-300'>
            <div className='flex flex-row items-center justify-between pt-4 pl-4'>
                <BackGreenButton />
            </div>

            {/* Current User Card - Restoring the original implementation */}
            <div className='m-4 flex flex-row items-center justify-between gap-2 rounded-lg border border-neutral-300 p-8 py-6'>
                <UserAvatar variant='lg' className='rounded-full border border-neutral-300' />
                <div className='flex flex-col'>
                    <div className='text-md font-medium'>Hello {user?.first_name}</div>
                    <p className='text-md text-neutral-800'>{user?.main_email}</p>
                </div>
                <div className='flex flex-row items-center gap-2'></div>
            </div>

            {/* Missing a trip section */}
            <h2 className='w-full px-4 text-center text-lg font-semibold text-neutral-800'>Missing a trip?</h2>
            <div className='mx-4 mb-4 p-4'>
                <p className='mt-2 text-sm text-neutral-600'>
                    We import your bookings automatically from any connected accounts. You can also forward bookings
                    manually to the email address at the bottom of this page.
                </p>
            </div>

            {/* Accounts Accordion - Now expanded by default */}
            <div className='mx-4 mb-4 overflow-hidden rounded-lg border border-neutral-300'>
                <Accordion type='single' collapsible defaultValue='accounts' className='w-full'>
                    <AccordionItem value='accounts' className='border-none'>
                        <AccordionTrigger
                            className='px-4 py-3 text-sm font-medium'
                            onClick={() => setIsAccountsExpanded(!isAccountsExpanded)}>
                            {isAccountsExpanded ? (
                                'Hide accounts'
                            ) : (
                                <div className='flex w-full flex-row items-center justify-between gap-2'>
                                    <span>Show accounts</span>
                                    <div className='flex flex-row items-center justify-between gap-2'>
                                        {user?.emails?.map((account) => (
                                            <div key={account} className='flex flex-row items-center gap-2'>
                                                <Avatar className='size-6 border border-neutral-300'>
                                                    <AvatarFallback className='size-6 uppercase'>
                                                        {account.split('@')[0].charAt(0)}
                                                    </AvatarFallback>
                                                </Avatar>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </AccordionTrigger>
                        <AccordionContent className='px-0'>
                            <div className='mt-4 flex flex-col'>
                                {user?.emails?.map((account) => (
                                    <div
                                        key={account}
                                        className='flex flex-row items-center justify-between border-t border-neutral-200 px-4 py-3'>
                                        <div className='flex flex-row items-center gap-3'>
                                            <UserAvatar variant='xs' />
                                            <div className='flex flex-col'>
                                                <span className='text-sm font-medium'>{account}</span>
                                            </div>
                                        </div>
                                        {/* <Button variant='outline' className='px-2 !py-1' onClick={() => signOut()}>
                                            Sign Out
                                        </Button> */}
                                    </div>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>

            {/* Add Account Button */}
            <div className='mx-4 mb-4 overflow-hidden rounded-lg border border-neutral-300'>
                <div className='flex flex-row items-center p-2'>
                    <Button
                        variant='ghost'
                        className='flex items-center gap-4'
                        onClick={() => {
                            router.push('/add-gmail');
                        }}>
                        <div className='flex size-10 items-center justify-center rounded-full bg-neutral-300'>
                            <Plus className='size-4 text-neutral-50' />
                        </div>
                        <span className='text-base font-medium'>Add Account</span>
                    </Button>
                </div>
            </div>

            {/* Manual Forwarding Section */}
            <div
                className='relative z-20 mx-4 overflow-hidden rounded-lg border border-neutral-300 bg-neutral-50'
                onClick={() => {
                    navigator.clipboard.writeText(user?.main_phone + '@reprice.ascend.travel');
                    toast.success('Copied to clipboard');
                }}>
                <div className='p-4 text-center'>
                    <h3 className='text-base font-medium'>To add trips manually, forward them to:</h3>
                    <div className='mt-2 flex flex-row items-center justify-between gap-2 rounded-md bg-neutral-100 p-3 shadow-sm'>
                        <code className='block text-center font-mono text-xs break-all select-all'>
                            {user?.main_phone}@reprice.ascend.travel
                        </code>
                        <CopyIcon className='size-4 text-neutral-500' />
                    </div>
                </div>
            </div>

            <div className='relative z-10 -mt-28 h-56 rounded-lg border-neutral-300 bg-neutral-50' />
        </div>
    );
}
