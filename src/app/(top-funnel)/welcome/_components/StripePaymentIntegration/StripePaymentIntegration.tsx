'use client';

import React, { useEffect, useState } from 'react';

import { FRAMER_LINKS } from '@/config/navigation';
import { CheckoutProvider, PaymentElement, useCheckout } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

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
                <div className='flex flex-row items-center justify-center gap-2'>
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

    useEffect(() => {
        if (!clientSecret) {
            fetchClientSecret();
        }
    }, [clientSecret]);

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
                    live_mode: false, // Set to true for production
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
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (!desktop && (!clientSecret || !isSheetOpen)) {
        return (
            <div className='flex h-full w-full flex-col'>
                <div className='flex min-h-0 flex-1 flex-col'>
                    <div className='flex flex-1 items-center justify-center'>
                        <div
                            className='w-full max-w-xs rounded-full bg-[#17AA59] px-12 py-3 text-center text-base font-medium text-white shadow-md transition-colors hover:bg-[#17AA59]/80 disabled:cursor-not-allowed disabled:opacity-50'
                            role='button'
                            onClick={() => {
                                setIsSheetOpen(true);
                                forceHeight?.('80%');
                            }}>
                            Start saving now
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className='flex h-full w-full flex-col'>
                <div className='flex min-h-0 flex-1 flex-col'>
                    <div className='flex flex-1 items-center justify-center px-2 py-4'>
                        <div className='w-full max-w-xs rounded-full bg-[#17AA59] px-12 py-3 text-base font-medium text-white shadow-md transition-colors hover:bg-[#17AA59]/80 disabled:cursor-not-allowed disabled:opacity-50'>
                            Initializing payment...
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        toast.error(error);
    }

    return (
        <div className='flex h-full w-full flex-col'>
            {/* Outer container that expands */}
            <div className='flex min-h-0 flex-1 flex-col overflow-x-hidden'>
                <div className='flex items-center justify-between px-4'>
                    <h3 className='my-4 text-center text-lg font-semibold text-neutral-700'>
                        Let's go <span className='text-neutral-500'>🎉</span>
                    </h3>
                    <div className='flex size-8 items-center justify-center'>
                        {/* // role='button'
                        // onClick={() => {
                        //     forceHeight?.(null);
                        //     setIsSheetOpen(false);
                        //     console.log('clicked');
                        // }}> */}
                        {/* <XCircle className='h-5 w-5 cursor-pointer text-neutral-600' /> */}
                    </div>
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
