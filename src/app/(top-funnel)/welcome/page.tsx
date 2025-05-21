import { Metadata } from 'next';

import OnboardingWelcomeView from './_components/OnboardingWelcomeView';
import { OnboardingSteps } from './_types';
import { generateWebPageSchema } from './_utils/json-ld.schema';

// Import the schema generator

// Define base URL for Open Graph images if you have one
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://ascend.travel'; // Replace with your actual base URL

export async function generateMetadata(props: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
    const params = await props.searchParams; // searchParams is already resolved here
    const step = params['step'] as string;

    // Default metadata for the initial welcome step (Step0)
    let title = 'Welcome to Ascend | Smart Travel Savings';
    let description =
        "Don't overpay for travel! Ascend watches your bookings and gets you money back when prices drop. Start saving in 3 easy steps.";
    // Use brand.png as the primary OG image
    const ogImage = `${BASE_URL}/brand.png`; // Assuming brand.png is in /public/brand.png
    let pageUrl = `${BASE_URL}/welcome`;

    // Potentially customize metadata based on other steps if this page handles multiple steps via query params
    const stepParamLower = step?.toLowerCase();
    let currentOnboardingStep: OnboardingSteps | undefined;

    if (stepParamLower === 'link' || stepParamLower === '1') {
        currentOnboardingStep = OnboardingSteps.Step1;
        title = 'Step 1: Link Your Email | Ascend Onboarding';
        description =
            'Connect your email to automatically import your travel bookings and start tracking for price drops with Ascend.';
        pageUrl = `${BASE_URL}/welcome?step=1`;
    } else if (stepParamLower === 'phone' || stepParamLower === '2') {
        currentOnboardingStep = OnboardingSteps.Step2;
        title = 'Step 2: Add Your Phone | Ascend Onboarding';
        description =
            'Add your phone number to get notified about savings and important updates for your travel bookings with Ascend.';
        pageUrl = `${BASE_URL}/welcome?step=2`;
    } else if (stepParamLower === 'subscription' || stepParamLower === '3') {
        currentOnboardingStep = OnboardingSteps.Step3;
        title = 'Step 3: Become a Member | Ascend Onboarding';
        description =
            'Complete your Ascend membership to unlock full access to automated travel savings and members-only deals.';
        pageUrl = `${BASE_URL}/welcome?step=3`;
    } else {
        currentOnboardingStep = OnboardingSteps.Step0;
    }

    return {
        title: title,
        description: description,
        openGraph: {
            title: title,
            description: description,
            type: 'website',
            url: pageUrl,
            images: [
                {
                    url: ogImage,
                    width: 1200, // Adjust if your brand.png has different dimensions
                    height: 630, // Standard OG image aspect ratio is 1.91:1
                    alt: 'Ascend Travel Logo'
                }
            ],
            // You can add site_name if it's relevant and not already handled globally
            siteName: 'Ascend Travel' // Or just 'Ascend'
        }
    };
}

export default async function OnboardingWelcomePage(props: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const params = await props.searchParams; // searchParams is already an object here
    const step = params['step'] as string;

    let initialStep: OnboardingSteps | undefined;
    if (step) {
        const stepParamLower = step.toLowerCase();
        if (stepParamLower === 'welcome' || stepParamLower === '0') {
            initialStep = OnboardingSteps.Step0;
        } else if (stepParamLower === 'link' || stepParamLower === '1') {
            initialStep = OnboardingSteps.Step1;
        } else if (stepParamLower === 'phone' || stepParamLower === '2') {
            initialStep = OnboardingSteps.Step2;
        } else if (stepParamLower === 'subscription' || stepParamLower === '3') {
            initialStep = OnboardingSteps.Step3;
        } else if (stepParamLower === 'trips' || stepParamLower === '4') {
            initialStep = OnboardingSteps.Step4;
        }
    } else {
        initialStep = OnboardingSteps.Step0; // Default to Step0 if no step param or invalid
    }

    // --- Generate JSON-LD ---
    // We need the title, description, url, etc. that were determined in generateMetadata or similarly here.
    // For consistency, let's re-evaluate or pass them. For this example, re-evaluating for clarity:
    let pageTitle = 'Welcome to Ascend | Smart Travel Savings';
    let pageDescription =
        "Don't overpay for travel! Ascend watches your bookings and gets you money back when prices drop. Start saving in 3 easy steps.";
    let pageUrl = `${BASE_URL}/welcome`;
    const ogImage = `${BASE_URL}/brand.png`;

    if (initialStep === OnboardingSteps.Step1) {
        pageTitle = 'Step 1: Link Your Email | Ascend Onboarding';
        pageDescription =
            'Connect your email to automatically import your travel bookings and start tracking for price drops with Ascend.';
        pageUrl = `${BASE_URL}/welcome?step=1`;
    } else if (initialStep === OnboardingSteps.Step2) {
        pageTitle = 'Step 2: Add Your Phone | Ascend Onboarding';
        pageDescription =
            'Add your phone number to get notified about savings and important updates for your travel bookings with Ascend.';
        pageUrl = `${BASE_URL}/welcome?step=2`;
    } else if (initialStep === OnboardingSteps.Step3) {
        pageTitle = 'Step 3: Become a Member | Ascend Onboarding';
        pageDescription =
            'Complete your Ascend membership to unlock full access to automated travel savings and members-only deals.';
        pageUrl = `${BASE_URL}/welcome?step=3`;
    } else if (initialStep === OnboardingSteps.Step4) {
        pageTitle = 'Step 4: Import Your Trips | Ascend Onboarding';
        pageDescription = 'Import your travel bookings to automatically track for price drops with Ascend.';
        pageUrl = `${BASE_URL}/welcome?step=4`;
    }

    const webPageJsonLd = generateWebPageSchema({
        step: initialStep,
        pageTitle: pageTitle,
        pageDescription: pageDescription,
        pageUrl: pageUrl,
        ogImage: ogImage
    });

    return (
        <>
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />
            <OnboardingWelcomeView predefinedStep={initialStep} />
        </>
    );
}
