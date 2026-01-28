'use client';

import { useState, useRef, useEffect } from 'react';
import Search from '../search/Search';
import { NavLogo } from '../shared/NavLogo';
import { useFiltersContext } from '../../context/FiltersModalContext';
import { useRainbowColors } from '../../lib/hooks/useRainbowColors';
import { NavLinks } from './components/NavLinks';

// Nav Icons
import { FaSearch } from 'react-icons/fa';
import { RiCloseLargeFill } from "react-icons/ri";
import { LuPanelLeft } from "react-icons/lu";
import { IoFilterSharp } from "react-icons/io5";

interface NavProps {
    toggleDropdownMenu?: () => void;
}

function Nav({ toggleDropdownMenu }: NavProps) {
    const arrowButtonRef = useRef<HTMLButtonElement>(null);
    const { toggleFilters } = useFiltersContext();
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const { getColorForIcon } = useRainbowColors();
    const [hoveredIconIndex, setHoveredIconIndex] = useState<number | null>(null);
    const [screenSize, setScreenSize] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1024);

    useEffect(() => {
        const handleResize = () => setScreenSize(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (screenSize >= 768 && isMobileSearchOpen) {
            setIsMobileSearchOpen(false);
        }
    }, [screenSize, isMobileSearchOpen]);

    const handleIconMouseEnter = (index: number) => {
        setHoveredIconIndex(index);
    };

    const handleIconMouseLeave = () => {
        setHoveredIconIndex(null);
    };



    return (
        <div className="flex flex-col w-full pt-2">

            {/* Top nav container */}
            <nav className="flex items-center relative w-full min-h-[55px] pb-1 px-2 sm:px-3 border-b border-[var(--light-border)]">

                {/* Logo - hidden when mobile search is open */}
                {!isMobileSearchOpen && (
                    <div className="flex-shrink-0 ml-1 sm:ml-2">
                        <NavLogo />
                    </div>
                )}

                {/* Mobile Search - Full width when open */}
                {isMobileSearchOpen && (
                    <div className="w-full max-w-[calc(100%-60px)] md:hidden">
                        <Search />
                    </div>
                )}

                {/* Desktop Search - always visible on desktop, hidden on mobile */}
                {!isMobileSearchOpen && (
                    <div className="hidden md:block absolute left-1/2 -translate-x-1/2 w-[60%] lg:w-[50%] max-w-[600px]">
                        <Search />
                    </div>
                )}

                {/* Right side icons */}
                <div className="flex flex-shrink-0 justify-end ml-auto pr-0 md:pr-2">
                    <nav className="flex gap-1 sm:gap-2 items-center">
                        {isMobileSearchOpen ? (
                            // Close button when mobile search is open
                            <button
                                onClick={() => setIsMobileSearchOpen(false)}
                                className="nav-icon-btn ml-2 mr-2 md:hidden rounded-md"
                                aria-label="Close search"
                            >
                                <RiCloseLargeFill
                                    size={22}
                                    className="nav-icon-btn__icon"
                                />
                            </button>
                        ) : (
                            <>
                                {/* Mobile search icon - only show on mobile when search is closed */}
                                <button
                                    onClick={() => setIsMobileSearchOpen(true)}
                                    className="nav-icon-btn md:hidden rounded-md"
                                    aria-label="Search"
                                >
                                    <FaSearch
                                        size={18}
                                        className="nav-icon-btn__icon"
                                    />
                                </button>
                                {/* Filter Button */}
                                <button
                                    aria-label="Filter Backrolls"
                                    className="nav-icon-btn rounded-md"
                                    onClick={() => toggleFilters()}
                                >
                                    <IoFilterSharp
                                        title="Filter Backrolls"
                                        size={26}
                                        className="nav-icon-btn__icon"
                                    />
                                </button>
                                <button
                                    ref={arrowButtonRef}
                                    onClick={() => {
                                        toggleDropdownMenu?.();
                                    }}
                                    className="nav-icon-btn flex-shrink-0 rounded-md"
                                    aria-label="Open menu"
                                >
                                    <LuPanelLeft
                                        size={22}
                                        className="nav-icon-btn__icon"
                                    />
                                </button>
                            </>
                        )}
                    </nav>
                </div>
            </nav>

            {/* Bottom Nav Component */}
            <nav className="w-full">
                <div className="w-full max-w-[800px] mx-auto lg:border-x lg:border-[var(--light-border)] flex justify-around py-2 md:justify-center gap-1 md:gap-2">
                    <NavLinks
                        hoveredIconIndex={hoveredIconIndex}
                        onIconMouseEnter={handleIconMouseEnter}
                        onIconMouseLeave={handleIconMouseLeave}
                        getColorForIcon={getColorForIcon}
                    />
                </div>
            </nav>
        </div>
    );
};

Nav.displayName = 'Nav';
export default Nav;