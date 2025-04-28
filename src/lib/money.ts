import { Booking } from '@/app/api/rp-trips/route';

export const getTripSavingsString = (trip: Booking | undefined, useCurrency: boolean) => {
    if (!trip) return '';

    if (trip.type === 'flight') {
        const savings = trip.payload.potential_savings_cents.amount;
        const currency = trip.payload.potential_savings_cents.currency;
        if (useCurrency) {
            return `${currency} ${formatCentAmount(savings || 0)}`;
        }

        return `${formatCentAmount(savings || 0)}`;
    }
    if (trip.type === 'hotel') {
        const savings = trip.payload.potential_savings_cents.amount;
        const currency = trip.payload.potential_savings_cents.currency;
        if (useCurrency) {
            return `${currency} ${formatCentAmount(savings || 0)}`;
        }

        return `${formatCentAmount(savings || 0)}`;
    }

    return '';
};

// formats cents to xxx,xxx.xx
export const formatCentAmount = (cents: number) => {
    return (cents / 100).toFixed(2);
};

export const getCurrencyAndAmountText = (currencyAndAmount: { amount: number | null; currency: string | null }) => {
    if (!currencyAndAmount.amount || !currencyAndAmount.currency) return '';

    return `${currencyAndAmount.currency} ${formatCentAmount(currencyAndAmount.amount)}`;
};
