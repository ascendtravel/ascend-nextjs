'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { Booking } from '@/app/api/rp-trips/route';
import BackGreenButton from '@/components/BackGreenButton';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Separator } from '@/components/ui/separator';
import { CitizenshipSelector } from '@/components/ui/updated-citizenship-selector';
import { useTripsRp } from '@/contexts/TripsRpContext';
import { useUser } from '@/contexts/UserContext';
import { getTripSavingsString } from '@/lib/money';
import { zodResolver } from '@hookform/resolvers/zod';

import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const userInfoSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    bday: z.string().regex(/^\d{2}-\d{2}-\d{4}$/, 'Please enter a valid date (MM-DD-YYYY)'),
    citizenship: z.string().min(1, 'Citizenship is required')
});

type UserInfoFormValues = z.infer<typeof userInfoSchema>;

interface ApprovalInfo {
    first_name: string;
    last_name: string;
    birthday: string;
    citizenship: string;
    hotel_name?: string;
    hotel_address?: string;
    room_type?: string;
    prior_price?: number;
    new_price?: number;
    expected_returned_to_customer_amount?: number;
    cancelled_before?: string;
    is_expired?: boolean;
    faq_url?: string;
}

interface UserRpUserInfoInputViewProps {
    initialData?: {
        first_name?: string;
        last_name?: string;
        bday?: string;
        citizenship?: string;
    };
    rpId: string;
}

export default function UserRpUserInfoInputView({ initialData, rpId }: UserRpUserInfoInputViewProps) {
    const router = useRouter();
    const { getTrip } = useTripsRp();
    const { updateUser, user } = useUser();
    const trip = getTrip(rpId);

    const form = useForm<UserInfoFormValues>({
        resolver: zodResolver(userInfoSchema),
        defaultValues: {
            firstName: user?.first_name || '',
            lastName: user?.last_name || '',
            bday: user?.date_of_birth || '',
            citizenship: user?.citizenship || 'US'
        }
    });

    const handleSubmit = async (data: UserInfoFormValues) => {
        try {
            await updateUser({
                first_name: data.firstName,
                last_name: data.lastName,
                citizenship: data.citizenship ? data.citizenship : 'US',
                date_of_birth: data.bday
            });

            router.push(`/user-rp/${rpId}?view-state=ConfirmRepricing`);
        } catch (error) {
            console.error('Error updating user info:', error);
            toast.error('Failed to update user information');
        }
    };

    const validateDate = (value: string) => {
        // Remove non-digits
        const digits = value.replace(/\D/g, '');
        if (digits.length !== 8) return false;

        const month = parseInt(digits.slice(0, 2));
        const day = parseInt(digits.slice(2, 4));
        const year = parseInt(digits.slice(4));

        // Check month and day ranges
        if (month < 1 || month > 12) return false;
        if (day < 1 || day > 31) return false;

        // Check specific month lengths
        const monthLengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        // Adjust February for leap years
        if (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) {
            monthLengths[1] = 29;
        }
        if (day > monthLengths[month - 1]) return false;

        // Check reasonable year range (e.g., between 1900 and current year)
        const currentYear = new Date().getFullYear();
        if (year < 1900 || year > currentYear) return false;

        return true;
    };

    return (
        <div className='absolute inset-0 mt-[60px] flex flex-col rounded-t-xl bg-neutral-50'>
            <div className='flex-1 px-6 pt-4'>
                <BackGreenButton
                    onClick={() => {
                        router.push('/user-rps/');
                    }}
                    preventNavigation={true}
                />
                <div className='text-xl font-bold'>How to get {getTripSavingsString(trip, true)} back:</div>
                <div className='mb-6 text-sm'>First, confirm your traveler information to continue:</div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className='flex h-full flex-col'>
                        <div className='space-y-6'>
                            <div className='grid grid-cols-2 gap-4'>
                                <FormField
                                    control={form.control}
                                    name='firstName'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-sm font-medium text-neutral-700'>
                                                First Name
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder='First Name'
                                                    className='rounded-lg border-neutral-200 bg-white focus-visible:ring-[#1DC167]'
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className='text-xs' />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='lastName'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-sm font-medium text-neutral-700'>
                                                Last Name
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder='Last Name'
                                                    className='rounded-lg border-neutral-200 bg-white focus-visible:ring-[#1DC167]'
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className='text-xs' />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name='bday'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='text-sm font-medium text-neutral-700'>
                                            Date of Birth
                                        </FormLabel>
                                        <FormControl>
                                            <div className='-ml-0.5 flex flex-col items-center gap-2'>
                                                <InputOTP
                                                    maxLength={10}
                                                    value={field.value}
                                                    onChange={(value) => {
                                                        // Handle empty value
                                                        if (!value) {
                                                            field.onChange('');

                                                            return;
                                                        }

                                                        // Remove all non-digits
                                                        let formatted = value.replace(/\D/g, '');

                                                        // Format with dashes
                                                        if (formatted.length > 2) {
                                                            formatted =
                                                                formatted.slice(0, 2) + '-' + formatted.slice(2);
                                                        }
                                                        if (formatted.length > 5) {
                                                            formatted =
                                                                formatted.slice(0, 5) + '-' + formatted.slice(5);
                                                        }

                                                        // Limit to 10 characters (MM-DD-YYYY)
                                                        formatted = formatted.slice(0, 10);

                                                        // Validate date before setting
                                                        if (formatted.length === 10 && !validateDate(formatted)) {
                                                            form.setError('bday', {
                                                                type: 'manual',
                                                                message: 'Please enter a valid date'
                                                            });
                                                        } else {
                                                            form.clearErrors('bday');
                                                        }

                                                        field.onChange(formatted);
                                                    }}
                                                    containerClassName='gap-2'>
                                                    <InputOTPGroup>
                                                        <InputOTPSlot
                                                            index={0}
                                                            placeholder='M'
                                                            className='w-9.5 rounded-l-lg border-neutral-200 bg-white'
                                                        />
                                                        <InputOTPSlot
                                                            index={1}
                                                            className='mr-3 w-9.5 rounded-r-lg border-neutral-200 bg-white'
                                                            placeholder='M'
                                                        />
                                                        <InputOTPSlot
                                                            index={3}
                                                            placeholder='D'
                                                            className='w-9.5 rounded-l-lg border-neutral-200 bg-white'
                                                        />
                                                        <InputOTPSlot
                                                            index={4}
                                                            className='mr-3 w-9.5 rounded-r-lg border-neutral-200 bg-white'
                                                            placeholder='D'
                                                        />
                                                        <InputOTPSlot
                                                            index={6}
                                                            placeholder='Y'
                                                            className='w-9.5 rounded-l-lg border-neutral-200 bg-white'
                                                        />
                                                        <InputOTPSlot
                                                            index={7}
                                                            className='w-9.5 border-neutral-200 bg-white'
                                                            placeholder='Y'
                                                        />
                                                        <InputOTPSlot
                                                            index={8}
                                                            className='w-9.5 border-neutral-200 bg-white'
                                                            placeholder='Y'
                                                        />
                                                        <InputOTPSlot
                                                            index={9}
                                                            className='w-9.5 rounded-r-lg border-neutral-200 bg-white'
                                                            placeholder='Y'
                                                        />
                                                    </InputOTPGroup>
                                                </InputOTP>
                                            </div>
                                        </FormControl>
                                        <FormMessage className='text-xs' />
                                    </FormItem>
                                )}
                            />

                            <CitizenshipSelector
                                control={form.control}
                                name='citizenship'
                                label='Citizenship'
                                defaultCountry={initialData?.citizenship || 'US'}
                            />
                        </div>

                        <div>
                            <Separator className='my-6' />
                            <div className=''>
                                <Button
                                    type='submit'
                                    className='w-full rounded-full bg-[#1DC167] font-semibold hover:bg-[#1DC167]/90'>
                                    Continue
                                </Button>
                            </div>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}
