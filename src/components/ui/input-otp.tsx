// components/InputOTPComponents.tsx
'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

import { OTPInput, OTPInputContext } from 'input-otp';
import { Minus } from 'lucide-react';

// components/InputOTPComponents.tsx

// components/InputOTPComponents.tsx

// components/InputOTPComponents.tsx

// components/InputOTPComponents.tsx

// components/InputOTPComponents.tsx

// Props for each individual slot, including a custom placeholder
type InputOTPSlotProps = React.ComponentPropsWithoutRef<'div'> & {
    index: number;
    placeholder?: React.ReactNode;
};

// The main OTPInput wrapper (omit placeholder so it doesn't get forwarded to all slots)
const InputOTP = React.forwardRef<React.ElementRef<typeof OTPInput>, React.ComponentProps<typeof OTPInput>>(
    ({ className, containerClassName, ...props }, ref) => (
        <OTPInput
            ref={ref}
            containerClassName={cn('flex items-center gap-2 has-[:disabled]:opacity-50', containerClassName)}
            className={cn('disabled:cursor-not-allowed', className)}
            {...props}
        />
    )
);
InputOTP.displayName = 'InputOTP';

// A simple flex container for grouping slots
const InputOTPGroup = React.forwardRef<React.ElementRef<'div'>, React.ComponentPropsWithoutRef<'div'>>(
    ({ className, ...props }, ref) => <div ref={ref} className={cn('flex items-center', className)} {...props} />
);
InputOTPGroup.displayName = 'InputOTPGroup';

// Each slot: shows either the typed character or its own placeholder
const InputOTPSlot = React.forwardRef<HTMLDivElement, InputOTPSlotProps>(
    ({ index, placeholder = '', className, ...props }, ref) => {
        const { slots } = React.useContext(OTPInputContext);
        const { char, hasFakeCaret, isActive } = slots[index];

        return (
            <div
                ref={ref}
                className={cn(
                    'border-input relative flex h-9 w-9 items-center justify-center border-y border-r text-sm shadow-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md',
                    isActive && 'ring-ring z-10 ring-1',
                    className
                )}
                {...props}>
                <span className='text-xs text-neutral-500'>{char != null && char !== '' ? char : placeholder}</span>

                {hasFakeCaret && (
                    <div className='pointer-events-none absolute inset-0 flex items-center justify-center'>
                        <div className='animate-caret-blink bg-foreground h-4 w-px duration-1000' />
                    </div>
                )}
            </div>
        );
    }
);
InputOTPSlot.displayName = 'InputOTPSlot';

// Optional separator component (e.g. a dash between groups)
const InputOTPSeparator = React.forwardRef<React.ElementRef<'div'>, React.ComponentPropsWithoutRef<'div'>>(
    ({ ...props }, ref) => (
        <div ref={ref} role='separator' {...props}>
            <Minus />
        </div>
    )
);
InputOTPSeparator.displayName = 'InputOTPSeparator';

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
