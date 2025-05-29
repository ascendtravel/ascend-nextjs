'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import { ItemAlignment } from '../StickyScrollList/StickyScrollListContext';
import FeedCardHotelIcon from './FeedCardHotelIcon';
import FeedCardPlaneIcon from './FeedCardPlaneIcon';
import { differenceInSeconds, formatDistanceToNowStrict } from 'date-fns';

export interface FeedCardData {
    id: string | number;
    userName: string;
    creationDateTime: Date;
    destination: string;
    type: 'hotel' | 'flight';
    amount: number;
    currency: string;
}

interface StickyListRenderInjectedProps {
    itemHeight: number;
    alignment: ItemAlignment;
    isCenter: boolean;
}

export type FeedCardProps = FeedCardData & StickyListRenderInjectedProps;

const getFormattedTimeAgo = (date: Date, t: (key: string) => string): string => {
    const seconds = differenceInSeconds(new Date(), date);
    if (seconds < 5) {
        return t('feedCard.justNow');
    }

    // Add more granular formatting if desired (e.g., 30m ago -> 30m)
    return formatDistanceToNowStrict(date, { addSuffix: true });
};

export default function FeedCard({
    userName,
    creationDateTime,
    destination,
    type,
    amount,
    currency,
    alignment,
    isCenter
}: FeedCardProps) {
    const t = useTranslations();
    const [timeAgo, setTimeAgo] = useState<string | null>(null);

    useEffect(() => {
        const updateDisplayTime = () => {
            setTimeAgo(getFormattedTimeAgo(creationDateTime, t));
        };

        updateDisplayTime();

        const intervalId = setInterval(updateDisplayTime, 15000);

        return () => clearInterval(intervalId);
    }, [creationDateTime, t]);

    const savedAmount = `${currency}${amount}`;
    let primaryText: string;

    if (type === 'hotel') {
        primaryText = t('feedCard.savedOnTrip', {
            userName,
            amount: savedAmount,
            destination
        });
    } else {
        primaryText = t('feedCard.savedOnFlight', {
            userName,
            amount: savedAmount
        });
    }

    // Determine internal layout classes based on alignment prop
    let layoutClasses = 'space-x-3'; // Default for left and center
    let textAlignContainerClasses = 'text-left'; // Default for primaryText container
    const timeAgoAlignClass = 'text-right'; // Time always to the right of its container

    if (alignment === 'right') {
        layoutClasses = 'flex-row-reverse space-x-3 space-x-reverse';
        textAlignContainerClasses = 'text-right';
        // timeAgoAlignClass remains text-right within its own div, which is fine.
    } else if (alignment === 'left') {
        // Default layout is already suitable for left alignment of content blocks.
        // textAlignContainerClasses is already 'text-left'.
    }
    // For 'center', the icon is on the left, text block grows. Text inside block is left-aligned by default.
    // If truly centered text block is desired for alignment === 'center', that would be a different flex setup.

    return (
        <div
            className={`flex w-full items-center rounded-2xl bg-[#00345A] px-6 text-white shadow-md transition-shadow duration-150 hover:shadow-lg ${layoutClasses} ${isCenter ? 'pr-12' : 'opacity-60'}`}>
            <div className='flex-shrink-0'>
                {type === 'hotel' ? (
                    <FeedCardHotelIcon className='size-7 text-blue-500' />
                ) : (
                    <FeedCardPlaneIcon className='size-7 text-green-500' />
                )}
            </div>
            <div className={`min-w-0 flex-grow ${textAlignContainerClasses}`}>
                <div className={`text-left text-xs text-neutral-400`}>
                    {timeAgo !== null ? timeAgo : ''} {/* Render timeAgo if available, or empty/placeholder */}
                </div>{' '}
                {/* Adjust timeAgo based on overall card alignment for balance */}
                {/* render this only client side if window is defined  */}
                {window && <div className='truncate text-sm'>{primaryText}</div>}
            </div>
        </div>
    );
}
