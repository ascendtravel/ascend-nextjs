'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import IconNewWhite from '@/components/Icon/IconNewWhite';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { PhoneInput } from '@/components/ui/phone-input';
import { FRAMER_LINKS } from '@/config/navigation';
import { useUser } from '@/contexts/UserContext';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';

import { AnimatePresence, motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

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

interface PhoneRegisterViewProps {
    redirectUrl: string;
    state_id: string;
}

export function PhoneRegisterView({ redirectUrl, state_id }: PhoneRegisterViewProps) {
    const router = useRouter();
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
        setCooldown(60); // 60 second cooldown
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

                toast.success('Login successful');

                if (redirectUrl) {
                    router.push(redirectUrl);
                } else {
                    router.push(`/gmail-link_b/success?state_id=${state_id}`);
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
        if (otpValue.length === 6 && isFlipped && !isVerifying) {
            handleVerifyOtp();
        }
    }, [otpValue]);

    return (
        <div
            className={cn(
                'perspective-1000 relative',
                isFlipped && 'h-[350px]',
                !isFlipped && 'h-[380px]',
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
                        <div className='flex w-full items-center justify-center pt-2 pb-6'>
                            <p className='max-w-[3000px] text-center text-3xl leading-7 font-bold text-neutral-50'>
                                You're almost there! Confirm your number:
                            </p>
                        </div>
                        <div className='flex h-full w-full flex-col gap-4 rounded-2xl bg-white p-10 drop-shadow-md'>
                            <h2 className='text-2xl font-bold'>Phone number</h2>
                            <span className='text-md text-neutral-800'>
                                We'll send you an SMS with a confirmation code
                            </span>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onPhoneSubmit)} className='flex flex-col gap-4'>
                                    <PhoneInput
                                        control={form.control}
                                        name='phone'
                                        label='Your Number *'
                                        onCountryChange={handleCountryChange}
                                        className='h-12 w-full rounded-l-none'
                                    />
                                    <Button
                                        type='submit'
                                        className='text-md w-full rounded-full bg-[#1DC167] py-6 font-semibold'
                                        disabled={isLoading || cooldown > 0}>
                                        {isLoading
                                            ? 'Sending...'
                                            : cooldown > 0
                                              ? `Wait ${formatCooldown()}`
                                              : 'Get verification code'}
                                    </Button>
                                    <div className='flex flex-col items-center justify-center'>
                                        <span className='max-w-[240px] text-center text-xs text-neutral-700'>
                                            By clicking on continue, you agree that you are at least 18 years of age and
                                            agree to our{' '}
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
                        <div className='flex w-full items-center justify-center pt-2 pb-6'>
                            <p className='max-w-[3000px] text-center text-3xl leading-7 font-bold text-neutral-50'>
                                Your're almost there! Confirm your number:
                            </p>
                        </div>
                        <div className='flex h-full w-full flex-col gap-4 rounded-2xl bg-white p-10 drop-shadow-md'>
                            <h2 className='text-2xl font-bold'>Verify Your Number</h2>
                            <span className='text-sm text-neutral-600'>
                                We've sent you a verification code to your number {maskedPhone}. <br />
                                <br />
                                <p className='-mt-5 text-sm text-neutral-600'>Please enter the code below:</p>
                            </span>
                            <div className='mt-4'>
                                <InputOTP
                                    maxLength={6}
                                    value={otpValue}
                                    onChange={(value) => {
                                        setOtpValue(value);
                                    }}
                                    containerClassName='justify-center gap-2'>
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
                                className='mt-4 w-full rounded-full bg-[#1DC167]'>
                                {isVerifying ? 'Verifying...' : 'Verify'}
                            </Button>
                            <Button
                                variant='link'
                                onClick={handleResend}
                                disabled={cooldown > 0}
                                className='text-sm text-neutral-600/60 underline'>
                                {cooldown > 0 ? `Resend in ${formatCooldown()}` : 'Resend?'}
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
