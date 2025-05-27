// formats cents to xxx,xxx.xx
export const formatCentAmount = (cents: number, includeDecimals: boolean = true) => {
    const amount = cents / 100;
    if (!includeDecimals) {
        return Math.round(amount).toLocaleString('en-US', { maximumFractionDigits: 0 });
    }
    // Always use exactly 2 decimal places for currency

    return amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export const getCurrencyAndAmountText = (
    currencyAndAmount: { amount: number | null; currency: string | null },
    replaceUSDWithSymbol: boolean = true,
    includeDecimals: boolean = true // always 2 decimals
) => {
    if (!currencyAndAmount.amount || !currencyAndAmount.currency) return '';

    if (replaceUSDWithSymbol && currencyAndAmount.currency === 'USD') {
        return `$${formatCentAmount(currencyAndAmount.amount, includeDecimals)}`;
    }

    return `${currencyAndAmount.currency} $${formatCentAmount(currencyAndAmount.amount, includeDecimals)}`;
};
