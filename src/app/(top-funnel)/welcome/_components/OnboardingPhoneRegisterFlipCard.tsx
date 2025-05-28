'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
import ReloadTimerComponent from './ReloadTimerComponent';
import { Lock } from 'lucide-react';

const formSchema = z.object({
    phone: z.string().min(8, 'Please enter a valid phone number')
});

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

interface OnboardingPhoneRegisterFlipCardProps {
    state_id: string;
    onVerify: () => void;
}

export default function OnboardingPhoneRegisterFlipCard({ state_id, onVerify }: OnboardingPhoneRegisterFlipCardProps) {
    const [isFlipped, setIsFlipped] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState('US');
    const [otpValue, setOtpValue] = useState('');
    const [maskedPhone, setMaskedPhone] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [cooldown, setCooldown] = useState(0);

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
        setIsFlipped(false);
        // setCooldown(60); // 60 second cooldown
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
        trackLuckyOrangeEvent(EventLists.phone_inflight.name, {
            description: EventLists.phone_inflight.description
        });

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
                setIsFlipped(true);
                toast.success('Verification code sent');
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
                } catch (error) {
                    console.error('Error calling complete-registration endpoint:', error);
                }

                trackLuckyOrangeEvent(EventLists.phone_complete.name, {
                    description: EventLists.phone_complete.description
                });

                // Handle the verification in a callback, since we need to notify parent for animation purposes
                onVerify();
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
        if (otpValue.length === 6 && isFlipped && !isVerifying) {
            handleVerifyOtp();
        }
    }, [otpValue]);

    return (
        <div
            className={cn(
                'perspective-1000 relative',
                isFlipped && 'h-[250px]',
                !isFlipped && 'h-[310px]',
                'w-full max-w-[400px] transition-all duration-500'
            )}>
            <AnimatePresence>
                {!isFlipped ? (
                    <motion.div
                        key='front'
                        className='absolute h-full w-full'
                        variants={cardVariants}
                        initial='front'
                        animate='front'
                        exit='hidden'
                        style={{ backfaceVisibility: 'hidden', transformStyle: 'preserve-3d' }}>
                        <div className='flex h-full w-full flex-col gap-4 rounded-2xl bg-white p-10 drop-shadow-md'>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onPhoneSubmit)} className='flex flex-col gap-4'>
                                    <PhoneInput
                                        control={form.control}
                                        name='phone'
                                        label={
                                            <p className='text-base font-semibold font-w-700 text-neutral-700'>
                                                Confirm Your Number *
                                            </p>
                                        }
                                        onCountryChange={handleCountryChange}
                                        placeholder='Phone number'
                                        className='h-12 w-full rounded-l-none'
                                    />

                                    <div className='flex flex-col items-center justify-center font-semibold'>
                                        <span className='w-[270px] text-center text-xs text-neutral-700'>
                                            By verifying your number, you agree that you are at least 18 years of age
                                            and agree to our{' '}
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
                                        className='text-md mt-4 w-full rounded-full bg-[#17AA59] py-6 font-semibold'
                                        disabled={isLoading || cooldown > 0}>
                                        {isLoading
                                            ? 'Sending...'
                                            : cooldown > 0
                                                ? `Wait ${formatCooldown()}`
                                                : 'Get verification code'}
                                    </Button>
                                </form>
                            </Form>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key='back'
                        className='absolute h-full w-full'
                        variants={cardVariants}
                        initial='hidden'
                        animate='front'
                        exit='back'
                        style={{ backfaceVisibility: 'hidden', transformStyle: 'preserve-3d' }}>
                        <div className='flex w-full flex-col gap-4 rounded-2xl bg-white p-10 drop-shadow-md'>
                            <div className='flex items-center justify-between'>
                                <p className='text-base font-bold'>Enter Verification Code</p>
                                <ReloadTimerComponent reloadTime={60} onReload={handleResend} />
                            </div>
                            <div className='mt-4 flex justify-center'>
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

                            <Button
                                onClick={handleVerifyOtp}
                                disabled={otpValue.length !== 6 || isVerifying}
                                className='mt-4 w-full rounded-full bg-[#17AA59]'>
                                {isVerifying ? 'Verifying...' : 'Confrim number'}
                            </Button>
                            <div className="my-3 flex items-center font-bold text-sm">
                                <Lock className='size-6 text-black me-3' strokeWidth={3} />
                                <p>
                                    We only use your number for authentication purposes and to only strictly-necessary account messages.
                                </p>
                            </div>

                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            {!isFlipped && <OnboardingFooterWithLock />}
        </div>
    );
}
