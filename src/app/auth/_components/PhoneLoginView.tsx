'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import IconNewWhite from '@/components/Icon/IconNewWhite';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { PhoneInput } from '@/components/ui/phone-input';
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

interface PhoneLoginViewProps {
    redirectUrl: string;
    showImpersonate?: boolean;
}

export function PhoneLoginView({ redirectUrl, showImpersonate }: PhoneLoginViewProps) {
    const router = useRouter();
    const [isFlipped, setIsFlipped] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState('US');
    const [otpValue, setOtpValue] = useState('');
    const [maskedPhone, setMaskedPhone] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [cooldown, setCooldown] = useState(0);
    const [impersonateId, setImpersonateId] = useState('');

    const { login, stopImpersonating, logout } = useUser();

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
        stopImpersonating();
        logout();

        const phone = form.getValues('phone');
        setPhoneNumber(phone);

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
                    otp_code: otpValue
                })
            });

            const data = await response.json();

            if (!response.ok) {
                // Check if we need to redirect to Gmail link
                if (data.shouldRedirectToGmail) {
                    toast.info('Please sign on as a member first.');
                    router.push('/gmail-link');

                    return;
                }
                throw new Error(data.error || 'Invalid verification code');
            }

            if (data.success) {
                if (impersonateId) {
                    login(data.token, data.customer_id, impersonateId);
                } else {
                    login(data.token, data.customer_id);
                }

                toast.success('Login successful');
                if (redirectUrl) {
                    router.push(redirectUrl);
                } else {
                    router.push('/user-rps');
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

    return (
        <div
            className={cn(
                'perspective-1000 relative',
                isFlipped && 'h-[350px]',
                !isFlipped && 'h-[270px]',
                showImpersonate && isFlipped && 'h-[380px]',

                'w-full max-w-[400px] transition-all duration-500'
            )}>
            <div className='relative top-2 left-1/2 -mt-36 flex max-w-[250px] -translate-x-1/2 items-center gap-2 pb-18'>
                <IconNewWhite />
            </div>
            <AnimatePresence>
                {!isFlipped ? (
                    <motion.div
                        key='front'
                        className='absolute h-full w-full rounded-2xl bg-white p-8 drop-shadow-md'
                        variants={cardVariants}
                        initial='front'
                        animate='front'
                        exit='hidden'
                        style={{ backfaceVisibility: 'hidden', transformStyle: 'preserve-3d' }}>
                        <div className='flex h-full w-full flex-col gap-4'>
                            <h2 className='text-2xl font-bold'>Please enter your phone number</h2>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onPhoneSubmit)} className='flex flex-col gap-4'>
                                    <PhoneInput
                                        control={form.control}
                                        name='phone'
                                        label='Phone Number'
                                        onCountryChange={handleCountryChange}
                                        className='h-12 w-full rounded-l-none'
                                    />
                                    <Button
                                        type='submit'
                                        className='w-full rounded-full bg-[#1DC167]'
                                        disabled={isLoading || cooldown > 0}>
                                        {isLoading
                                            ? 'Sending...'
                                            : cooldown > 0
                                              ? `Wait ${formatCooldown()}`
                                              : 'Continue'}
                                    </Button>
                                </form>
                            </Form>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key='back'
                        className='absolute h-full w-full rounded-2xl bg-white p-8 drop-shadow-md'
                        variants={cardVariants}
                        initial='hidden'
                        animate='front'
                        exit='back'
                        style={{ backfaceVisibility: 'hidden', transformStyle: 'preserve-3d' }}>
                        <div className='flex h-full w-full flex-col gap-4'>
                            <h2 className='text-2xl font-bold'>Verify Your Number</h2>
                            <p className='text-sm text-neutral-600'>Enter the code sent to {maskedPhone}</p>
                            <div className='mt-4'>
                                <InputOTP
                                    maxLength={6}
                                    value={otpValue}
                                    onChange={setOtpValue}
                                    containerClassName='justify-center gap-2'>
                                    <InputOTPGroup>
                                        {Array.from({ length: 6 }).map((_, i) => (
                                            <InputOTPSlot key={i} index={i} className='size-11 text-xl font-bold' />
                                        ))}
                                    </InputOTPGroup>
                                </InputOTP>
                            </div>
                            {/* Show impersonate input if enabled */}
                            {showImpersonate && (
                                <Input
                                    type='text'
                                    placeholder='Impersonate User Id'
                                    value={impersonateId}
                                    onChange={(e) => setImpersonateId(e.target.value)}
                                    className='mt-4 h-16 rounded-md border border-neutral-300 p-2 px-4 text-sm'
                                />
                            )}
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
