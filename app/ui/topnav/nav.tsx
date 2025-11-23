'use client';

import Search from '../search/Search';
import { BsCupHot, BsCupHotFill } from "react-icons/bs";
import { RiSofaLine, RiSofaFill } from "react-icons/ri";
import { IoIosArrowDown } from "react-icons/io";
import { FaPlus } from 'react-icons/fa';
import Link from 'next/link';
import { useAuth } from "../../lib/hooks";
import { useScrollDirection } from "../../lib/hooks";
import { NavLogo } from '../sharedComponents';
import { useRef } from 'react';

interface NavProps {
    toggleDropdownMenu?: () => void;
    isVisible?: boolean;
    isMenuOpen?: boolean;
}

function Nav({ toggleDropdownMenu, isVisible, isMenuOpen }: NavProps) {
    const { isAuthenticated } = useAuth();
    const { isNavVisible } = useScrollDirection();
    const arrowButtonRef = useRef<HTMLDivElement>(null);

    // Use the prop if provided, otherwise use the hook
    const shouldShow = isVisible !== undefined ? isVisible : isNavVisible;

    return (
        <div className={`w-full px-3 transition-transform duration-300 ease-in-out ${shouldShow ? 'translate-y-0' : '-translate-y-full'
            }`}>
            {/* Main nav container - responsive height */}
            <nav className="relative w-full mx-auto md:px-3">

                {/* Top row - logo and icons */}
                <div className="h-14 flex items-center justify-between">
                    <div className="flex-shrink-0 w-10 md:w-12 md:mt-2">
                        <NavLogo />
                    </div>

                    {/* Search bar for md+ screens */}
                    <div className="hidden md:flex flex-1 ml-0 mr-0 min-w-[350px] max-w-[400px] lg:min-w-[500px] lg:max-w-[650px] absolute left-1/2 transform -translate-x-1/2">
                        <Search />
                    </div>

                    <div className="flex-shrink-0">
                        <nav className="flex flex-row gap-2 sm:gap-3 items-center justify-center">
                            <Link href="/submit" className="nav-icon-btn" aria-label="Submit a quote">
                                <FaPlus size={20} />
                            </Link>
                            <Link href="/tea-room" className="nav-icon-btn" aria-label="Buy me a coffee">
                                {isAuthenticated ?
                                    <BsCupHotFill size={18} /> :
                                    <BsCupHot size={18} />}
                            </Link>
                            <Link href="/lounge" className="nav-icon-btn" aria-label="Lounge">
                                {isAuthenticated ?
                                    <RiSofaFill size={18} /> :
                                    <RiSofaLine size={18} />}
                            </Link>
                            <div
                                ref={arrowButtonRef}
                                onClick={() => {
                                    console.log('Arrow clicked, toggleDropdownMenu:', toggleDropdownMenu);
                                    toggleDropdownMenu?.();
                                }}
                                className="antique-parchment-text nav-icon-arrow cursor-pointer p-1"
                                aria-label="Open menu"
                            >
                                <IoIosArrowDown
                                    size={24}
                                    className={`transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : 'rotate-0'
                                        }`}
                                />
                            </div>
                        </nav>
                    </div>
                </div>

                {/* Search bar for mobile/tablet screens - below the main row */}
                <div className="md:hidden pb-3 px-2">
                    <Search />
                </div>
            </nav>
        </div>
    );
};

Nav.displayName = 'Nav';
export default Nav;