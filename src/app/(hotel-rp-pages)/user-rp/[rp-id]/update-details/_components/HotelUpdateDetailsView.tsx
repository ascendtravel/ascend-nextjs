'use client';

import { useRouter } from 'next/navigation';

import { Booking, HotelPayload } from '@/app/api/rp-trips/route';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useUser } from '@/contexts/UserContext';

import { useForm } from 'react-hook-form';

interface HotelUpdateForm {
    check_in_date: string;
    check_out_date: string;
    room_type: string;
    guest: {
        first_name: string;
        last_name: string;
        date_of_birth: string;
        citizenship: string;
    };
}

interface HotelUpdateDetailsViewProps {
    trip?: Booking & { payload: HotelPayload };
}

export default function HotelUpdateDetailsView({ trip }: HotelUpdateDetailsViewProps) {
    const router = useRouter();
    const { user } = useUser();

    console.log('room_type', trip?.payload.room_type);

    const form = useForm<HotelUpdateForm>({
        defaultValues: {
            check_in_date: trip?.payload.check_in_date || '',
            check_out_date: trip?.payload.check_out_date || '',
            room_type: trip?.payload.room_type || '',
            guest: {
                first_name: user?.first_name || '',
                last_name: user?.last_name || '',
                date_of_birth: user?.date_of_birth || '',
                citizenship: user?.citizenship || ''
            }
        }
    });

    const onSubmit = async (data: HotelUpdateForm) => {
        console.log('Form submitted:', data);
        // Mock submit for now
        alert('Changes saved!');
    };

    return (
        <div className='flex flex-col gap-4 px-4'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-6'>
                    {/* Dates Section */}
                    <div className='space-y-4'>
                        <h3 className='text-lg font-semibold'>Dates</h3>
                        <div className='grid gap-4'>
                            <FormField
                                control={form.control}
                                name='check_in_date'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Check-in Date</FormLabel>
                                        <FormControl>
                                            <Input type='date' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='check_out_date'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Check-out Date</FormLabel>
                                        <FormControl>
                                            <Input type='date' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    {/* Room Type Section */}
                    <div className='space-y-4'>
                        <h3 className='text-lg font-semibold'>Room Details</h3>
                        <FormField
                            control={form.control}
                            name='room_type'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Room Type</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder='DELUXE_KING' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Guest Section */}
                    <div className='space-y-4'>
                        <h3 className='text-lg font-semibold'>Guest Details</h3>
                        <div className='grid gap-4'>
                            <FormField
                                control={form.control}
                                name='guest.first_name'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>First Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='guest.last_name'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Last Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='guest.date_of_birth'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Date of Birth</FormLabel>
                                        <FormControl>
                                            <Input type='date' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='guest.citizenship'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Citizenship</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder='US' />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <Button
                        type='submit'
                        className='mt-4 mb-8 w-full rounded-full bg-[#1DC167] font-semibold text-white'>
                        Confirm Changes
                    </Button>
                </form>
            </Form>
        </div>
    );
}
