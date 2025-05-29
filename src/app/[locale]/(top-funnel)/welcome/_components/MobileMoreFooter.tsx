import React from 'react';

import { Separator } from '@/components/ui/separator';
import { FRAMER_LINKS } from '@/config/navigation';
import { useUser } from '@/contexts/UserContext';

import { motion } from 'framer-motion';
import { DockIcon, InfoIcon, LockIcon } from 'lucide-react';

const Links = [
    {
        title: 'Terms of Service',
        Icon: DockIcon,
        href: FRAMER_LINKS.terms
    },
    {
        title: 'Privacy Policy',
        Icon: LockIcon,
        href: FRAMER_LINKS.privacy
    },
    {
        title: 'Help',
        Icon: InfoIcon,
        href: FRAMER_LINKS.support
    }
];

export default function MobileMoreFooter() {
    const { user } = useUser();

    return (
        <motion.div
            className='relative mt-6 h-full w-full pb-2 text-neutral-50'
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.4,
                delay: 0.2,
                ease: 'easeOut'
            }}>
            <div className='mb-1 pl-4 text-sm font-bold'>More</div>
            <Separator className='opacity-10' />
            <div className='ml-6 flex flex-col items-center justify-center gap-2 pt-2'>
                {Links.map((link, index) => (
                    <React.Fragment key={link.title}>
                        <a
                            href={link.href}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='flex w-full flex-row items-start justify-start gap-2 py-1 text-base'>
                            <link.Icon className='size-5' />
                            <div className='font-bold'>{link.title}</div>
                        </a>
                        {index !== Links.length - 1 && <Separator className='opacity-10' />}
                    </React.Fragment>
                ))}
            </div>
            <div className='flex w-full flex-col items-center justify-center gap-2 pt-6 pb-12'>
                <span className='text-center text-sm font-semibold text-neutral-50'>
                    Your unique email for forwarding missing trips is
                </span>
                <span className='block text-center text-sm break-all drop-shadow-md select-all'>
                    {user?.main_phone}@reprice.ascend.travel
                </span>
            </div>
        </motion.div>
    );
}
