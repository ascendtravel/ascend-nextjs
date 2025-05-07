'use client';

import { useEffect, useState } from 'react';

import Image from 'next/image';

export default function AddGmailCheckboxCTA(
    props: { width?: number; height?: number; className?: string; showText?: boolean } = {
        width: 512,
        height: 300,
        className: 'w-full max-w-lg rounded-lg',
        showText: true
    }
) {
    const [isVisible, setIsVisible] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    // Set visibility after component mounts
    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <div className='mx-auto h-full w-full max-w-lg'>
            {props.showText && (
                <div className='font-figtree mt-4 w-full text-center text-xs font-light text-neutral-900/90 sm:text-sm'>
                    <span className='font-bold uppercase'>Important: </span>
                    <span>When connecting, remember to check the first checkbox as indicated below</span>
                </div>
            )}

            {/* Checkbox notice image with proper responsive container */}
            <div
                className={`relative w-full overflow-hidden rounded-lg transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                <Image
                    src='/images/notice-checkbox.webp'
                    alt='Checkbox selection guide for Gmail connection'
                    sizes='(max-width: 640px) 100vw, (max-width: 1024px) 512px, 512px'
                    className={`rounded-lg object-cover ${props.className}`}
                    priority={true}
                    width={props.width}
                    height={props.height}
                    onLoadingComplete={() => setImageLoaded(true)}
                    placeholder='blur'
                    blurDataURL='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRseHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/2wBDAR4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k='
                />
            </div>
        </div>
    );
}
