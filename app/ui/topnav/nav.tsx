'use client';

import { useState, useEffect } from 'react';
import { useSearchContext } from "../../context/SearchContext";
import { NavLogo } from '../shared/NavLogo';
import { useFiltersContext } from '../../context/FiltersModalContext';
import { useRainbowColors } from '../../lib/hooks/useRainbowColors';
import { NavLinks } from './components/NavLinks';
import { SearchSection } from './components/SearchSection';
import { NavActions } from './components/NavActions';

interface NavProps {
    toggleDropdownMenu?: () => void;
}

function Nav({ toggleDropdownMenu }: NavProps) {
    const { toggleFilters } = useFiltersContext();
    const { handleInputChange } = useSearchContext();
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

    const handleCloseMobileSearch = () => {
        setIsMobileSearchOpen(false);
        handleInputChange('');
    }

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

                {/* Search Section */}
                <SearchSection isMobileSearchOpen={isMobileSearchOpen} />

                {/* Right side icons */}
                <NavActions
                    isMobileSearchOpen={isMobileSearchOpen}
                    onCloseMobileSearch={handleCloseMobileSearch}
                    onOpenMobileSearch={() => setIsMobileSearchOpen(true)}
                    toggleFilters={toggleFilters}
                    toggleDropdownMenu={toggleDropdownMenu}
                />
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