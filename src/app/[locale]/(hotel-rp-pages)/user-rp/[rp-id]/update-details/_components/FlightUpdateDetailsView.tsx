'use client';

import { useRouter } from 'next/navigation';

import { Booking, FlightPayload } from '@/app/api/rp-trips/route';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useUser } from '@/contexts/UserContext';

import { useForm } from 'react-hook-form';

interface FlightUpdateForm {
    departure_date: string;
    return_date: string;
    departure_airport: string;
    arrival_airport: string;
    outbound_flight_numbers: string[];
    return_flight_numbers: string[];
    passenger: {
        first_name: string;
        last_name: string;
        date_of_birth: string;
        citizenship: string;
    };
}

interface FlightUpdateDetailsViewProps {
    trip?: Booking & { payload: FlightPayload };
}

export default function FlightUpdateDetailsView({ trip }: FlightUpdateDetailsViewProps) {
    const router = useRouter();
    const { user } = useUser();

    const form = useForm<FlightUpdateForm>({
        defaultValues: {
            departure_date: trip?.payload.departure_date || '',
            return_date: trip?.payload.arrival_date || '',
            departure_airport: trip?.payload.departure_airport_iata_code || '',
            arrival_airport: trip?.payload.arrival_airport_iata_code || '',
            outbound_flight_numbers: trip?.payload.outbound_flight_numbers || [],
            return_flight_numbers: trip?.payload.return_flight_numbers || [],
            passenger: {
                first_name: user?.first_name || '',
                last_name: user?.last_name || '',
                date_of_birth: user?.date_of_birth || '',
                citizenship: user?.citizenship || ''
            }
        }
    });

    const onSubmit = async (data: FlightUpdateForm) => {
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
                                name='departure_date'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Departure Date</FormLabel>
                                        <FormControl>
                                            <Input type='date' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='return_date'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Return Date</FormLabel>
                                        <FormControl>
                                            <Input type='date' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    {/* Destination Section */}
                    <div className='space-y-4'>
                        <h3 className='text-lg font-semibold'>Destination</h3>
                        <div className='grid gap-4'>
                            <FormField
                                control={form.control}
                                name='departure_airport'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>From (Departure Airport)</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder='SFO' />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='arrival_airport'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>To (Arrival Airport)</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder='JFK' />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    {/* Passenger Section */}
                    <div className='space-y-4'>
                        <h3 className='text-lg font-semibold'>Passenger Details</h3>
                        <div className='grid gap-4'>
                            <FormField
                                control={form.control}
                                name='passenger.first_name'
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
                                name='passenger.last_name'
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
                                name='passenger.date_of_birth'
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
                                name='passenger.citizenship'
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
