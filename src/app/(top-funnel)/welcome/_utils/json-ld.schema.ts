// It's good practice to install schema-dts for strong types: npm install schema-dts
// For now, we'll use basic object structures and you can add schema-dts types later.
// import { WithContext, WebPage, Organization, ImageObject, BreadcrumbList, ListItem } from 'schema-dts';
import { OnboardingSteps } from '../_types';

// Adjust path as necessary

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://ascend.travel';

interface SchemaConfig {
    step?: OnboardingSteps;
    pageTitle: string;
    pageDescription: string;
    pageUrl: string;
    ogImage: string;
}

/**
 * Generates the Organization schema.
 */
export const generateOrganizationSchema = () => {
    // return (): Organization => ({
    return {
        '@type': 'Organization',
        name: 'Ascend Travel',
        url: BASE_URL,
        logo: {
            '@type': 'ImageObject',
            url: `${BASE_URL}/brand.png` // Assuming brand.png is in /public/brand.png
        },
        sameAs: [
            'https://www.instagram.com/discoverascend/'
            // Add other relevant social media or official links if available
        ]
    };
};

/**
 * Generates the WebPage schema, potentially customized by onboarding step.
 */
export const generateWebPageSchema = (config: SchemaConfig) => {
    // return (): WithContext<WebPage> => ({
    const schema: any = {
        '@context': 'https://schema.org',
        '@type': 'WebPage', // Default type
        name: config.pageTitle,
        description: config.pageDescription,
        url: config.pageUrl,
        image: {
            '@type': 'ImageObject',
            url: config.ogImage,
            width: 1200,
            height: 630
        },
        publisher: generateOrganizationSchema() // Nesting Organization schema
    };

    // Example of customizing schema based on step
    // if (config.step === OnboardingSteps.Step0) {
    //     // schema.mainEntity = { ... } // e.g., highlight main content of the welcome page
    // }

    // Example for Breadcrumbs if you have a clear step-by-step navigation
    // if (config.step && config.step !== OnboardingSteps.Step0) {
    //     schema.breadcrumb = generateBreadcrumbSchema(config.step);
    // }

    // If it's the main welcome page and also functions as the website's primary entry for this section:
    if (!config.step || config.step === OnboardingSteps.Step0) {
        // schema['@type'] = 'WebSite'; // Or keep as WebPage and have a separate WebSite schema for the root
        // schema.potentialAction = {
        //     '@type': 'SearchAction',
        //     'target': `${BASE_URL}/search?q={search_term_string}`,
        //     'query-input': 'required name=search_term_string',
        // };
    }

    return schema;
};

/**
 * Generates BreadcrumbList schema (example).
 */
// export const generateBreadcrumbSchema = (currentStep: OnboardingSteps): WithContext<BreadcrumbList> => {
//     const itemListElement: ListItem[] = [
//         {
//             '@type': 'ListItem',
//             position: 1,
//             name: 'Welcome',
//             item: `${BASE_URL}/welcome`,
//         },
//     ];

//     if (currentStep === OnboardingSteps.Step1) {
//         itemListElement.push({
//             '@type': 'ListItem',
//             position: 2,
//             name: 'Link Email',
//             item: `${BASE_URL}/welcome?step=1`,
//         });
//     }
//     // ... add more steps

//     return {
//         '@context': 'https://schema.org',
//         '@type': 'BreadcrumbList',
//         itemListElement,
//     };
// };
