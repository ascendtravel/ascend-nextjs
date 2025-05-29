import React from 'react';

import { Separator } from '@/components/ui/separator';
import { FRAMER_LINKS } from '@/config/navigation';

import { motion } from 'framer-motion';
import { DockIcon, InfoIcon, LockIcon } from 'lucide-react';

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

export default function RpFooterSection() {
    return (
        <motion.div
            className='mt-6 w-full pb-2'
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.4,
                delay: 0.2,
                ease: 'easeOut'
            }}>
            <div className='mb-1 pl-4 text-sm font-bold'>More</div>
            <Separator />
            <div className='ml-6 flex flex-col items-center justify-center gap-2 pt-2'>
                {Links.map((link, index) => (
                    <React.Fragment key={link.title}>
                        <a
                            href={link.href}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='flex w-full flex-row items-start justify-start gap-2 py-1 text-xs'>
                            <link.Icon className='h-4 w-4' />
                            <div className='font-bold'>{link.title}</div>
                        </a>
                        {index !== Links.length - 1 && <Separator />}
                    </React.Fragment>
                ))}
            </div>
        </motion.div>
    );
}
