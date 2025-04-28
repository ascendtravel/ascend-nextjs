import React from 'react';

import { Separator } from '@/components/ui/separator';
import { FRAMER_LINKS } from '@/config/navigation';

import { motion } from 'framer-motion';
import { DockIcon, InfoIcon, LockIcon } from 'lucide-react';

type RpFooterSectionProps = {
    email: string;
};

const Links = [
    {
        title: 'Privacy Policy',
        Icon: LockIcon,
        href: FRAMER_LINKS.privacy
    },
    {
        title: 'Terms of Service',
        Icon: DockIcon,
        href: FRAMER_LINKS.terms
    },
    {
        title: 'Support',
        Icon: InfoIcon,
        href: FRAMER_LINKS.support
    }
];

export default function RpFooterSection({ email }: RpFooterSectionProps) {
    return (
        <motion.div
            className='mt-6 w-full pb-12'
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.4,
                delay: 0.2,
                ease: 'easeOut'
            }}>
            <div className='mb-2 pl-4 text-sm font-bold'>More</div>
            <Separator />
            <div className='ml-6 flex flex-col items-center justify-center gap-2 py-2'>
                {Links.map((link) => (
                    <React.Fragment key={link.title}>
                        <a
                            href={link.href}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='flex w-full flex-row items-start justify-start gap-2 py-2 text-xs'>
                            <link.Icon className='h-4 w-4' />
                            <div className='font-bold'>{link.title}</div>
                        </a>
                        <Separator />
                    </React.Fragment>
                ))}
            </div>
            <div className='mt-3 mb-16 ml-4 flex flex-col items-start justify-center text-xs'>
                Your Unique email for forwarding missing trips is:
                <div className='font-bold underline'>{email}</div>
            </div>
        </motion.div>
    );
}
