'use client';

import { useRouter } from 'next/navigation';

import BackGreenButton from '@/components/BackGreenButton';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Separator } from '@/components/ui/separator';
import { CitizenshipSelector } from '@/components/ui/updated-citizenship-selector';
import { zodResolver } from '@hookform/resolvers/zod';

import { useForm } from 'react-hook-form';
import * as z from 'zod';

const userInfoSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    bday: z.string().regex(/^\d{2}-\d{2}-\d{4}$/, 'Please enter a valid date (MM-DD-YYYY)'),
    citizenship: z.string().min(1, 'Citizenship is required')
});

type UserInfoFormValues = z.infer<typeof userInfoSchema>;

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
    const form = useForm<UserInfoFormValues>({
        resolver: zodResolver(userInfoSchema),
        defaultValues: {
            firstName: initialData?.first_name || '',
            lastName: initialData?.last_name || '',
            bday: initialData?.bday || '',
            citizenship: initialData?.citizenship || 'US'
        }
    });

    const handleSubmit = async (data: UserInfoFormValues) => {
        // Mock submit to delay 2 secs and then redirect
        setTimeout(() => {
            router.push(`/user-rp/${rpId}?view-state=ConfirmRepricing`);
        }, 2000);
    };

    return (
        <div className='absolute inset-0 mt-[72px] flex flex-col rounded-t-xl bg-neutral-50'>
            <div className='flex-1 px-6 pt-10'>
                <BackGreenButton
                    onClick={() => {
                        router.push('/user-rps/');
                    }}
                />
                <div className='text-xl font-bold'>How to get {'XAmount'} back:</div>
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

                                                        // If already have 8 digits, ignore additional inputs
                                                        if (
                                                            field.value.replace(/\D/g, '').length === 8 &&
                                                            formatted.length > 8
                                                        ) {
                                                            return;
                                                        }

                                                        // Handle formatting
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
                                                        field.onChange(formatted);
                                                    }}
                                                    containerClassName='gap-2'>
                                                    <InputOTPGroup>
                                                        <InputOTPSlot
                                                            index={0}
                                                            className='w-9.5 rounded-l-lg border-neutral-200 bg-white'
                                                        />
                                                        <InputOTPSlot
                                                            index={1}
                                                            className='mr-3 w-9.5 rounded-r-lg border-neutral-200 bg-white'
                                                        />
                                                        <InputOTPSlot
                                                            index={3}
                                                            className='w-9.5 rounded-l-lg border-neutral-200 bg-white'
                                                        />
                                                        <InputOTPSlot
                                                            index={4}
                                                            className='mr-3 w-9.5 rounded-r-lg border-neutral-200 bg-white'
                                                        />
                                                        <InputOTPSlot
                                                            index={6}
                                                            className='w-9.5 rounded-l-lg border-neutral-200 bg-white'
                                                        />
                                                        <InputOTPSlot
                                                            index={7}
                                                            className='w-9.5 border-neutral-200 bg-white'
                                                        />
                                                        <InputOTPSlot
                                                            index={8}
                                                            className='w-9.5 border-neutral-200 bg-white'
                                                        />
                                                        <InputOTPSlot
                                                            index={9}
                                                            className='w-9.5 rounded-r-lg border-neutral-200 bg-white'
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
