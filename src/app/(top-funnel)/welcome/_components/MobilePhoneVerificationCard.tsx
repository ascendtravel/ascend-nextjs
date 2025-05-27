'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { PhoneInput } from '@/components/ui/phone-input';
import { FRAMER_LINKS } from '@/config/navigation';
import { useUser } from '@/contexts/UserContext';
import { EventLists, trackLuckyOrangeEvent } from '@/lib/analytics';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { ReloadIcon } from '@radix-ui/react-icons';

import OnboardingFooterWithLock from './OnboardingFooterWithLock';
import { AnimatePresence, motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const formSchema = z.object({
    phone: z.string().min(8, 'Please enter a valid phone number')
});

const verificationStepHeight = 230;

type FormData = z.infer<typeof formSchema>;

const cardVariants = {
    front: {
        rotateY: 0,
        scale: 1,
        transition: { duration: 0.4, ease: 'easeOut' }
    },
    back: {
        rotateY: 180,
        scale: 1,
        transition: { duration: 0.4, ease: 'easeOut' }
    },
    hidden: {
        rotateY: -180,
        scale: 1,
        transition: { duration: 0.4, ease: 'easeOut' }
    }
};

export default function MobilePhoneVerificationCard({
    onVerify,
    forceHeight
}: {
    onVerify?: () => void;
    forceHeight: (height: number | null) => void;
}) {
    const [isCodeStep, setIsCodeStep] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState('US');
    const [otpValue, setOtpValue] = useState('');
    const [maskedPhone, setMaskedPhone] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [cooldown, setCooldown] = useState(0);

    const searchParams = useSearchParams();
    const state_id = searchParams.get('state_id');

    const { login, logout } = useUser();

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            phone: ''
        }
    });

    // Handle cooldown timer
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (cooldown > 0) {
            timer = setTimeout(() => setCooldown((prev) => prev - 1), 1000);
        }

        return () => clearTimeout(timer);
    }, [cooldown]);

    const handleResend = () => {
        if (cooldown > 0) return;
        setIsCodeStep(false);
        setCooldown(60); // 60 second cooldown
        forceHeight(null);
    };

    const formatCooldown = () => {
        const minutes = Math.floor(cooldown / 60);
        const seconds = cooldown % 60;

        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleCountryChange = (countryCode: string) => {
        setSelectedCountry(countryCode);
    };

    const onPhoneSubmit = async (data: FormData) => {
        setIsLoading(true);

        // Clear previous impersonation and logout
        logout();

        const phone = form.getValues('phone');
        const formattedPhone = phone.replace(/\D/g, '');
        setPhoneNumber(formattedPhone);

        try {
            const response = await fetch('/api/otp/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone_number: phone })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to send OTP');
            }

            const responseData = await response.json();

            if (responseData.success) {
                const masked = phone.replace(/\d(?=\d{4})/g, '*');
                setMaskedPhone(masked);
                setIsCodeStep(true);
                trackLuckyOrangeEvent(EventLists.phone_inflight.name, {
                    description: EventLists.phone_inflight.description
                });
                forceHeight(verificationStepHeight);
            } else {
                throw new Error(responseData.message || 'Failed to send OTP');
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to send OTP');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (otpValue.length !== 6) {
            toast.error('Please enter a valid 6-digit code');

            return;
        }

        setIsVerifying(true);
        try {
            const response = await fetch('/api/otp/validate-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phone_number: phoneNumber,
                    otp_code: otpValue,
                    state_id: state_id
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Invalid verification code');
            }

            if (data.success) {
                login(data.token, data.customer_id);

                // CALL FINISH REGISTRATION
                try {
                    const registrationResponse = await fetch('/api/user/complete-registration', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ state_id })
                    });

                    if (!registrationResponse.ok) {
                        console.error('Failed to complete registration:', await registrationResponse.json());
                    }
                    trackLuckyOrangeEvent(EventLists.phone_complete.name, {
                        description: EventLists.phone_complete.description
                    });
                    onVerify?.();
                } catch (error) {
                    console.error('Error calling complete-registration endpoint:', error);
                }
            } else {
                throw new Error(data.message || 'Verification failed');
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Verification failed');
        } finally {
            setIsVerifying(false);
        }
    };

    // Add a useEffect to auto-submit when OTP is complete
    useEffect(() => {
        if (otpValue.length === 6 && isCodeStep && !isVerifying) {
            handleVerifyOtp();
        }
    }, [otpValue]);

    return (
        <div className='flex h-full flex-col items-center justify-center p-4 text-center'>
            {!isCodeStep ? (
                <>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onPhoneSubmit)} className='flex flex-col gap-4'>
                            <div className='text-left text-base font-semibold text-neutral-700'>
                                Prices are time-sensitive, so we'll text you as soon as we see an opportunity:
                            </div>
                            <PhoneInput
                                control={form.control}
                                name='phone'
                                label={
                                    <p className='text-base font-semibold text-neutral-700'>Confirm Your Number *</p>
                                }
                                onCountryChange={handleCountryChange}
                                placeholder='Phone number'
                                className='h-12 w-full rounded-l-none'
                            />

                            <div className='flex flex-col items-center justify-center'>
                                <span className='w-full text-center text-xs text-neutral-700'>
                                    By verifying your number, you agree that you are at least 18 years of age and agree
                                    to our{' '}
                                    <Link
                                        href={FRAMER_LINKS.privacy}
                                        className='cursor-pointer text-neutral-900 underline'>
                                        Privacy Policy
                                    </Link>{' '}
                                    and{' '}
                                    <Link
                                        href={FRAMER_LINKS.terms}
                                        className='cursor-pointer text-neutral-900 underline'>
                                        Terms of Use
                                    </Link>
                                </span>
                            </div>
                            <Button
                                type='submit'
                                className='text-md w-full rounded-full bg-[#17AA59] py-6 font-semibold'
                                disabled={isLoading || cooldown > 0}>
                                {isLoading
                                    ? 'Sending...'
                                    : cooldown > 0
                                      ? `Wait ${formatCooldown()}`
                                      : 'Get verification code'}
                            </Button>
                        </form>
                    </Form>
                </>
            ) : (
                <div className='flex h-full w-full flex-col gap-4 bg-white'>
                    <div className='flex items-center justify-between'>
                        <p className='text-base font-semibold text-neutral-700'>Enter Verification Code</p>
                        <div
                            className='rounded-full p-1 text-neutral-700 hover:cursor-pointer hover:bg-neutral-100'
                            onClick={handleResend}>
                            <ReloadIcon className='size-4' />
                        </div>
                    </div>
                    <div className=''>
                        <InputOTP
                            maxLength={6}
                            value={otpValue}
                            onChange={(value) => {
                                setOtpValue(value);
                            }}
                            containerClassName='justify-start gap-2'>
                            <InputOTPGroup>
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <InputOTPSlot key={i} index={i} className='size-11 text-xl font-bold' />
                                ))}
                            </InputOTPGroup>
                        </InputOTP>
                    </div>

                    <div
                        onClick={handleVerifyOtp}
                        className={cn(
                            'w-full max-w-xs rounded-full bg-[#1DC167] px-12 py-3 text-base font-medium text-white shadow-md transition-colors hover:bg-[#1D70B8]/90',
                            otpValue.length !== 6 || (isVerifying && 'bg-neutral-400')
                        )}>
                        {isVerifying ? 'Verifying...' : 'Confrim number'}
                    </div>
                </div>
            )}
        </div>
    );
}
