/**
 * Analytics helper functions for tracking events
 */
import { trackLuckyOrangeGlobalEvent } from '@/components/analytics/analytics';

/**
 * Track an event in Lucky Orange with optional metadata
 * This function ensures Lucky Orange is ready before tracking
 *
 * @param eventName - The name of the event to track
 * @param metadata - Optional metadata to include with the event
 */
export function trackLuckyOrangeEvent(eventName: string, metadata?: Record<string, any>): void {
    // Use the global tracking function from the analytics component
    trackLuckyOrangeGlobalEvent(eventName, metadata);
}

/**
 * Disable debug mode for Lucky Orange
 */
export function disableLuckyOrangeDebug(): void {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem('debug');
    console.log('[LuckyOrange] Debug mode disabled');
}

// Add TypeScript declaration for window.LOQ
declare global {
    interface Window {
        LOQ: any[];
    }
}
