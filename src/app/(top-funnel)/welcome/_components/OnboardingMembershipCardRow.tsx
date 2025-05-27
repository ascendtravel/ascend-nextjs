import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

// Assuming this is the correct path
import OnboardingMembershipCheckSvg from './OnboardingMembershipCheckSvg';

export default function OnboardingMembershipCardRow({
    title,
    description,
    isInitiallyOpen = false
}: {
    title: string;
    description?: string;
    isInitiallyOpen?: boolean;
}) {
    if (!description) {
        // No description, render simple layout
        return (
            <div className='flex flex-row items-center gap-2'>
                <OnboardingMembershipCheckSvg />
                <p className='text-lg font-bold'>{title}</p>
            </div>
        );
    }

    const itemValue = `item-${title.replace(/\s+/g, '-').toLowerCase()}`;

    // Description exists, prepare for conditional rendering
    return (
        <div className='w-full'>
            {/* Layout for medium screens and up (md:) - static display */}
            <div className='hidden flex-col items-start gap-2 md:flex'>
                <div className='flex flex-row items-center gap-2'>
                    <OnboardingMembershipCheckSvg />
                    <p className='text-lg font-bold'>{title}</p>
                </div>
                <p className='-mt-1 -ml-6 text-sm font-semibold text-[#1F453D]'>
                    {description}
                </p>{' '}
                {/* Indent description under title */}
            </div>

            {/* Layout for screens smaller than medium - Accordion */}
            {/* The Accordion itself needs a unique value for multi-item accordions, but for a single item, it's less critical unless it's part of a larger group. */}
            {/* Using title as a simple key here, ensure it is unique if multiple rows are in one Accordion root not shown here.*/}
            <div className='block md:hidden'>
                <Accordion
                    type='single'
                    collapsible
                    className='w-full'
                    defaultValue={isInitiallyOpen ? itemValue : undefined}>
                    <AccordionItem value={itemValue} className='!border-b-none'>
                        <AccordionTrigger className='py-2 text-md font-bold hover:no-underline'>
                            <div className='flex flex-row items-center gap-2'>
                                <OnboardingMembershipCheckSvg />
                                <span>{title}</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className='text-sm font-semibold text-[#1F453D] pb-0'>
                            {' '}
                            {/* Indent description */}
                            {description}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    );
}
