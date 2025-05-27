import React from 'react';

import { Separator } from '@/components/ui/separator';
import { FRAMER_LINKS } from '@/config/navigation';

import { motion } from 'framer-motion';
import { DockIcon, InfoIcon, LockIcon } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

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
    const { user } = useUser();
    return (
        <motion.div
            className='mt-6 w-full pb-2 text-neutral-50'
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.4,
                delay: 0.2,
                ease: 'easeOut'
            }}>
            <div className='mb-1 text-xs font-semibold text-[#FFFFFFCC'>MORE</div>
            <div className='flex flex-col items-center justify-center gap-2 pt-2'>
                {Links.map((link, index) => (
                    <React.Fragment key={link.title}>
                        <a
                            href={link.href}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='flex w-full flex-row items-center justify-start gap-2 py-2 text-md'>
                            <link.Icon className='h-4 w-4' />
                            <div className='font-medium'>{link.title}</div>
                        </a>
                        <Separator className='bg-[#FFFFFF0D]' />
                    </React.Fragment>
                ))}
            </div>
            {
                !!user?.main_email && (
                    <div className='pt-8 pb-2'>
                        <span className='text-sm'>Your unique email for forwarding missing trips is <strong>{user?.main_email}</strong></span>
                    </div>
                )
            }
        </motion.div>
    );
}
