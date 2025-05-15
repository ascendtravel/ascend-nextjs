'use client';

import { useEffect, useRef, useState } from 'react';

import Link from 'next/link';

import IconHotelBed from '@/components/Icon/IconHotelBed';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';
import Intercom from '@intercom/messenger-js-sdk';

import RpFooterSection from '../../_components/RpFooterSection';
import { UserRpsWelcomeMap } from './UserRpsWelcomeMap';
import WelcomeGreenBedIcon from './WelcomeGreenBedIcon';
import { WelcomeWhatsNext } from './WelcomeWhatsNext';
import ReactConfetti from 'react-confetti';

export function UserRpsWelcomeView() {
    const { user } = useUser();

    const [showConfetti, setShowConfetti] = useState(true);
    const [welcomeAnimationActive, setWelcomeAnimationActive] = useState(false);
    const [sheetHeight, setSheetHeight] = useState('20%');
    const [isFullyExpanded, setIsFullyExpanded] = useState(false);
    const sheetRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const startY = useRef(0);
    const currentY = useRef(0);

    Intercom({
        app_id: process.env.NEXT_PUBLIC_INTERCOM_APP_ID ?? '',
        user_id: user?.id ?? '',
        name: user?.first_name ?? 'Traveler',
        ...(user?.main_email && { email: user?.main_email })
    });

    useEffect(() => {
        setWelcomeAnimationActive(true);

        // Hide confetti after 5 seconds
        const timer = setTimeout(() => {
            setShowConfetti(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    // Update isFullyExpanded state when sheet height changes
    useEffect(() => {
        setIsFullyExpanded(sheetHeight === '80%');
    }, [sheetHeight]);

    // Handle touch events for sheet swipe
    const handleTouchStart = (e: React.TouchEvent) => {
        // Prevent default to avoid map scrolling
        e.preventDefault();
        e.stopPropagation();

        startY.current = e.touches[0].clientY;
        currentY.current = startY.current;

        if (sheetRef.current) {
            sheetRef.current.style.transition = 'none';
        }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        // Prevent default to avoid map scrolling
        e.preventDefault();
        e.stopPropagation();

        if (!sheetRef.current) return;

        const touchY = e.touches[0].clientY;
        const diff = currentY.current - touchY;
        currentY.current = touchY;

        const currentHeight = sheetRef.current.getBoundingClientRect().height;
        const windowHeight = window.innerHeight;
        const newHeight = currentHeight + diff;

        // Limit sheet height between 20% and 80% of screen height
        if (newHeight >= windowHeight * 0.2 && newHeight <= windowHeight * 0.8) {
            sheetRef.current.style.height = `${newHeight}px`;
        }
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        // Prevent default to avoid map scrolling
        e.preventDefault();
        e.stopPropagation();

        if (!sheetRef.current) return;

        sheetRef.current.style.transition = 'height 0.3s ease';
        const currentHeight = sheetRef.current.getBoundingClientRect().height;
        const windowHeight = window.innerHeight;

        // Snap to 20%, 50% or 80% depending on current height
        if (currentHeight < windowHeight * 0.35) {
            setSheetHeight('20%');
        } else if (currentHeight < windowHeight * 0.65) {
            setSheetHeight('50%');
        } else {
            setSheetHeight('80%');
        }
    };

    // For mouse users
    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();

        const dragHandle = e.currentTarget as HTMLDivElement;
        const sheet = sheetRef.current;
        if (!sheet) return;

        sheet.style.transition = 'none';
        const startY = e.clientY;

        const handleMouseMove = (moveEvent: MouseEvent) => {
            moveEvent.preventDefault();
            const diff = startY - moveEvent.clientY;

            const currentHeight = sheet.getBoundingClientRect().height;
            const windowHeight = window.innerHeight;
            const newHeight = currentHeight + diff;

            if (newHeight >= windowHeight * 0.2 && newHeight <= windowHeight * 0.8) {
                sheet.style.height = `${newHeight}px`;
            }
        };

        const handleMouseUp = (upEvent: MouseEvent) => {
            upEvent.preventDefault();

            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);

            sheet.style.transition = 'height 0.3s ease';
            const currentHeight = sheet.getBoundingClientRect().height;
            const windowHeight = window.innerHeight;

            if (currentHeight < windowHeight * 0.35) {
                setSheetHeight('20%');
            } else if (currentHeight < windowHeight * 0.65) {
                setSheetHeight('50%');
            } else {
                setSheetHeight('80%');
            }
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    return (
        <div className='relative h-full w-full overflow-hidden rounded-t-2xl bg-[#006DBC]'>
            <div ref={mapContainerRef} className='pointer-events-none absolute inset-0 h-full w-full bg-[#006DBC]'>
                {showConfetti && (
                    <ReactConfetti
                        className='fixed inset-0 z-50'
                        numberOfPieces={400}
                        recycle={showConfetti}
                        gravity={0.1}
                        colors={['#1DC167', '#006DBC', '#5AA6DA', '#FFD700', '#FF69B4']}
                        tweenDuration={200}
                    />
                )}
                <div className='relative h-full w-full overflow-hidden'>
                    <UserRpsWelcomeMap />
                </div>
            </div>

            {/* Bottom Sheet */}
            <div
                ref={sheetRef}
                className='absolute right-0 bottom-0 left-0 z-10 rounded-t-2xl bg-white shadow-lg transition-all duration-300'
                style={{ height: sheetHeight }}>
                {/* Drag Handle - Separate element for better touch/click handling */}
                <div
                    className='absolute inset-x-0 top-0 z-20 h-12 cursor-grab active:cursor-grabbing'
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onMouseDown={handleMouseDown}>
                    <div className='flex w-full justify-center pt-3 pb-4'>
                        <div className='h-1 w-16 rounded-full bg-gray-300'></div>
                    </div>
                </div>

                {/* Sheet Content Container - Fixed position relative to sheet */}
                <div
                    className={`scrollbar-hide absolute inset-x-0 top-12 bottom-0 flex flex-col items-center justify-start gap-2 ${
                        isFullyExpanded ? 'overflow-y-auto' : 'overflow-hidden'
                    }`}
                    ref={contentRef}>
                    <WelcomeWhatsNext
                        componenHeader="Here's what to expect next:"
                        rowsInfo={[
                            {
                                content:
                                    "Keep traveling exactly how you do. We'll automatically monitor your bookings for opportunities to save you money."
                            },
                            {
                                content:
                                    "We'll notify you when we find an opportunity, and our team will keep you posted as we work to get a refund."
                            },
                            {
                                content: "You'll get your money back"
                            }
                        ]}
                    />
                    <div className='flex max-w-xs flex-col items-center justify-center gap-2 rounded-2xl border border-neutral-100 p-6 shadow-sm'>
                        <WelcomeGreenBedIcon />
                        <div className='text-lg font-semibold'>Members-Only Deals</div>
                        <div className='text-center text-sm text-neutral-800'>
                            Your membership includes members-only deals on hotels and flights, just message us your
                            destination and we'll handle the rest!
                        </div>
                        {/* <Link href='https://wa.me/14257280395' target='_blank'>
                            <Button className='rounded-full bg-[#1DC167] !px-12 py-3'>Message Us</Button>
                        </Link> */}
                        <div className='rounded-full py-3 text-center text-sm font-semibold text-neutral-700 drop-shadow-md'>
                            Touch the chat icon in the bottom right corner to message us!
                        </div>
                    </div>

                    <div className='w-full'>
                        <RpFooterSection />
                    </div>

                    <div className='flex w-full flex-col items-center justify-center gap-2 pt-6 pb-12'>
                        <span className='text-center text-sm font-semibold text-neutral-800'>
                            Your unique email for forwarding missing trips is
                        </span>
                        <span className='block text-center font-mono text-xs break-all select-all'>
                            {user?.main_phone}@reprice.ascend.travel
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
