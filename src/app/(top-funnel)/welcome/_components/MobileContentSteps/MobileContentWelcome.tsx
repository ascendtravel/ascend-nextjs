'use client';

// Keep this if StickyScrollList or its context uses client features
import React from 'react';

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
    // Use the generated initial recent items
    // const listProviderItems = feedCardExampleData.map( ... ); // Old mapping removed

    return (
        <div className='flex min-h-screen flex-col items-center justify-between bg-gradient-to-t from-[#5AA6DA] from-0% via-[#006DBC] via-[22.5%] to-[#006DBC] text-white md:hidden'>
            <div className='flex w-full flex-col items-center justify-start pt-16'>
                <div className='fixed inset-x-0 top-0 z-50 flex w-full flex-col items-center justify-center bg-[#00345A]'>
                    <YcombBanner />
                </div>
                <IconNewWhite className='size-24' />
                <div className='h-[180px] w-full max-w-sm'>
                    <StickyScrollListProvider
                        initialItemsData={initialMobileFeedItems} // Provide generated initial items
                        mockFeed // Enable the live feed
                        feedOptions={{
                            intervalMs: 3500,
                            minAmount: 60,
                            maxAmount: 480
                        }}
                        itemHeight={70}
                        initialAlignment='center'>
                        <StickyScrollList
                            renderItem={(stickyProps: StickyCardRenderProps<ContextListItem>) => {
                                const itemFromContext = stickyProps.item;
                                const feedCardData: FeedCardData = {
                                    id: String(itemFromContext.id),
                                    userName: itemFromContext.userName || 'User',
                                    creationDateTime: itemFromContext.creationDateTime || new Date(),
                                    destination: itemFromContext.destination || 'Place',
                                    type: (itemFromContext.type as 'hotel' | 'flight') || 'hotel',
                                    amount: itemFromContext.amount || 0,
                                    currency: itemFromContext.currency || '$'
                                };

                                return (
                                    <FeedCard
                                        {...feedCardData}
                                        itemHeight={stickyProps.itemHeight}
                                        alignment={stickyProps.alignment}
                                        isCenter={stickyProps.isCenter}
                                    />
                                );
                            }}
                            visibleItemsCount={3}
                        />
                    </StickyScrollListProvider>
                </div>
                <div className='my-14 flex max-w-xs flex-col items-center justify-center space-y-4 px-4 text-center'>
                    <p className='font-figtree max-w-[254px] text-center text-[30px] leading-tight font-extrabold tracking-[-0.02em] sm:text-[32px]'>
                        Smart travelers don't overpay
                    </p>
                    <p className='font-figtree text-base leading-snug font-medium sm:text-[17px]'>
                        Ascend watches your bookings and gets you money back when Big Travel drops prices.
                    </p>
                </div>
                {/* <div onClick={handleGetStartedClick} className='mb-20 w-full max-w-xs cursor-pointer px-4'>
                    <div className='text-md w-full rounded-full bg-white px-8 py-3.5 text-center font-bold text-neutral-700 shadow-lg transition-colors hover:bg-gray-100'>
                        Get Started for Free
                    </div>
                </div> */}
            </div>
        </div>
    );
}
