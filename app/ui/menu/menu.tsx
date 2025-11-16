'use client';

import React from "react";
import Link from 'next/link';

interface MenuProps {
    isOpen: boolean;
}

const Menu = React.forwardRef<HTMLDivElement, MenuProps>(
    function Menu({ isOpen }, ref) {
        console.log('Menu render - isOpen:', isOpen);
        
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
                    <Link 
                        href="/profile" 
                        className="block px-4 py-2 text-sm text-gray-200 hover:bg-[#2a2a2a] transition-colors"
                    >
                        Profile
                    </Link>
                    <Link 
                        href="/settings" 
                        className="block px-4 py-2 text-sm text-gray-200 hover:bg-[#2a2a2a] transition-colors"
                    >
                        Settings
                    </Link>
                    <Link 
                        href="/about" 
                        className="block px-4 py-2 text-sm text-gray-200 hover:bg-[#2a2a2a] transition-colors"
                    >
                        About
                    </Link>
                    <div className="border-t border-[#333] my-1"></div>
                    <Link 
                        href="/logout" 
                        className="block px-4 py-2 text-sm text-red-400 hover:bg-[#2a2a2a] transition-colors"
                    >
                        Logout
                    </Link>
                </div>
            </nav>
        );
    }
);

Menu.displayName = 'Menu';

export default Menu;