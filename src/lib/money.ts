import { Booking } from '@/app/api/rp-trips/route';

export const getTripSavingsString = (trip: Booking | undefined, useCurrency: boolean) => {
    if (!trip) return '';

    if (trip.type === 'flight') {
        const savings = trip.payload.potential_savings_cents.amount;
        const currency = trip.payload.potential_savings_cents.currency;
        if (useCurrency) {
            return `${currency} ${convertCentsToStringDollars(savings || 0)}`;
        }

        return `${convertCentsToStringDollars(savings || 0)}`;
    }
    if (trip.type === 'hotel') {
        const savings = trip.payload.potential_savings_cents.amount;
        const currency = trip.payload.potential_savings_cents.currency;
        if (useCurrency) {
            return `${currency} ${convertCentsToStringDollars(savings || 0)}`;
        }

        return `${convertCentsToStringDollars(savings || 0)}`;
    }

    return '';
};

// formats cents to xxx,xxx.xx
export const convertCentsToStringDollars = (cents: number) => {
    return (cents / 100).toFixed(2);
};
