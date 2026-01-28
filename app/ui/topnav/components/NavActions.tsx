'use client';

import { FaSearch } from 'react-icons/fa';
import { RiCloseLargeFill } from "react-icons/ri";
import { LuPanelLeft } from "react-icons/lu";
import { IoFilterSharp } from "react-icons/io5";

interface NavActionsProps {
    isMobileSearchOpen: boolean;
    onCloseMobileSearch: () => void;
    onOpenMobileSearch: () => void;
    toggleFilters: () => void;
    toggleDropdownMenu?: () => void;
}

export function NavActions({
    isMobileSearchOpen,
    onCloseMobileSearch,
    onOpenMobileSearch,
    toggleFilters,
    toggleDropdownMenu
}: NavActionsProps) {
    return (
        <div className="flex flex-shrink-0 justify-end ml-auto pr-0 md:pr-2">
            <nav className="flex gap-1 sm:gap-2 items-center">
                {isMobileSearchOpen ? (
                    // Close button when mobile search is open
                    <button
                        onClick={onCloseMobileSearch}
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
                            onClick={onOpenMobileSearch}
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
                            onClick={toggleFilters}
                        >
                            <IoFilterSharp
                                title="Filter Backrolls"
                                size={26}
                                className="nav-icon-btn__icon"
                            />
                        </button>
                        {/* Menu Button */}
                        <button
                            onClick={toggleDropdownMenu}
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
    );
}
