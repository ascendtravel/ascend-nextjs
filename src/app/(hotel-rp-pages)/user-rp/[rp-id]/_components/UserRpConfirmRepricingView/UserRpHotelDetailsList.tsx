import { QuoteProps } from '@/app/api/rp-trips/route';
import { Separator } from '@/components/ui/separator';
import { formatDateNoTZ } from '@/lib/date-formatters';
import { getCurrencyAndAmountText } from '@/lib/money';

import { format } from 'date-fns';

interface UserRpHotelDetailsListProps {
    totalGuests?: number;
    guests?: {
        name: string;
        age?: number;
        isChild: boolean;
    }[];
    roomsPersonCombos?: {
        roomType: string;
        adults: number;
        children: number;
    }[];
    checkInDate?: string;
    checkOutDate?: string;
    nightlyPrice?: number;
    nightlyPriceCurrency?: string;
    localTaxesAndFees?: string;
    totalPrice?: string;
    nights?: number;
    quoteData?: QuoteProps;
    savings?: string;
}

export default function UserRpHotelDetailsList({
    totalGuests,
    guests,
    roomsPersonCombos,
    checkInDate,
    checkOutDate,
    nightlyPrice,
    localTaxesAndFees,
    totalPrice,
    nights,
    nightlyPriceCurrency,
    quoteData,
    savings
}: UserRpHotelDetailsListProps) {
    function calcTotalPriceForAllNights() {
        if (!nightlyPrice || !nights) return 0;

        return nightlyPrice * nights;
    }

    return (
        <div className='mt-4 flex flex-col gap-4 px-4'>
            <div className='flex flex-row items-start justify-between'>
                <div className='text-left text-sm font-medium'>Guest(s)</div>
                <div className='flex flex-col items-end gap-2'>
                    <div className='text-sm'>
                        {totalGuests || 0} Guest{totalGuests && totalGuests > 1 ? 's' : ''}
                    </div>
                    {guests
                        ?.filter((guest) => !guest.isChild)
                        .map((guest) => (
                            <div key={guest.name} className='text-sm'>
                                {guest.name}
                            </div>
                        ))}
                    {guests && guests?.filter((guest) => guest.isChild).length > 0 && (
                        <div className='text-sm'>
                            {guests?.filter((guest) => guest.isChild).length} child
                            {guests?.filter((guest) => guest.isChild).length > 1 ? 'ren' : ''}
                        </div>
                    )}
                </div>
            </div>
            {roomsPersonCombos && roomsPersonCombos?.length > 0 && (
                <div className='flex flex-row items-start justify-between'>
                    <div className='text-left text-sm font-medium'>Rooms</div>
                    <div className='flex flex-col gap-2'>
                        {roomsPersonCombos?.map((combo) => (
                            <div key={combo.roomType} className='text-right text-sm'>
                                <div
                                    className={`${quoteData?.quote_room_type ? 'text-neutral-600 line-through' : 'font-semibold'}`}>
                                    {combo.roomType}
                                </div>
                                {quoteData && (
                                    <div className='text-right font-semibold'>{quoteData.quote_room_type}</div>
                                )}
                                <div className='text-right'>
                                    {combo.adults} adult{combo.adults > 1 ? 's' : ''}, {combo.children} child
                                    {combo.children > 1 ? 'ren' : ''}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {checkInDate && (
                <div className='flex flex-row items-center justify-between'>
                    <div className='text-left text-sm font-medium'>Check in</div>
                    <div className='text-right text-sm'>{formatDateNoTZ(checkInDate)}</div>
                </div>
            )}
            {checkOutDate && (
                <div className='flex flex-row items-center justify-between'>
                    <div className='text-left text-sm font-medium'>Check out</div>
                    <div className='text-right text-sm'>{formatDateNoTZ(checkOutDate)}</div>
                </div>
            )}
            {nightlyPrice && (
                <div className='flex flex-row items-center justify-between'>
                    <div className='text-left text-sm font-medium'>
                        Price for {nights} {nights === 1 ? 'Night' : 'Nights'}
                    </div>
                    <div className='text-right text-sm'>{`${getCurrencyAndAmountText(
                        {
                            amount: calcTotalPriceForAllNights(),
                            currency: nightlyPriceCurrency || 'USD'
                        },
                        true,
                        true
                    )}`}</div>
                </div>
            )}
            {localTaxesAndFees && (
                <div className='flex flex-row items-center justify-between'>
                    <div className='text-left text-sm font-medium'>Local Taxes and Fees</div>
                    <div className='text-right text-sm'>{localTaxesAndFees}</div>
                </div>
            )}
            {totalPrice && (
                <div className='flex flex-row items-center justify-between'>
                    <div className='text-left text-sm font-medium'>Total</div>
                    <div className='text-right text-sm'>{totalPrice}</div>
                </div>
            )}
            {savings && (
                <>
                    <Separator />
                    <div className='flex flex-row items-center justify-between font-semibold text-[#1DC167]'>
                        <div className='text-left text-sm font-medium'>Savings</div>
                        <div className='text-right text-sm'>{savings}</div>
                    </div>
                </>
            )}
        </div>
    );
}
