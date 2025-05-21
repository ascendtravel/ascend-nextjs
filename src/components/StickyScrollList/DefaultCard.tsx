'use client';

import React from 'react';

// Path updated assuming context is now a sibling file or in a dedicated context/ subdir
import { ItemAlignment, ListItem } from './StickyScrollListContext';

// Adjust path once context is moved

interface DefaultCardProps {
    item: ListItem;
    itemHeight: number;
    alignment: ItemAlignment; // For internal text alignment if needed, though parent handles block alignment
    // Scale, opacity, zIndex will be applied by the parent StickyScrollList component
}

export default function DefaultCard({ item, itemHeight, alignment }: DefaultCardProps) {
    // Determine internal text/content alignment for the card content itself
    const textAlignClass = 'text-center';
    const justifyContentClass = 'justify-center';

    // This component only cares about its internal content alignment, if any.
    // The block alignment (left/center/right of the cards themselves) is handled by the parent list.
    // For a simple default card, we might just always center its text.
    // Or, if we want the text inside this default card to also follow the list's itemAlignment:
    // switch (alignment) {
    //     case 'left':
    //         textAlignClass = 'text-left';
    //         justifyContentClass = 'justify-start';
    //         break;
    //     case 'right':
    //         textAlignClass = 'text-right';
    //         justifyContentClass = 'justify-end';
    //         break;
    //     case 'center':
    //     default:
    //         textAlignClass = 'text-center';
    //         justifyContentClass = 'justify-center';
    //         break;
    // }

    return (
        <div
            className={`flex w-full items-center border-b border-gray-200 text-lg font-medium ${justifyContentClass} ${textAlignClass}`}
            style={{
                height: itemHeight,
                backgroundColor: item.color
                // The parent StickyScrollList will apply transform (scale) and opacity
            }}>
            <span className='truncate px-2'>{item.text}</span>
        </div>
    );
}
