'use client';

import Search from '../search/Search';
import { BsCupHot, BsCupHotFill } from "react-icons/bs";
import { RiSofaLine, RiSofaFill } from "react-icons/ri";
import { FaPlus, FaSearch } from 'react-icons/fa';
import { RiCloseLargeFill } from "react-icons/ri";
import { LuPanelLeft } from "react-icons/lu";
import Link from 'next/link';
import { useAuth } from "../../lib/hooks";
import { NavLogo } from '../sharedComponents';
import { useState, useRef } from 'react';
import { FilterSelectors } from '../filters/FilterSelectors';


interface NavProps {
    toggleDropdownMenu?: () => void;
    isMenuOpen?: boolean;
}

function Nav({ toggleDropdownMenu, isMenuOpen }: NavProps) {
    const { isAuthenticated } = useAuth();
    const arrowButtonRef = useRef<HTMLDivElement>(null);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

    return (
        <div className="w-full px-3">
            {/* Main nav container */}
            <nav className="relative w-full mx-auto md:px-3">
                {/* Top row - logo, filters (center), search (right on desktop), and icons */}
                <div className="h-14 flex items-center gap-3">

                    {/* Removed left-side panel icon to avoid redundancy */}

                    {/* Logo - hidden when mobile search is open */}
                    {!isMobileSearchOpen && (
                        <div className="flex-shrink-0 w-10 md:w-12 md:mt-2">
                            <NavLogo />
                        </div>
                    )}

                    {/* Mobile Search - Full width when open */}
                    {isMobileSearchOpen && (
                        <div className="flex-1 md:hidden">
                            <Search />
                        </div>
                    )}

                    {/* Filters - centered on all screens, hidden when mobile search open */}
                    {!isMobileSearchOpen && (
                        <div className="flex-1 flex justify-start ml-3 md:ml-30">
                            <FilterSelectors />
                        </div>
                    )}

                    {/* Search bar - desktop only, right side before icons */}
                    {!isMobileSearchOpen && (
                        <div className="hidden md:block w-[200px] lg:w-[350px] flex-shrink-0">
                            <Search />
                        </div>
                    )}

                    {/* Right side icons */}
                    <div className="flex-shrink-0">
                        <nav className="flex flex-row gap-2 sm:gap-3 items-center justify-center">
                            {/* Mobile search toggle - close button when open */}
                            {isMobileSearchOpen ? (
                                <button
                                    onClick={() => setIsMobileSearchOpen(false)}
                                    className="nav-icon-btn md:hidden"
                                    aria-label="Close search"
                                >
                                    <RiCloseLargeFill size={20} />
                                </button>
                            ) : (
                                <>
                                    {/* Mobile search icon - only show on mobile when search is closed */}
                                    <button
                                        onClick={() => setIsMobileSearchOpen(true)}
                                        className="nav-icon-btn md:hidden"
                                        aria-label="Search"
                                    >
                                        <FaSearch size={18} />
                                    </button>
                                    {/* Other icons */}
                                    <Link href="/submit" className="nav-icon-btn hidden md:flex" aria-label="Submit a quote">
                                        <FaPlus size={20} />
                                    </Link>
                                    <Link href="/tea-room" className="nav-icon-btn hidden md:flex" aria-label="Buy me a coffee">
                                        {isAuthenticated ?
                                            <BsCupHotFill size={18} /> :
                                            <BsCupHot size={18} />}
                                    </Link>
                                    <Link href="/lounge" className="nav-icon-btn hidden md:flex" aria-label="Lounge">
                                        {isAuthenticated ?
                                            <RiSofaFill size={18} /> :
                                            <RiSofaLine size={18} />}
                                    </Link>
                                    <div
                                        ref={arrowButtonRef}
                                        onClick={() => {
                                            toggleDropdownMenu?.();
                                        }}
                                        className="antique-parchment-text nav-icon-arrow cursor-pointer p-1"
                                        aria-label="Open menu"
                                    >
                                        <LuPanelLeft
                                            size={22}
                                            className={`transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : 'rotate-0'}`}
                                        />
                                    </div>
                                </>
                            )}
                        </nav>
                    </div>
                </div>
            </nav>
        </div>
    );
};

Nav.displayName = 'Nav';
export default Nav;