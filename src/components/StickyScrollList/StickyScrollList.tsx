'use client';

import React, { useEffect, useRef, useState } from 'react';

// Assuming context is in the same directory
import DefaultCard from './DefaultCard';
import { ListItem as BaseStickyListItem, ItemAlignment, useStickyScrollListContext } from './StickyScrollListContext';
import type { StickyCardRenderProps } from './StickyScrollListTypes';

// Assuming DefaultCard is in the same directory

const DEFAULT_VISIBLE_ITEMS = 5; // Renamed from VISIBLE_ITEMS and made a default
const VERTICAL_SCALE_FACTOR = 0.07;
const HORIZONTAL_SCALE_FACTOR = 0.1;
const OPACITY_FACTOR = 0.15;
const SCROLLBAR_COMPENSATION = '20px';

// CardRenderProps used internally by StickyScrollList.tsx was an alias but is not needed if StickyScrollListProps is generic itself
// export interface CardRenderProps { ... } // This can be removed

// Make StickyScrollListProps generic
interface StickyScrollListProps<ItemType extends BaseStickyListItem = BaseStickyListItem> {
    renderItem?: (props: StickyCardRenderProps<ItemType>) => React.ReactNode;
    visibleItemsCount?: number;
}

// Make StickyScrollList component generic
export default function StickyScrollList<ItemType extends BaseStickyListItem = BaseStickyListItem>({
    renderItem,
    visibleItemsCount = DEFAULT_VISIBLE_ITEMS
}: StickyScrollListProps<ItemType>) {
    const {
        items,
        centerItemIndex,
        scrollContainerRef,
        itemHeight,
        totalItems,
        itemAlignment
        // Removed unused context values: addItem, scrollToItem, toggleAutoScroll, isAutoScrolling, cycleItemAlignment, addItemAndScroll
    } = useStickyScrollListContext();

    const [animatedInRegistry, setAnimatedInRegistry] = useState<Set<string | number>>(new Set());

    useEffect(() => {
        const newItemsToAnimate = items.filter((item) => !animatedInRegistry.has(item.id));

        if (newItemsToAnimate.length > 0) {
            newItemsToAnimate.forEach((item, indexInNewBatch) => {
                const delay = indexInNewBatch * 100; // Stagger by 100ms for each new item in this batch
                setTimeout(() => {
                    setAnimatedInRegistry((prevSet) => new Set(prevSet).add(item.id));
                }, delay + 50); // Base 50ms delay for DOM readiness plus stagger
            });
        }
    }, [items, animatedInRegistry]);

    const getItemContainerAlignmentClasses = (alignment: ItemAlignment) => {
        switch (alignment) {
            case 'left':
                return 'items-start';
            case 'right':
                return 'items-end';
            case 'center':
            default:
                return 'items-center';
        }
    };
    const listColumnAlignmentClass = getItemContainerAlignmentClasses(itemAlignment);

    return (
        <div className='flex w-full flex-col items-center'>
            <div
                className={`relative flex w-full max-w-md justify-center overflow-hidden rounded-lg`}
                style={{
                    height: itemHeight * visibleItemsCount // Used prop here
                }}>
                <div
                    ref={scrollContainerRef}
                    className={`relative -mr-8 flex h-full justify-center overflow-x-hidden overflow-y-scroll scroll-smooth pr-6`}
                    style={{
                        width: '100%',
                        scrollSnapType: 'y mandatory'
                    }}>
                    <div
                        className={`relative flex w-full flex-col ${listColumnAlignmentClass}`}
                        style={{ height: totalItems * itemHeight }}>
                        {items.map((item, index: number) => {
                            const distance = centerItemIndex !== null ? Math.abs(index - centerItemIndex) : totalItems;
                            const verticalScale = Math.max(0.5, 1 - distance * VERTICAL_SCALE_FACTOR);
                            const horizontalScale = Math.max(0.4, 1 - distance * HORIZONTAL_SCALE_FACTOR);
                            const calculatedOpacityBasedOnDistance = Math.max(0.1, 1 - distance * OPACITY_FACTOR);
                            let transformOrigin = 'center center';
                            if (itemAlignment === 'left') transformOrigin = 'left center';
                            if (itemAlignment === 'right') transformOrigin = 'right center';
                            const isCenter = index === centerItemIndex;

                            // Entrance animation logic
                            const hasAnimatedIn = animatedInRegistry.has(item.id);
                            const initialXOffset = '100%'; // Start from the right
                            const currentXOffset = hasAnimatedIn ? '0%' : initialXOffset;
                            const currentOpacity = hasAnimatedIn ? calculatedOpacityBasedOnDistance : 0; // Fade in

                            const itemTransform = `translateX(${currentXOffset}) scaleY(${verticalScale}) scaleX(${horizontalScale})`;

                            // Construct props for the renderItem function.
                            // item is cast to ItemType. This is safe if initialItemsData in provider matches ItemType.
                            const cardRenderProps: StickyCardRenderProps<ItemType> = {
                                item: item as ItemType, // Cast here
                                itemHeight,
                                alignment: itemAlignment,
                                isCenter
                            };

                            const cardContent = renderItem ? (
                                renderItem(cardRenderProps)
                            ) : (
                                // DefaultCard expects a BaseStickyListItem.
                                // item from context is already BaseStickyListItem.
                                <DefaultCard item={item} itemHeight={itemHeight} alignment={itemAlignment} />
                            );

                            return (
                                <div
                                    key={item.id}
                                    className={`my-1 w-full transition-all duration-300 ease-out`} // Increased duration from 150ms
                                    style={{
                                        height: itemHeight,
                                        transform: itemTransform,
                                        opacity: currentOpacity,
                                        scrollSnapAlign: 'center',
                                        zIndex: totalItems - distance,
                                        transformOrigin: transformOrigin,
                                        display: 'flex',
                                        justifyContent:
                                            itemAlignment === 'left'
                                                ? 'flex-start'
                                                : itemAlignment === 'right'
                                                  ? 'flex-end'
                                                  : 'center'
                                    }}>
                                    {cardContent}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
