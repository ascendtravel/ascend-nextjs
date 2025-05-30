'use client';

import React, { useEffect, useState } from 'react';

import { FRAMER_LINKS } from '@/config/navigation';
import { EventLists, trackLuckyOrangeEvent } from '@/lib/analytics';
import { cn } from '@/lib/utils';
import { CheckoutProvider, PaymentElement, useCheckout } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import { Loader2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

// Initialize Stripe with your publishable key
const stripe = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface StripePaymentIntegrationProps {
    state_id: string;
    referral_code?: string;
    onPaymentSuccess?: () => void;
    onPaymentError?: (error: any) => void;
    forceHeight?: (height: string | null) => void;
    clientSecret?: string | null;
    desktop?: boolean;
}

// Payment Form Component
const PaymentForm = ({
    onPaymentSuccess,
    onPaymentError
}: {
    onPaymentSuccess?: () => void;
    onPaymentError?: (error: any) => void;
}) => {
    const checkout = useCheckout();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [promoCode, setPromoCode] = useState('');
    const [promoLoading, setPromoLoading] = useState(false);
    const [promoError, setPromoError] = useState<string | null>(null);
    const [promoSuccess, setPromoSuccess] = useState<string | null>(null);

    const { applyPromotionCode, removePromotionCode } = checkout || {};

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!checkout) {
            setError('Checkout not initialized');

            return;
        }

        setLoading(true);
        setError(null);

        try {
            const result = await checkout.confirm();

            if (result.type === 'error') {
                setError(result.error.message);
                onPaymentError?.(result.error);
            } else {
                onPaymentSuccess?.();
            }
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred');
            onPaymentError?.(err);
        } finally {
            setLoading(false);
        }
    };

    const handleApplyPromoCode = async () => {
        if (!applyPromotionCode || !promoCode.trim()) return;

        setPromoLoading(true);
        setPromoError(null);
        setPromoSuccess(null);

        try {
            const result = await applyPromotionCode(promoCode.trim());

            if (result.type === 'error') {
                setPromoError(result.error.message || 'Invalid promotion code');
            } else {
                setPromoSuccess('Promotion code applied successfully!');
            }
        } catch (err: any) {
            setPromoError(err.message || 'Failed to apply promotion code');
        } finally {
            setPromoLoading(false);
        }
    };

    const handleRemovePromoCode = async () => {
        if (!removePromotionCode) return;

        setPromoLoading(true);
        setPromoError(null);
        setPromoSuccess(null);

        try {
            await removePromotionCode();
            setPromoSuccess(null);
        } catch (err: any) {
            setPromoError(err.message || 'Failed to remove promotion code');
        } finally {
            setPromoLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className='space-y-6'>
            <div>
                <label className='mb-3 block text-sm font-medium text-gray-700'>Payment Details</label>
                <PaymentElement
                    options={{
                        layout: 'tabs',
                        terms: {
                            card: 'auto',
                            cashapp: 'always',
                            googlePay: 'always',
                            usBankAccount: 'always'
                        }
                    }}
                />

                <div className='mt-4 flex flex-row items-center justify-center gap-2'>
                    <a
                        href={FRAMER_LINKS.privacy}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='font-figtree text-base text-neutral-600 underline transition-colors hover:text-neutral-900'>
                        Privacy Policy
                    </a>
                    <span className='font-figtree pb-2 text-base'>.</span>
                    <a
                        href={FRAMER_LINKS.terms}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='font-figtree text-base text-neutral-600 underline transition-colors hover:text-neutral-900'>
                        Terms of Service
                    </a>
                </div>

                {/* Promotion Code Section */}
                <div className='mt-4 space-y-3'>
                    <label className='block text-sm font-medium text-gray-700'>Promotion Code</label>
                    <div className='flex gap-2'>
                        <input
                            type='text'
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            placeholder='Enter promotion code'
                            disabled={promoLoading || !!promoSuccess}
                            className={cn(
                                'flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100',
                                promoSuccess && 'bg-gray-100 ring-1 ring-[#17AA59]'
                            )}
                        />
                        {!promoSuccess && !promoLoading && (
                            <button
                                type='button'
                                onClick={handleApplyPromoCode}
                                disabled={promoLoading || !promoCode.trim()}
                                className='rounded-md bg-[#17aa59]/80 px-4 py-2 text-sm font-medium text-white hover:bg-[#17aa59]/80 focus:ring-2 focus:ring-[#17aa59]/80 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50'>
                                Apply
                            </button>
                        )}

                        {promoLoading && (
                            <button
                                type='button'
                                onClick={handleApplyPromoCode}
                                disabled={promoLoading || !promoCode.trim()}
                                className='rounded-md bg-[#17aa59]/80 px-4 py-2 text-sm font-medium text-white hover:bg-[#17aa59]/80 focus:ring-2 focus:ring-[#17aa59]/80 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50'>
                                <Loader2 className='size-4 animate-spin' />
                            </button>
                        )}

                        {promoSuccess && (
                            <div className='flex items-center justify-between text-sm text-green-600'>
                                <button
                                    type='button'
                                    onClick={handleRemovePromoCode}
                                    disabled={promoLoading}
                                    className='rounded-md bg-red-400 p-2 text-sm font-medium text-white shadow-md hover:bg-red-500/80 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50'>
                                    <Trash2 className='size-4' />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Promotion Code Messages */}
                    {promoError && <p className='text-sm text-red-600'>{promoError}</p>}
                </div>
            </div>

            {checkout?.total &&
                (() => {
                    try {
                        const totalAmount = checkout.total.total;
                        if (totalAmount && 'amount' in totalAmount) {
                            const formattedAmount = (totalAmount as any).amount;
                            const minorUnitsAmount = (totalAmount as any).minorUnitsAmount;

                            // Use the already formatted amount if available
                            if (typeof formattedAmount === 'string' && formattedAmount.includes('$')) {
                                return (
                                    <div className='rounded-lg border bg-gray-50 px-4 py-2'>
                                        <div className='flex items-center justify-between'>
                                            <span className='font-medium text-gray-700'>Total:</span>
                                            <span className='text-lg font-bold text-gray-900'>
                                                {formattedAmount}/year
                                            </span>
                                        </div>
                                    </div>
                                );
                            }

                            // Fallback to minorUnitsAmount if available
                            if (typeof minorUnitsAmount === 'number' && !isNaN(minorUnitsAmount)) {
                                return (
                                    <div className='rounded-lg border bg-gray-50 px-4 py-2'>
                                        <div className='flex items-center justify-between'>
                                            <span className='font-medium text-gray-700'>Total:</span>
                                            <span className='text-lg font-bold text-gray-900'>
                                                ${(minorUnitsAmount / 100).toFixed(0)}/year
                                            </span>
                                        </div>
                                    </div>
                                );
                            }
                        }
                    } catch (error) {
                        console.error('Error displaying total:', error);
                    }

                    return null; // Don't show total if we can't access it
                })()}

            {error && (
                <div className='rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700'>
                    <p className='text-sm'>{error}</p>
                </div>
            )}

            <button
                type='submit'
                disabled={loading || !checkout}
                className='w-full rounded-full bg-[#17AA59] px-4 py-3 font-medium text-white transition-colors hover:bg-[#17AA59]/80 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50'>
                {loading ? (
                    <div className='flex items-center justify-center'>
                        <div className='mr-2 h-5 w-5 animate-spin rounded-full border-b-2 border-white'></div>
                        Processing...
                    </div>
                ) : (
                    'Complete Payment'
                )}
            </button>
        </form>
    );
};

// Main Stripe Payment Integration Component
const StripePaymentIntegration: React.FC<StripePaymentIntegrationProps> = ({
    state_id,
    referral_code,
    clientSecret: initialClientSecret,
    onPaymentSuccess,
    onPaymentError,
    forceHeight,
    desktop = false
}) => {
    const [clientSecret, setClientSecret] = useState<string | null>(initialClientSecret || null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);

    // For mobile: fetch client secret immediately when component renders (if not provided)
    // For desktop: client secret is usually provided via props from parent
    useEffect(() => {
        if (!desktop && !clientSecret && !loading && !hasAttemptedFetch && !error) {
            setHasAttemptedFetch(true);
            fetchClientSecret();
        }
    }, [desktop, clientSecret]); // Removed loading from dependencies to prevent infinite loop

    // Function to fetch client secret from your API
    const fetchClientSecret = async (): Promise<string> => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('/api/checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    state_id,
                    return_url: `${window.location.origin}/welcome?step=4&state_id=${state_id}`,
                    live_mode: true,
                    ...(referral_code ? { referral_code } : {})
                })
            });

            if (!response.ok) {
                throw new Error('Failed to create checkout session');
            }

            const data = await response.json();

            if (!data.checkout_session_client_secret) {
                throw new Error('No client secret received');
            }

            setClientSecret(data.checkout_session_client_secret);

            return data.checkout_session_client_secret;
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to initialize payment';
            setError(errorMessage);
            console.error('Stripe checkout session error:', err);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleStartSaving = () => {
        trackLuckyOrangeEvent(EventLists.payment_layover.name, {
            description: EventLists.payment_layover.description
        });

        // For mobile: only open sheet if we have clientSecret
        if (!desktop && clientSecret) {
            setIsSheetOpen(true);
            forceHeight?.('calc(100vh - 3.5rem)');
        }

        // For desktop: this shouldn't be called since desktop shows payment form immediately
        if (desktop && !clientSecret && !loading) {
            setHasAttemptedFetch(true);
            fetchClientSecret();
        }
    };

    const handleRetry = () => {
        setError(null);
        setHasAttemptedFetch(false);
        fetchClientSecret();
    };

    // Desktop logic: Always show the payment form (open state)
    if (desktop) {
        // If we have clientSecret, show the payment form
        if (clientSecret) {
            return (
                <div className='flex h-full w-full flex-col'>
                    <div className='flex min-h-0 flex-1 flex-col overflow-x-hidden'>
                        <div className='flex items-center justify-between px-4'>
                            <h3 className='my-4 text-center text-lg font-semibold text-neutral-700'>
                                Let's go <span className='text-neutral-500'>🎉</span>
                            </h3>
                        </div>
                        <div className='-mr-6 flex-1 overflow-y-auto px-2 py-4 pr-10 pb-12 pl-4'>
                            <div className='mx-auto max-w-md space-y-6'>
                                <CheckoutProvider
                                    stripe={stripe}
                                    options={{
                                        fetchClientSecret: () => Promise.resolve(clientSecret || ''),
                                        elementsOptions: {
                                            appearance: {
                                                theme: 'stripe',
                                                variables: {
                                                    colorPrimary: '#006dbc'
                                                }
                                            }
                                        }
                                    }}>
                                    <PaymentForm onPaymentSuccess={onPaymentSuccess} onPaymentError={onPaymentError} />
                                </CheckoutProvider>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else {
            fetchClientSecret();

            return (
                <div className='flex h-full w-full flex-col'>
                    <div className='flex min-h-0 flex-1 flex-col'>
                        <div className='flex flex-1 items-center justify-center px-2 py-4'>
                            <div className='w-full max-w-xs rounded-full bg-[#17AA59] px-12 py-3 text-base font-medium text-white shadow-md transition-colors hover:bg-[#17AA59]/80 disabled:cursor-not-allowed disabled:opacity-50'>
                                Initializing Stripe...
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }

    // Mobile logic: Show button first, then sheet only when clientSecret is ready AND button is clicked

    // Mobile: Sheet is not open - show button
    if (!isSheetOpen) {
        return (
            <div className='flex h-full w-full flex-col'>
                <div className='flex min-h-0 flex-1 flex-col'>
                    <div className='flex flex-1 items-center justify-center'>
                        {!error && !loading && clientSecret && (
                            <button
                                onClick={handleStartSaving}
                                disabled={loading || (!clientSecret && !error)}
                                className='w-full max-w-xs rounded-full bg-[#17AA59] px-12 py-3 text-center text-base font-bold text-white shadow-md transition-colors hover:bg-[#17AA59]/80 disabled:cursor-not-allowed disabled:opacity-50'>
                                {loading
                                    ? 'Loading...'
                                    : error
                                      ? 'Error - Tap to retry'
                                      : !clientSecret
                                        ? 'Preparing...'
                                        : 'Get my free week'}
                            </button>
                        )}
                        {error && !loading && (
                            <div className='mt-2 text-center'>
                                <button
                                    onClick={handleRetry}
                                    className='w-full max-w-xs rounded-full bg-[#17AA59] px-12 py-3 text-center text-base font-medium text-white shadow-md transition-colors hover:bg-[#17AA59]/80 disabled:cursor-not-allowed disabled:opacity-50'>
                                    Retry loading payment
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Mobile: Sheet is open but there's an error
    if (error) {
        return (
            <div className='flex h-full w-full flex-col'>
                <div className='flex min-h-0 flex-1 flex-col overflow-x-hidden'>
                    <div className='flex items-center justify-between px-4'>
                        <h3 className='my-4 text-center text-lg font-semibold text-neutral-700'>Payment Error</h3>
                        <div className='flex size-8 items-center justify-center'>
                            <button
                                onClick={() => {
                                    forceHeight?.(null);
                                    setIsSheetOpen(false);
                                    setError(null);
                                }}
                                className='text-neutral-600 hover:text-neutral-900'>
                                ✕
                            </button>
                        </div>
                    </div>
                    <div className='flex flex-1 items-center justify-center px-4 py-4'>
                        <div className='text-center'>
                            <button
                                onClick={handleRetry}
                                className='rounded-full bg-[#17AA59] px-8 py-2 text-white hover:bg-[#17AA59]/80'>
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Mobile: Sheet is open and we have clientSecret - show payment form
    if (!clientSecret) {
        return (
            <div className='flex h-full w-full flex-col'>
                <div className='flex min-h-0 flex-1 flex-col'>
                    <div className='flex flex-1 items-center justify-center px-2 py-4'>
                        <div className='text-center'>
                            <p className='mb-4'>Unable to initialize payment</p>
                            <button
                                onClick={handleRetry}
                                className='rounded-full bg-[#17AA59] px-8 py-2 text-white hover:bg-[#17AA59]/80'>
                                Retry
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Mobile: Sheet is open with valid clientSecret - show payment form
    return (
        <div className='flex h-full w-full flex-col'>
            {/* Outer container that expands */}
            <div className='flex min-h-0 flex-1 flex-col overflow-x-hidden'>
                <div className='flex items-center justify-between px-4'>
                    <h3 className='my-4 text-center text-lg font-semibold text-neutral-700'>
                        Let's go <span className='text-neutral-500'>🎉</span>
                    </h3>
                    <div className='flex size-8 items-center justify-center'></div>
                </div>
                {/* Inner scrollable container */}
                <div className='-mr-6 flex-1 overflow-y-auto px-2 py-4 pr-10 pb-12 pl-4'>
                    <div className='mx-auto max-w-md space-y-6'>
                        <CheckoutProvider
                            stripe={stripe}
                            options={{
                                fetchClientSecret: () => Promise.resolve(clientSecret || ''),
                                elementsOptions: {
                                    appearance: {
                                        theme: 'stripe',
                                        variables: {
                                            colorPrimary: '#006dbc'
                                        }
                                    }
                                }
                            }}>
                            <PaymentForm onPaymentSuccess={onPaymentSuccess} onPaymentError={onPaymentError} />
                        </CheckoutProvider>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StripePaymentIntegration;
