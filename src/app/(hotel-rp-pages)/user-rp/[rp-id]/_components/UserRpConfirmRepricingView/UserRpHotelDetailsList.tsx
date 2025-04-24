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
    localTaxesAndFees?: number;
    totalPrice?: number;
}

export default function UserRpHotelDetailsList({
    totalGuests,
    guests,
    roomsPersonCombos,
    checkInDate,
    checkOutDate,
    nightlyPrice,
    localTaxesAndFees,
    totalPrice
}: UserRpHotelDetailsListProps) {
    function calcTotalPriceForAllNights() {
        if (!nightlyPrice) return 0;

        const nights = nightsBetweenDates(checkInDate, checkOutDate);

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
                                <div className='text-right font-semibold'>{combo.roomType}</div>
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
                    <div className='text-right text-sm'>{checkInDate}</div>
                </div>
            )}
            {checkOutDate && (
                <div className='flex flex-row items-center justify-between'>
                    <div className='text-left text-sm font-medium'>Check out</div>
                    <div className='text-right text-sm'>{checkOutDate}</div>
                </div>
            )}
            {nightlyPrice && (
                <div className='flex flex-row items-center justify-between'>
                    <div className='text-left text-sm font-medium'>
                        Price for {nightsBetweenDates(checkInDate, checkOutDate)} Nights
                    </div>
                    <div className='text-right text-sm'>U${calcTotalPriceForAllNights()}</div>
                </div>
            )}
            {localTaxesAndFees && (
                <div className='flex flex-row items-center justify-between'>
                    <div className='text-left text-sm font-medium'>Local Taxes and Fees</div>
                    <div className='text-right text-sm'>U${localTaxesAndFees}1</div>
                </div>
            )}
            {totalPrice && (
                <div className='flex flex-row items-center justify-between'>
                    <div className='text-left text-sm font-medium'>Total</div>
                    <div className='text-right text-sm'>U${totalPrice}</div>
                </div>
            )}
        </div>
    );
}

function nightsBetweenDates(checkInDate: string | undefined, checkOutDate: string | undefined) {
    // fix is giving NaN
    if (!checkInDate || !checkOutDate) return 0;

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
}
