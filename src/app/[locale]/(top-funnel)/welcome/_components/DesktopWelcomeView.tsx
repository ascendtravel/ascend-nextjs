'use client';

// This can remain a server component if it doesn't have client-side interactivity directly
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import FeedCard, { FeedCardData } from '@/components/FeedCard/FeedCard';
import { StickyScrollList } from '@/components/StickyScrollList';
import { StickyScrollListProvider } from '@/components/StickyScrollList/StickyScrollListContext';
import type { ListItem as ContextListItem } from '@/components/StickyScrollList/StickyScrollListContext';
import type { StickyCardRenderProps } from '@/components/StickyScrollList/StickyScrollListTypes';

import { OnboardingSteps } from '../_types';
import DesktopLeftContent from './DesktopLeftContent';
import DesktopRightContent from './DesktopRightContent';

const now = new Date();

// Helper to parse step from URL (can be moved to a shared file like _types.ts)
const getStepFromQuery = (searchParams: URLSearchParams): OnboardingSteps => {
    const stepParam = searchParams.get('step');
    if (stepParam) {
        const stepParamLower = stepParam.toLowerCase();
        if (stepParamLower === '1') return OnboardingSteps.Step1;
        if (stepParamLower === '2') return OnboardingSteps.Step2;
        if (stepParamLower === '3') return OnboardingSteps.Step3;
        if (stepParamLower === '4') return OnboardingSteps.Step4;
    }

    return OnboardingSteps.Step0; // Default step
};

// Helper to generate more diverse data - This will be removed as generation is handled by context
// const generateFeedItem = (index: number): FeedCardData => { ... };

// This will be removed as initial items can be empty or handled differently if mockFeed is true
// const desktopFeedCardData: FeedCardData[] = Array.from({ length: 50 }, (_, i) => generateFeedItem(i));

// Helper to generate initial feed items for the view
const generateInitialFeedItems = (count: number): ContextListItem[] => {
    const items: ContextListItem[] = [];
    const now = new Date().getTime();
    const userNames = ['Alex G.', 'Maria L.', 'Chris B.', 'Lena P.', 'John F.'];
    const destinations = ['New York', 'San Francisco', 'Chicago', 'Miami', 'Las Vegas'];
    const types: Array<'hotel' | 'flight'> = ['hotel', 'flight'];
    const currencies = ['$', '€', '¥'];

    for (let i = 0; i < count; i++) {
        const minutesAgo = Math.floor(Math.random() * 30); // Within the last 30 minutes
        const creationDateTime = new Date(now - minutesAgo * 60 * 1000);
        const type = types[i % types.length];
        const userName = userNames[i % userNames.length];
        const destination = destinations[i % destinations.length];

        items.push({
            id: `initial-desktop-${i}`,
            text: `${userName} booked a ${type} to ${destination}`,
            color: `hsl(${(i * 60) % 360}, 70%, 85%)`, // Simple color generation
            userName: userName[0] + '.',
            creationDateTime,
            destination,
            type,
            amount: Math.floor(Math.random() * 400) + 50, // Random amount
            currency: currencies[i % currencies.length]
        });
    }
    // Sort by creationDateTime: oldest first (ascending order) so newest is at the bottom
    items.sort((a, b) => (a.creationDateTime?.getTime() || 0) - (b.creationDateTime?.getTime() || 0));

    return items;
};

export default function DesktopWelcomeView() {
    const initialListItems = generateInitialFeedItems(5);
    const searchParams = useSearchParams();
    const currentUrlStep = getStepFromQuery(searchParams);

    // Determine if the initial globe animation should be skipped
    const skipInitialGlobeAnimation = currentUrlStep !== OnboardingSteps.Step0;

    return (
        <div className='relative hidden h-screen overflow-hidden md:flex'>
            <DesktopRightContent skipInitialGlobeAnimation={skipInitialGlobeAnimation} /> {/* Map background, z-0 */}
            <DesktopLeftContent />
            {currentUrlStep !== OnboardingSteps.Step4 && (
                <div className='fixed top-1/2 left-[50%] z-10 flex w-fit -translate-y-1/2 items-center justify-start p-8'>
                    <div className='h-[330px] w-full max-w-sm'>
                        <StickyScrollListProvider
                            initialItemsData={initialListItems} // Provide generated initial items
                            mockFeed // Enable the live feed
                            feedOptions={{
                                intervalMs: 3000,
                                minAmount: 75,
                                maxAmount: 550
                            }}
                            itemHeight={80}
                            initialAlignment='left'>
                            <StickyScrollList
                                renderItem={(stickyProps: StickyCardRenderProps<ContextListItem>) => {
                                    const itemFromContext = stickyProps.item;
                                    // Now, itemFromContext should have all necessary fields from initial generation or mock feed
                                    const feedCardData: FeedCardData = {
                                        id: String(itemFromContext.id),
                                        userName: itemFromContext.userName || 'User', // Fallback can be simpler if data is reliable
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
                                visibleItemsCount={5}
                            />
                        </StickyScrollListProvider>
                    </div>
                </div>
            )}
        </div>
    );
}
