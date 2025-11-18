'use client';

import React from "react";
import Link from 'next/link';
import { useAuth } from '../..//lib/hooks';
import { signOut } from 'next-auth/react';

interface MenuProps {
    isOpen: boolean;
    onClick: () => void;
}

const Menu = React.forwardRef<HTMLDivElement, MenuProps>(
    function Menu({ isOpen, onClick }, ref) {
        const { isAuthenticated } = useAuth();

        const handleLogout = async () => {
            try {
                onClick();
                // Use NextAuth signOut
                await signOut({ callbackUrl: '/' });
            } catch (error) {
                console.error('Logout failed:', error);
                // Fallback: redirect to login
                router.push('/');
            }
        };

        return (
            <nav
                ref={ref}
                className={`
                    fixed right-3 sm:right-4 md:right-6
                    mt-1
                    w-[160px] sm:w-[180px]
                    bg-[#1a1a1a] 
                    border border-[#333]
                    rounded-lg
                    shadow-xl
                    transition-all duration-200 ease-in-out
                    origin-top-right
                    ${isOpen
                        ? 'opacity-100 scale-100 visible'
                        : 'opacity-0 scale-95 invisible pointer-events-none'
                    }
                    z-[70]
                `}
                style={{
                    top: 'calc(3.5rem)', // Adjust based on nav height
                }}
            >
                <div className="py-1.5">
                    {!isAuthenticated ? (
                        <Link
                            href="/login"
                            onClick={onClick}
                            className="block px-4 py-2 text-md text-gray-200 hover:bg-[#2a2a2a] transition-colors"
                        >
                            Login
                        </Link>
                    ) : null}
                    <Link
                        href="/lounge"
                        onClick={onClick}
                        className="block px-4 py-2 text-md text-gray-200 hover:bg-[#2a2a2a] transition-colors"
                    >
                        Lounge
                    </Link>
                    <Link
                        href="/submit"
                        onClick={onClick}
                        className="block px-4 py-2 text-md text-gray-200 hover:bg-[#2a2a2a] transition-colors"
                    >
                        Submit Backroll
                    </Link>
                    <Link
                        href="/about"
                        onClick={onClick}
                        className="block px-4 py-2 text-md text-gray-200 hover:bg-[#2a2a2a] transition-colors"
                    >
                        About
                    </Link>
                    <Link
                        href="/policies"
                        onClick={onClick}
                        className="block px-4 py-2 text-md text-gray-200 hover:bg-[#2a2a2a] transition-colors"
                    >
                        Policies
                    </Link>
                    {!isAuthenticated ? null : (
                        <>
                            <div className="border-t border-[#333] my-1"></div>
                            <button
                                onClick={handleLogout}
                                className="w-full cursor-pointer block px-4 py-2 text-md text-red-400 hover:bg-[#2a2a2a] transition-colors"
                            >
                                Logout
                            </button>

                        </>
                    )}
                </div>
            </nav>
        );
    }
);

Menu.displayName = 'Menu';

export default Menu;