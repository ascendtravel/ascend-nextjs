/**
 * Date Formatting Utilities
 *
 * IMPORTANT: These functions are designed to format dates WITHOUT timezone adjustments.
 *
 * Problem: When using new Date() with date strings like "2025-05-27", JavaScript applies
 * the local timezone offset, which can cause dates to shift by a day depending on the timezone.
 *
 * Solution: These utilities preserve the exact date as provided in the input string,
 * ensuring that reservation dates and other important date values are displayed correctly
 * regardless of the user's timezone.
 */
import { format, parse } from 'date-fns';

/**
 * Formats a date string to a human-readable format without timezone adjustments
 *
 * @param dateStr - Date string in YYYY-MM-DD format
 * @param formatStr - Output format string (default: 'MMM d, yyyy')
 * @returns Formatted date string
 */
export function formatDateNoTZ(dateStr: string, formatStr: string = 'MMM d, yyyy'): string {
    if (!dateStr) return '';

    try {
        // Parse the date directly from the YYYY-MM-DD format without timezone conversion
        const parsedDate = parse(dateStr, 'yyyy-MM-dd', new Date());

        return format(parsedDate, formatStr);
    } catch (error) {
        console.error('Error formatting date:', error);

        return dateStr; // Return original string if parsing fails
    }
}

/**
 * Formats a date range with check-in and check-out dates
 *
 * @param checkInDate - Check-in date string in YYYY-MM-DD format
 * @param checkOutDate - Check-out date string in YYYY-MM-DD format
 * @returns Formatted date range string (e.g., "May 27, 2025 to Jun 1, 2025")
 */
export function formatDateRange(checkInDate: string, checkOutDate: string): string {
    const formattedCheckIn = formatDateNoTZ(checkInDate);
    const formattedCheckOut = formatDateNoTZ(checkOutDate);

    if (formattedCheckIn && formattedCheckOut) {
        return `${formattedCheckIn} to ${formattedCheckOut}`;
    }

    return '';
}
