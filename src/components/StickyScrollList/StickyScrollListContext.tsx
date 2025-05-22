'use client';

import React, { ReactNode, createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

// Constants (can be defined here or passed as props to Provider)
const DEFAULT_ITEM_HEIGHT = 80;
const AUTO_SCROLL_INTERVAL_MS = 2000;

// ---------------------------------------------------------------------------
// Mock-feed defaults
// ---------------------------------------------------------------------------
const MIN_FEED_INTERVAL_MS = 10000; // 10 seconds
const MAX_FEED_INTERVAL_MS = 30000; // 30 seconds
const MAX_LIST_ITEMS = 30; // Define the maximum number of items

const DEFAULT_FEED_NAMES = [
    'Alex G.',
    'Maria L.',
    'Chris B.',
    'Lena P.',
    'John F.',
    'Jane D.',
    'Sam T.',
    'Lucy K.',
    'Omar S.',
    'Ivy R.'
];

const DEFAULT_FEED_DESTINATIONS = [
    'New York',
    'San Francisco',
    'Chicago',
    'Miami',
    'Las Vegas',
    'London',
    'Paris',
    'Tokyo',
    'Dubai',
    'Rome',
    'Sydney',
    'Toronto',
    'Berlin',
    'Amsterdam',
    'Madrid'
];

const DEFAULT_FEED_TYPES: Array<'hotel' | 'flight'> = ['hotel', 'flight'];
const DEFAULT_FEED_CURRENCIES = ['$', '€'];

interface FeedOptions {
    names?: string[];
    destinations?: string[];
    types?: string[]; // Should be Array<'hotel' | 'flight'> or similar if strict
    currencies?: string[];
    minAmount?: number;
    maxAmount?: number;
    intervalMs?: number;
}

// Utility to generate a random feed transaction
function generateMockTransaction(index: number, options: FeedOptions = {}): ListItem {
    const {
        names = DEFAULT_FEED_NAMES,
        destinations = DEFAULT_FEED_DESTINATIONS,
        types = DEFAULT_FEED_TYPES as Array<'hotel' | 'flight'>,
        currencies = DEFAULT_FEED_CURRENCIES
    } = options;

    const now = new Date();
    const type = types[index % types.length];

    let minAmount, maxAmount;
    if (type === 'flight') {
        minAmount = 20;
        maxAmount = 120;
    } else {
        minAmount = 50;
        maxAmount = 200;
    }

    const userName = names[index % names.length];
    const destination = destinations[index % destinations.length];
    const amount = Math.floor(Math.random() * (maxAmount - minAmount + 1)) + minAmount;
    const currency = currencies[index % currencies.length];

    const creationDateTime = now;

    const text = `${userName} booked a ${type} to ${destination}`;

    return {
        id: `feed-${index + Date.now()}`,
        text,
        color: generateItemColor(index, index + 1),
        amount,
        destination,
        userName,
        type,
        currency,
        creationDateTime
    };
}

// Types
export interface ListItem {
    id: string | number;
    text: string;
    color: string;
    cta?: string;
    amount?: number;
    destination?: string;
    userName?: string;
    type?: 'hotel' | 'flight' | string; // Allow for other types or keep strict
    currency?: string;
    creationDateTime?: Date;
}

export type ItemAlignment = 'left' | 'center' | 'right';

interface StickyScrollListContextType {
    items: ListItem[];
    centerItemIndex: number | null;
    scrollContainerRef: React.RefObject<HTMLDivElement | null>;
    assignItemRef: (index: number, el: HTMLDivElement | null) => void; // Still useful for direct DOM access if ever needed
    addItem: () => void;
    scrollToItem: (index: number) => void;
    toggleAutoScroll: () => void;
    isAutoScrolling: boolean;
    itemHeight: number;
    totalItems: number;
    itemAlignment: ItemAlignment;
    setItemAlignment: (alignment: ItemAlignment) => void;
    cycleItemAlignment: () => void;
    addItemAndScroll: () => void; // New function
}

const StickyScrollListContext = createContext<StickyScrollListContextType | undefined>(undefined);

// Standalone utility function for item color (can be moved to a utils file)
function generateItemColor(index: number, totalItems: number): string {
    const hue = (index * (360 / Math.max(1, totalItems / 1.5))) % 360;

    return `hsl(${hue}, 70%, 85%)`;
}

interface StickyScrollListProviderProps {
    children: ReactNode;
    initialItemsData?: ListItem[];
    initialItemCount?: number;
    itemHeight?: number;
    initialAlignment?: ItemAlignment;

    // Live-feed / mock-feed configuration
    mockFeed?: boolean;
    feedOptions?: FeedOptions;
}

export function StickyScrollListProvider({
    children,
    initialItemsData,
    initialItemCount = initialItemsData ? initialItemsData.length : 5,
    itemHeight = DEFAULT_ITEM_HEIGHT,
    initialAlignment = 'center',
    mockFeed = false,
    feedOptions
}: StickyScrollListProviderProps) {
    const [items, setItems] = useState<ListItem[]>(() => {
        if (initialItemsData) {
            return initialItemsData;
        }
        const generatedItems: ListItem[] = [];
        for (let i = 0; i < initialItemCount; i++) {
            generatedItems.push({
                id: i,
                text: `Item ${i + 1}`,
                color: generateItemColor(i, initialItemCount)
            });
        }

        return generatedItems;
    });
    const [centerItemIndex, setCenterItemIndex] = useState<number | null>(null);
    const [isAutoScrolling, setIsAutoScrolling] = useState(false);
    const [itemAlignment, setItemAlignment] = useState<ItemAlignment>(initialAlignment);

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<(HTMLDivElement | null)[]>(new Array(items.length).fill(null));
    const autoScrollIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const feedIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const mockFeedItemIndexRef = useRef<number>(0); // Ref to maintain a persistent index for mock item generation

    // Ensure feedOptions has a stable reference and default values
    const resolvedFeedOptions: FeedOptions = React.useMemo(() => feedOptions ?? {}, [feedOptions]);

    useEffect(() => {
        if (!initialItemsData) {
            const generatedItems: ListItem[] = [];
            for (let i = 0; i < initialItemCount; i++) {
                generatedItems.push({
                    id: i,
                    text: `Item ${i + 1}`,
                    color: generateItemColor(i, initialItemCount)
                });
            }
            setItems(generatedItems);
        }
        itemRefs.current = new Array(items.length).fill(null);
    }, [initialItemsData, initialItemCount, items.length]);

    const assignItemRef = useCallback((index: number, el: HTMLDivElement | null) => {
        if (index < itemRefs.current.length) {
            itemRefs.current[index] = el;
        }
    }, []);

    const updateVisualEffects = useCallback(() => {
        const container = scrollContainerRef.current;
        if (!container || items.length === 0) return;
        const scrollTop = container.scrollTop;
        const containerCenterY = scrollTop + container.clientHeight / 2;
        let newCenterIndex = Math.round((containerCenterY - itemHeight / 2) / itemHeight);
        newCenterIndex = Math.max(0, Math.min(newCenterIndex, items.length - 1));
        if (newCenterIndex !== centerItemIndex) {
            setCenterItemIndex(newCenterIndex);
        }
    }, [items, itemHeight, centerItemIndex]);

    const handleScroll = useCallback(() => {
        updateVisualEffects();
    }, [updateVisualEffects]);

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (container) {
            updateVisualEffects();
            container.addEventListener('scroll', handleScroll, { passive: true });

            return () => {
                container.removeEventListener('scroll', handleScroll);
            };
        }
    }, [handleScroll, updateVisualEffects]);

    const addItem = useCallback(() => {
        setItems((prevItems) => {
            const numericIds = prevItems.map((item) => item.id).filter((id) => typeof id === 'number') as number[];
            const newItemId = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 0;
            const newItemTextIndex = prevItems.length + 1;
            const newItem: ListItem = {
                id: newItemId,
                text: `Item ${newItemTextIndex}`,
                color: generateItemColor(prevItems.length, prevItems.length + 1)
            };
            if (prevItems.length + 1 > itemRefs.current.length) {
                itemRefs.current = [...itemRefs.current, null]; // Grow refs array
            }

            return [...prevItems, newItem];
        });
    }, []);

    const scrollToItem = useCallback(
        (index: number) => {
            const container = scrollContainerRef.current;
            if (container && items[index]) {
                const idealScrollTop = index * itemHeight - container.clientHeight / 2 + itemHeight / 2;
                container.scrollTo({ top: idealScrollTop, behavior: 'smooth' });
            }
        },
        [items, itemHeight]
    );

    const addItemAndScroll = useCallback(() => {
        const newItemIndex = items.length; // Index before adding
        addItem(); // This will update items state asynchronously

        // Scroll after a short delay to allow state to update and DOM is ready.
        setTimeout(() => {
            const container = scrollContainerRef.current;
            if (container) {
                const idealScrollTop = newItemIndex * itemHeight - container.clientHeight / 2 + itemHeight / 2;
                container.scrollTo({ top: idealScrollTop, behavior: 'smooth' });
            }
        }, 0); // setTimeout with 0ms delay to push to next tick after state update
    }, [addItem, items, itemHeight]);

    const toggleAutoScroll = useCallback(() => setIsAutoScrolling((prev) => !prev), []);

    const cycleItemAlignment = useCallback(() => {
        setItemAlignment((prev) => (prev === 'left' ? 'center' : prev === 'center' ? 'right' : 'left'));
    }, []);

    useEffect(() => {
        if (isAutoScrolling && items.length > 0) {
            autoScrollIntervalRef.current = setInterval(() => {
                const currentIdx = centerItemIndex === null ? 0 : centerItemIndex;
                let nextIndex = currentIdx + 1;
                if (nextIndex >= items.length) nextIndex = 0;
                scrollToItem(nextIndex);
            }, AUTO_SCROLL_INTERVAL_MS);
        } else {
            if (autoScrollIntervalRef.current) clearInterval(autoScrollIntervalRef.current);
            autoScrollIntervalRef.current = null;
        }

        return () => {
            if (autoScrollIntervalRef.current) clearInterval(autoScrollIntervalRef.current);
        };
    }, [isAutoScrolling, items, scrollToItem, centerItemIndex]);

    // -----------------------------------------------------------------------
    // Mock-feed: periodically push a new transaction item when enabled
    // -----------------------------------------------------------------------
    useEffect(() => {
        if (!mockFeed) {
            if (feedIntervalRef.current) clearTimeout(feedIntervalRef.current);
            feedIntervalRef.current = null;

            return;
        }

        // Function to add an item and schedule the next one
        const addAndScheduleNext = () => {
            const container = scrollContainerRef.current;
            const currentScrollTop = container ? container.scrollTop : 0;

            const currentIndexForGeneration = mockFeedItemIndexRef.current;
            mockFeedItemIndexRef.current += 1;

            setItems((prevItems) => {
                const newItem = generateMockTransaction(currentIndexForGeneration, resolvedFeedOptions);
                let updatedItems = [...prevItems, newItem];
                if (updatedItems.length > MAX_LIST_ITEMS) {
                    updatedItems = updatedItems.slice(updatedItems.length - MAX_LIST_ITEMS);
                }

                return updatedItems;
            });

            setTimeout(() => {
                if (container) {
                    container.scrollTo({
                        top: currentScrollTop + itemHeight,
                        behavior: 'smooth'
                    });
                }
            }, 0);

            // Schedule the next call
            const randomInterval =
                Math.floor(Math.random() * (MAX_FEED_INTERVAL_MS - MIN_FEED_INTERVAL_MS + 1)) + MIN_FEED_INTERVAL_MS;
            console.log(`Next mock feed item in: ${randomInterval / 1000}s`); // Optional: for debugging
            feedIntervalRef.current = setTimeout(addAndScheduleNext, randomInterval);
        };

        // Start the first call (it will then self-schedule)
        // To avoid an immediate item if feedOptions.intervalMs is very short via props,
        // we could use an initial random delay or respect feedOptions.intervalMs for the *first* call only.
        // For now, let's make the first one appear after a random delay too.
        const initialRandomInterval =
            Math.floor(Math.random() * (MAX_FEED_INTERVAL_MS - MIN_FEED_INTERVAL_MS + 1)) + MIN_FEED_INTERVAL_MS;
        console.log(`First mock feed item in: ${initialRandomInterval / 1000}s`);
        feedIntervalRef.current = setTimeout(addAndScheduleNext, initialRandomInterval);

        return () => {
            if (feedIntervalRef.current) clearTimeout(feedIntervalRef.current);
            feedIntervalRef.current = null;
        };
    }, [mockFeed, resolvedFeedOptions, itemHeight]);

    const value: StickyScrollListContextType = {
        items,
        centerItemIndex,
        scrollContainerRef: scrollContainerRef as React.RefObject<HTMLDivElement | null>,
        assignItemRef,
        addItem,
        scrollToItem,
        toggleAutoScroll,
        isAutoScrolling,
        itemHeight,
        totalItems: items.length,
        itemAlignment,
        setItemAlignment,
        cycleItemAlignment,
        addItemAndScroll
    };

    return <StickyScrollListContext.Provider value={value}>{children}</StickyScrollListContext.Provider>;
}

export function useStickyScrollListContext(): StickyScrollListContextType {
    const context = useContext(StickyScrollListContext);
    if (context === undefined) {
        throw new Error('useStickyScrollListContext must be used within a StickyScrollListProvider');
    }

    return context;
}
