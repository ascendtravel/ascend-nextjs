'use client';

import { useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { IconBadgeCheckFilled } from '@/components/Icon/IconBadgeCheckFilled';
import { WhatsApp } from '@/components/Icon/IconWhatsApp';

import GreenWhatsappIcon from '../_components/SvgAssets/GreenWhatsappIcon';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { toast } from 'sonner';

export default function NewMemberPage() {
    const { width, height } = useWindowSize();
    const [showConfetti, setShowConfetti] = useState(true);
    const [isMounted, setIsMounted] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const phoneNumber = '+1 (425) 728-0395';
    const phoneNumberRaw = '+14257280395';

    useEffect(() => {
        setIsMounted(true);
        // Check if device is mobile
        setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));

        const timer = setTimeout(() => {
            setShowConfetti(false);
        }, 5000);

        // Add scroll handler
        const handleScroll = () => {
            setShowConfetti(false);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleContactClick = () => {
        if (isMobile) {
            // For mobile devices, open the phone app with the number
            window.location.href = `tel:${phoneNumberRaw}`;
        } else {
            // For desktop, copy to clipboard
            navigator.clipboard
                .writeText(phoneNumber)
                .then(() => {
                    toast.success('Phone number copied to clipboard!');

                    return;
                })
                .catch(() => {
                    toast.error('Failed to copy phone number');
                });
        }
    };

    return (
        <>
            {isMounted && showConfetti && (
                <Confetti
                    className='fixed inset-0 z-50'
                    width={width || window.innerWidth}
                    height={height || window.innerHeight}
                    numberOfPieces={500}
                    recycle={true}
                    gravity={0.5}
                    colors={['#1DC167', '#006DBC', '#5AA6DA', '#FFD700', '#FF69B4']}
                    tweenDuration={5000}
                />
            )}
            <div className='flex flex-col items-center justify-center gap-8'>
                <div className='mt-8 max-w-[270px] pt-8 text-center text-2xl font-semibold text-neutral-50'>
                    Success! Message us on WhatsApp your travel dates to get deals:
                </div>

                <Link
                    href={`https://wa.me/${phoneNumberRaw}`}
                    className='text-md mb-8 flex items-center justify-center gap-2 rounded-full bg-neutral-50 px-8 py-3 text-center font-semibold text-neutral-900 transition-colors hover:bg-neutral-100'>
                    <GreenWhatsappIcon />
                    Message us on WhatsApp
                </Link>

                <div className='text-center text-sm text-neutral-50'>
                    You can also just add this number to your contacts:
                </div>

                <button
                    onClick={handleContactClick}
                    className='text-md flex items-center justify-center gap-2 rounded-full bg-neutral-50/20 px-6 py-2 text-center font-semibold text-neutral-50 transition-colors hover:bg-neutral-50/30'>
                    {phoneNumber}
                    <span className='text-xs'>{isMobile ? '(tap to add)' : '(tap to copy)'}</span>
                </button>

                <div className='mt-2 text-center text-xs text-neutral-50/70'>
                    {isMobile ? 'Tapping will open your phone app' : 'Number will be copied to your clipboard'}
                </div>
            </div>
        </>
    );
}
