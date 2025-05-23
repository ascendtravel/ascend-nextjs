'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Separator } from '@/components/ui/separator';
import { CitizenshipSelector } from '@/components/ui/updated-citizenship-selector';
import { zodResolver } from '@hookform/resolvers/zod';

import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const profileSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    bday: z.string().regex(/^\d{2}-\d{2}-\d{4}$/, 'Please enter a valid date (MM-DD-YYYY)'),
    citizenship: z.string().min(1, 'Citizenship is required')
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export interface ApprovalInfoProp {
    first_name?: string;
    last_name?: string;
    bday?: string;
    citizenship?: string;
    [key: string]: any;
}

interface CompleteProfileViewProps {
    initialData: ApprovalInfoProp | null;
    sessionId: string;
}

export default function CompleteProfileView({ initialData, sessionId }: CompleteProfileViewProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const formatDateForDisplay = (date: string) => {
        if (!date) return '';
        const match = date.match(/^(\d{4})-(\d{2})-(\d{2})$/);

        return match ? `${match[2]}-${match[3]}-${match[1]}` : date;
    };

    const formatDateForAPI = (date: string) => {
        if (!date) return '';
        const match = date.match(/^(\d{2})-(\d{2})-(\d{4})$/);

        return match ? `${match[3]}-${match[1]}-${match[2]}` : date;
    };

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            firstName: initialData?.first_name || '',
            lastName: initialData?.last_name || '',
            bday: formatDateForDisplay(initialData?.bday || ''),
            citizenship: initialData?.citizenship || 'US'
        }
    });

    async function onSubmit(data: ProfileFormValues) {
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/hotel-rp/submit-approval-info', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    repricing_session_id: sessionId,
                    first_name: data.firstName,
                    last_name: data.lastName,
                    birthday: formatDateForAPI(data.bday),
                    citizenship: data.citizenship
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save profile');
            }

            const responseData = await response.json();

            if (!responseData.stripe_link_url) {
                throw new Error('No payment link received');
            }

            toast.success('Profile completed successfully');

            // For Stripe redirect we use window.location since it's an external URL
            window.location.href = responseData.stripe_link_url;
        } catch (error) {
            console.error('Error saving profile:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to save profile');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className='w-full max-w-[323px] rounded-xl bg-white p-8 shadow-lg'>
            <h1 className='mb-6 text-center text-2xl font-bold text-neutral-900'>Complete Your Profile</h1>
            <p className='mb-6 text-center text-neutral-600'>
                Please verify your information to complete your registration.
            </p>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                    <div className='grid grid-cols-2 gap-4'>
                        <FormField
                            control={form.control}
                            name='firstName'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder='First Name' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='lastName'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder='Last Name' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name='bday'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Date of Birth</FormLabel>
                                <FormControl>
                                    <div className='-ml-0.5 flex flex-col items-center gap-2'>
                                        <InputOTP
                                            maxLength={10}
                                            value={field.value}
                                            onChange={(value) => {
                                                let formatted = value.replace(/\D/g, '');
                                                if (formatted.length >= 2) {
                                                    formatted = formatted.slice(0, 2) + '-' + formatted.slice(2);
                                                }
                                                if (formatted.length >= 5) {
                                                    formatted = formatted.slice(0, 5) + '-' + formatted.slice(5);
                                                }
                                                formatted = formatted.slice(0, 10);
                                                field.onChange(formatted);
                                            }}
                                            containerClassName='gap-2'>
                                            <InputOTPGroup>
                                                <InputOTPSlot index={0} className='w-7.5' placeholder='M' />
                                                <InputOTPSlot
                                                    index={1}
                                                    className='mr-3 w-7.5 rounded-r-md'
                                                    placeholder='M'
                                                />
                                                <InputOTPSlot
                                                    index={3}
                                                    className='w-7.5 rounded-l-md'
                                                    placeholder='D'
                                                />
                                                <InputOTPSlot
                                                    index={4}
                                                    className='mr-3 w-7.5 rounded-r-md'
                                                    placeholder='D'
                                                />
                                                <InputOTPSlot
                                                    index={6}
                                                    className='w-7.5 rounded-l-md'
                                                    placeholder='Y'
                                                />
                                                <InputOTPSlot index={7} className='w-7.5' placeholder='Y' />
                                                <InputOTPSlot index={8} className='w-7.5' placeholder='Y' />
                                                <InputOTPSlot
                                                    index={9}
                                                    className='w-7.5 rounded-r-md'
                                                    placeholder='Y'
                                                />
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <CitizenshipSelector
                        control={form.control}
                        name='citizenship'
                        label='Citizenship'
                        defaultCountry={initialData?.citizenship || 'US'}
                    />

                    <Button
                        type='submit'
                        disabled={isSubmitting}
                        className='w-full rounded-full bg-[#1DC167] hover:bg-[#1DC167]/90'>
                        {isSubmitting ? 'Saving...' : 'Complete'}
                    </Button>
                </form>
            </Form>
        </div>
    );
}
