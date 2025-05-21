'use client';

// Keep this if StickyScrollList or its context uses client features
import React from 'react';

import Link from 'next/link';

// For footer

import FeedCard, { FeedCardData } from '@/components/FeedCard/FeedCard';
import IconNewWhite from '@/components/Icon/IconNewWhite';
import { StickyScrollList } from '@/components/StickyScrollList';
import {
    ListItem as ContextListItem,
    StickyScrollListProvider
} from '@/components/StickyScrollList/StickyScrollListContext';
import type {
    // ListItem as BaseStickyListItem, // Keep if BaseStickyListItem is distinct and used elsewhere
    StickyCardRenderProps
} from '@/components/StickyScrollList/StickyScrollListTypes';
import { YcombBanner } from '@/components/YcombBanner/YcombBanner';

// import { FRAMER_LINKS } from '@/config/navigation';

import { OnboardingSteps } from '../../_types';

// Adjusted path for ../../_types
// import { format } from 'date-fns';

const now = new Date();
const feedCardExampleData: FeedCardData[] = [
    {
        id: 'feed-1',
        userName: 'Josh B.',
        creationDateTime: new Date(now.getTime() - 2 * 60 * 1000),
        destination: 'Phoenix',
        type: 'hotel',
        amount: 283,
        currency: '$'
    },
    {
        id: 'feed-2',
        userName: 'Sarah K.',
        creationDateTime: new Date(now.getTime() - 30 * 60 * 1000),
        destination: 'London',
        type: 'flight',
        amount: 112,
        currency: '$'
    },
    {
        id: 'feed-3',
        userName: 'Mike P.',
        creationDateTime: new Date(now.getTime() - 60 * 60 * 1000),
        destination: 'Cancun',
        type: 'hotel',
        amount: 450,
        currency: '$'
    },
    {
        id: 'feed-4',
        userName: 'Linda H.',
        creationDateTime: new Date(now.getTime() - 5 * 60 * 60 * 1000),
        destination: 'Paris',
        type: 'flight',
        amount: 92,
        currency: '€'
    },
    {
        id: 'feed-5',
        userName: 'David S.',
        creationDateTime: new Date(now.getTime() - 24 * 60 * 60 * 1000),
        destination: 'Tokyo',
        type: 'hotel',
        amount: 305,
        currency: '¥'
    },
    {
        id: 'feed-6',
        userName: 'Emily R.',
        creationDateTime: new Date(now.getTime() - 48 * 60 * 60 * 1000),
        destination: 'Rome',
        type: 'flight',
        amount: 150,
        currency: '€'
    },
    {
        id: 'feed-7',
        userName: 'John D.',
        creationDateTime: new Date(now.getTime() - 72 * 60 * 60 * 1000),
        destination: 'Barcelona',
        type: 'hotel',
        amount: 180,
        currency: '$'
    },
    {
        id: 'feed-8',
        userName: 'Sarah K.',
        creationDateTime: new Date(now.getTime() - 30 * 60 * 1000),
        destination: 'London',
        type: 'flight',
        amount: 112,
        currency: '$'
    }
];

// Modify feedCardExampleData to serve as initial recent items and ensure ContextListItem compatibility
const initialMobileFeedItems: ContextListItem[] = feedCardExampleData.slice(0, 5).map((item, index) => {
    const minutesAgo = Math.floor(Math.random() * 30); // Within last 30 minutes
    const creationDateTime = new Date(now.getTime() - minutesAgo * 60 * 1000);

    return {
        id: item.id || `initial-mobile-${index}`,
        text: item.type === 'hotel' ? `Trip to ${item.destination}` : `Flight booking for ${item.userName}`,
        color: 'rgba(255, 255, 255, 0.05)', // Keep existing color or generate new
        userName: item.userName,
        creationDateTime: creationDateTime, // Use recent date
        destination: item.destination,
        type: item.type,
        amount: item.amount,
        currency: item.currency
        // cta is optional
    };
});

// Sort by creationDateTime: oldest first (ascending order) so newest is at the bottom
initialMobileFeedItems.sort((a, b) => (a.creationDateTime?.getTime() || 0) - (b.creationDateTime?.getTime() || 0));

interface MobileContentWelcomeProps {
    predefinedStep?: OnboardingSteps;
    onNextStep?: () => void;
}

export default function MobileContentWelcome({ predefinedStep, onNextStep }: MobileContentWelcomeProps) {
    return (
        <div className='flex min-h-screen flex-col items-center justify-between bg-gradient-to-t from-[#5AA6DA] from-0% via-[#006DBC] via-[22.5%] to-[#006DBC] text-white md:hidden'>
            <div className='flex w-full flex-1 flex-col items-center justify-start gap-6 pt-16'>
                <div className='fixed inset-x-0 top-0 z-50 flex h-24 w-full flex-row items-center justify-center'></div>
                <div className='flex w-full flex-row items-center justify-between px-4'>
                    <IconNewWhite className='size-18' />
                    <Link href='/auth/phone-login'>
                        <div className='cursor-pointer rounded-full px-6 py-2 text-base font-semibold text-white hover:bg-gray-200/20'>
                            Login
                        </div>
                    </Link>
                </div>

                <div className='flex h-full flex-1 flex-col items-center justify-center gap-6 pb-24'>
                    <div className='flex flex-row items-center justify-start gap-2 p-2 text-white'>
                        <h1 className='text-figtree text-base font-bold'>Backed by </h1>
                        <div className='flex flex-row items-center justify-center gap-1'>
                            <div className='size-6 bg-[#f26522] text-center text-base font-bold'>Y</div>
                        </div>
                    </div>

                    <h1 className='text-figtree mx-4 max-w-[300px] text-center text-[40.96px] leading-[34.14px] font-bold tracking-[-2%] text-white drop-shadow-xl sm:max-w-none sm:text-[60px]'>
                        Smart travelers don't overpay
                    </h1>
                    <h2 className='text-figtree max-w-[272px] text-center text-[14px] leading-[20px] font-semibold text-white drop-shadow-sm'>
                        Ascend watches your bookings and gets you money back when <b>Big Travel</b> drops prices. Get
                        start in just 3 steps.
                    </h2>
                    <div className='my-[2rem] flex flex-col items-start justify-center gap-2 text-sm font-bold text-white'>
                        <div className='flex flex-row items-center justify-center gap-2'>
                            <div className='size-6'>📧</div>
                            <div>Connect your email to import travel bookings</div>
                        </div>
                        <div className='flex flex-row items-center justify-center gap-2 opacity-50'>
                            <div className='size-6'>☎️</div>
                            <div>Add your phone number to get notified</div>
                        </div>
                        <div className='flex flex-row items-center justify-center gap-2 opacity-50'>
                            <div className='size-6'>🎉</div>
                            <div>Become a member to start saving</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
