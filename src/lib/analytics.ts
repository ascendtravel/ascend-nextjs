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

export function identifyUserByStateId(stateId: string) {
    if (typeof window === 'undefined') return;

    window.LOQ.push([
        'ready',
        async (LO: any) => {
            // Ensure visitor module is ready
            await LO.$internal.ready('visitor');

            // Identify the visitor to Lucky Orange using state id (visitor identification, not full user profile)
            LO.visitor.identify(stateId);

            console.log('[LuckyOrange] Visitor identified by state id', stateId);
        }
    ]);
}

export const EventLists = {
    takeoff: { name: 'takeoff', description: 'Loaded landing page' },
    began_boarding: { name: 'began_boarding', description: 'Clicked CTA on landing page' },
    gmail_layover: { name: 'gmail_layover', description: 'Clicked link my email' },
    phone_inflight: { name: 'phone_inflight', description: 'Clicked verify my phone' },
    phone_complete: { name: 'phone_complete', description: 'Phone verified' },
    payment_layover: { name: 'payment_layover', description: 'Clicked payment button' },
    landed: { name: 'landed', description: 'Arrived on signup success page' }
} as const;
