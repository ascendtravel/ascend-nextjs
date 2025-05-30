'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import UserAvatar from '@/components/UserAvatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useUser } from '@/contexts/UserContext';

import { Skeleton } from './ui/skeleton';
import { format, parseISO } from 'date-fns';
import { PencilIcon, UserRoundX, X } from 'lucide-react';

export default function UserDetailsMenu({ loading }: { loading?: boolean }) {
    const { user } = useUser();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const renderMenuContent = () => <UserMenuContent isMobile={isMobile} />;

    return isMobile ? (
        <Sheet>
            <SheetTrigger asChild>
                <div className='flex items-center gap-2'>
                    {loading ? (
                        <Skeleton className='size-10 animate-pulse rounded-full border border-neutral-200/20' />
                    ) : (
                        <button className='outline-none'>
                            <UserAvatar variant='md' showName={false} darkMode={true} />
                        </button>
                    )}
                </div>
            </SheetTrigger>
            <SheetContent
                side='right'
                className='w-full bg-white p-0 sm:max-w-md'
                showClose={false}
                ariaLabel='User Profile'>
                <div className='flex items-center justify-between bg-[#006DBC] px-4 py-2'>
                    <div className='flex items-center gap-4'>
                        <UserAvatar variant='md' showName={false} darkMode={true} />
                        <div className='text-lg font-medium text-white'>
                            {user?.first_name || user?.main_email || 'User'}
                        </div>
                    </div>
                    <SheetClose className='rounded-full hover:bg-white/20'>
                        <X className='h-5 w-5 text-white' />
                    </SheetClose>
                </div>
                {renderMenuContent()}
            </SheetContent>
        </Sheet>
    ) : (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className='outline-none'>
                    <UserAvatar variant='md' showName={false} darkMode={true} />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-64'>
                {renderMenuContent()}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

function UserMenuContent({ isMobile }: { isMobile: boolean }) {
    const router = useRouter();
    const { user, logout, isImpersonating, stopImpersonating, startImpersonating } = useUser();
    const [isEditing, setIsEditing] = useState(false);
    const [newImpersonateId, setNewImpersonateId] = useState(localStorage.getItem('impersonateUserId') || '');

    const handleLogout = () => {
        logout();
        router.push('/auth/phone-login');
    };

    const handleStopImpersonating = () => {
        stopImpersonating();
        setNewImpersonateId('');
        window.location.reload();
    };

    const handleStartImpersonating = () => {
        if (newImpersonateId.trim()) {
            startImpersonating(newImpersonateId.trim());
            setIsEditing(false);
            window.location.reload();
        }
    };

    const userFields = [
        { key: 'first_name', label: 'First' },
        { key: 'last_name', label: 'Last' },
        { key: 'main_phone', label: 'Phone' },
        { key: 'main_email', label: 'Email' },
        { key: 'date_of_birth', label: 'Date of Birth' },
        { key: 'citizenship', label: 'Citizenship' }
    ];

    const getProfileCompletion = () => {
        if (!user) return { percentage: 0, completed: [], missing: [] };

        const completed = userFields.filter(({ key }) => user[key as keyof typeof user]);
        const missing = userFields.filter(({ key }) => !user[key as keyof typeof user]);
        const percentage = Math.round((completed.length / userFields.length) * 100);

        return { percentage, completed, missing };
    };

    const profileStatus = getProfileCompletion();

    const MenuItem = isMobile ? 'div' : DropdownMenuItem;
    const MenuLabel = isMobile ? 'div' : DropdownMenuLabel;
    const MenuSeparator = isMobile ? 'hr' : DropdownMenuSeparator;

    return (
        <div className={`flex flex-col gap-2 ${isMobile ? 'p-4' : ''}`}>
            {/* User Info */}

            {userFields.map(({ key, label }) => (
                <MenuItem key={key} className='cursor-default px-2 py-1 opacity-50'>
                    {key === 'date_of_birth' ? (
                        <div className='flex w-full justify-between gap-2'>
                            <span className='text-xs font-medium'>{label}:</span>
                            <span className='truncate text-xs'>
                                {getNiceFormattedDate(user?.[key as keyof typeof user] as string | undefined)}
                            </span>
                        </div>
                    ) : (
                        <div className='flex w-full justify-between gap-2'>
                            <span className='text-xs font-medium'>{label}:</span>
                            <span className='truncate text-xs'>
                                {String(user?.[key as keyof typeof user] || 'Not provided')}
                            </span>
                        </div>
                    )}
                </MenuItem>
            ))}
            {profileStatus.percentage < 100 && (
                <MenuLabel className='px-2 text-xs font-semibold text-gray-700'>
                    <div className='flex items-center justify-between gap-2'>
                        <span className='text-xs font-semibold text-gray-700'>Profile Completion</span>
                        <span className='text-xs font-semibold text-gray-700'>{profileStatus.percentage}%</span>
                    </div>
                </MenuLabel>
            )}

            {user?.is_admin && (
                <>
                    <MenuSeparator />
                    <MenuLabel className='text-yellow-600'>
                        Impersonation
                        <Button
                            variant='ghost'
                            size='sm'
                            className='ml-2 h-6 w-6 rounded-full p-0'
                            onClick={() => setIsEditing(!isEditing)}>
                            <PencilIcon className='h-3 w-3' />
                        </Button>
                    </MenuLabel>

                    {isEditing ? (
                        <div className='flex items-center gap-2 p-2'>
                            <Input
                                value={newImpersonateId}
                                onChange={(e) => setNewImpersonateId(e.target.value)}
                                placeholder='Enter user ID'
                                className='h-8 text-xs'
                            />
                            <Button
                                size='sm'
                                variant='outline'
                                className='h-8 text-xs'
                                onClick={handleStartImpersonating}>
                                Start
                            </Button>
                        </div>
                    ) : (
                        <>
                            <MenuItem className='cursor-default text-xs opacity-50'>
                                {localStorage.getItem('impersonateUserId')}
                            </MenuItem>
                        </>
                    )}
                </>
            )}

            <MenuSeparator />
            <MenuItem onClick={handleLogout} className='cursor-pointer px-2 text-[#006DBC] hover:text-[#006DBC]/80'>
                Log out
            </MenuItem>

            {isImpersonating() && (
                <MenuItem onClick={handleStopImpersonating} className='text-neutral-50'>
                    <div className='flex w-full flex-row items-center justify-between gap-2 rounded-full border bg-red-400 px-6 py-2 text-nowrap'>
                        Stop Impersonating
                        <UserRoundX className='size-5' />
                    </div>
                </MenuItem>
            )}
        </div>
    );
}

function getNiceFormattedDate(date: string | null | undefined) {
    if (!date) return 'Not provided';

    try {
        return format(parseISO(date), 'MMM d, yyyy');
    } catch (error) {
        return 'Not provided';
    }
}
