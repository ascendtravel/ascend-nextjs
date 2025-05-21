'use client';

// Required for using hooks
import { useEffect, useState } from 'react';

import { OnboardingSteps } from '../_types';
import DesktopWelcomeView from './DesktopWelcomeView';
import MobileWelcomeView from './MobileWelcomeView';

export default function OnboardingWelcomeView(props: { predefinedStep?: OnboardingSteps }) {
    const [isMounted, setIsMounted] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false); // Default to false

    useEffect(() => {
        setIsMounted(true); // Component has mounted on the client

        const checkScreenSize = () => {
            setIsDesktop(window.innerWidth >= 768); // Tailwind's 'md' breakpoint is 768px
        };

        // Initial check
        checkScreenSize();

        // Listen for resize events
        window.addEventListener('resize', checkScreenSize);

        // Cleanup listener on component unmount
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []); // Empty dependency array ensures this runs only on mount and unmount

    if (!isMounted) {
        // To prevent hydration mismatch, render the mobile view by default on the server
        // and during the initial client render before the screen size check has run.
        // MobileWelcomeView accepts predefinedStep.
        return <MobileWelcomeView predefinedStep={props.predefinedStep} />;
    }

    if (isDesktop) {
        // DesktopWelcomeView no longer accepts predefinedStep, as it derives from URL directly
        return <DesktopWelcomeView />;
    } else {
        return <MobileWelcomeView predefinedStep={props.predefinedStep} />;
    }
}
