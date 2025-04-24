'use client';

import { useState } from 'react';

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
import { useUser } from '@/contexts/UserContext';

import { PencilIcon } from 'lucide-react';

export default function UserDropdownMenu() {
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

    // Only show impersonation features if user is currently impersonating
    const showImpersonation = isImpersonating();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className='outline-none'>
                    <UserAvatar variant='md' showName={true} darkMode={true} />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-72'>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                {user && (
                    <>
                        <DropdownMenuItem disabled className='cursor-default opacity-50'>
                            {user.main_phone}
                        </DropdownMenuItem>
                        {user.main_email && (
                            <DropdownMenuItem disabled className='cursor-default opacity-50'>
                                {user.main_email}
                            </DropdownMenuItem>
                        )}
                    </>
                )}

                {showImpersonation && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel className='text-yellow-600'>
                            Impersonation
                            <Button
                                variant='ghost'
                                size='sm'
                                className='ml-2 h-6 w-6 rounded-full p-0'
                                onClick={() => setIsEditing(!isEditing)}>
                                <PencilIcon className='h-3 w-3' />
                            </Button>
                        </DropdownMenuLabel>

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
                                <DropdownMenuItem disabled className='cursor-default text-xs opacity-50'>
                                    {localStorage.getItem('impersonateUserId')}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleStopImpersonating} className='text-yellow-600'>
                                    Stop Impersonating
                                </DropdownMenuItem>
                            </>
                        )}
                    </>
                )}

                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className='text-red-600'>
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
