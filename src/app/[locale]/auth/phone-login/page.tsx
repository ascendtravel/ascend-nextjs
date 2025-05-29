import { Metadata } from 'next';

import { PhoneLoginView } from '../_components/PhoneLoginView';
import { WebPage, WithContext } from 'schema-dts';

// Define base URL for Open Graph images
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://app.heyascend.com';

export async function generateMetadata(): Promise<Metadata> {
    const title = 'Login to Ascend | Access Your Account';
    const description =
        'Log in to your Ascend account using your phone number to manage your travel bookings and savings.';
    const pageUrl = `${BASE_URL}/auth/phone-login`;
    const ogImage = `${BASE_URL}/brand.png`; // Assuming brand.png in /public

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
                    width: 1200, // Standard OG image width
                    height: 630, // Standard OG image height
                    alt: 'Ascend Travel Logo'
                }
            ],
            siteName: 'Ascend Travel'
        }
    };
}

// Function to generate JSON-LD schema for WebPage
function generateWebPageSchema({
    pageTitle,
    pageDescription,
    pageUrl,
    ogImage
}: {
    pageTitle: string;
    pageDescription: string;
    pageUrl: string;
    ogImage: string;
}): WithContext<WebPage> {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: pageTitle,
        description: pageDescription,
        url: pageUrl,
        image: ogImage,
        isPartOf: {
            '@type': 'WebSite',
            url: BASE_URL,
            name: 'Ascend Travel'
        }
    };
}

type PhoneLoginPageProps = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function PhoneLoginPage({ searchParams }: PhoneLoginPageProps) {
    const params = await searchParams;
    const redirectUrl = params.redirect as string;

    // Data for metadata and JSON-LD
    const pageTitle = 'Login to Ascend | Access Your Account';
    const pageDescription =
        'Log in to your Ascend account using your phone number to manage your travel bookings and savings.';
    const pageUrl = `${BASE_URL}/auth/phone-login`;
    const ogImage = `${BASE_URL}/brand.png`;

    const webPageJsonLd = generateWebPageSchema({
        pageTitle,
        pageDescription,
        pageUrl,
        ogImage
    });

    return (
        <>
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />
            <div className='flex h-full w-full flex-1 flex-col items-center justify-center p-4'>
                <PhoneLoginView redirectUrl={redirectUrl} />
            </div>
        </>
    );
}
