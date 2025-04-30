'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

interface TextSwitchProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    leftText: string;
    rightText: string;
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
}

const TextSwitch = React.forwardRef<HTMLButtonElement, TextSwitchProps>(
    ({ leftText, rightText, checked = false, onCheckedChange, className, ...props }, ref) => {
        return (
            <button
                ref={ref}
                role='switch'
                aria-checked={checked}
                onClick={() => onCheckedChange?.(!checked)}
                className={cn(
                    'group relative inline-flex h-8 w-[100px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent bg-neutral-200 transition-colors focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
                    className
                )}
                {...props}>
                {/* Background text - dimmed */}
                <span className='flex w-full justify-between px-2 text-xs font-medium text-neutral-500'>
                    <span className='pl-2 text-neutral-900'>{leftText}</span>
                    <span>{rightText}</span>
                </span>

                {/* Sliding thumb with active text */}
                <span
                    className={cn(
                        'absolute left-0 flex h-7 w-[46px] items-center justify-center rounded-full bg-white text-xs font-semibold text-neutral-900 shadow-lg transition-transform duration-200',
                        checked ? 'translate-x-[50px]' : 'translate-x-[2px]'
                    )}>
                    {checked ? rightText : leftText}
                </span>
            </button>
        );
    }
);

TextSwitch.displayName = 'TextSwitch';

export { TextSwitch };
