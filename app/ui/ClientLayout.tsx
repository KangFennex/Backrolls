'use client';

import { useState, useRef } from "react";
import { useAuth } from '../lib/hooks';
import { useScrollDirection } from '../lib/useScrollDirection';
import { NavigationProvider } from '../context/NavigationContext';
import { SearchProvider, useSearchContext } from '../context/SearchContext';
import { FilterProvider, useFilterContext } from '../context/FilterContext';
import Nav from "./topnav/nav";
import Menu from "./menu/menu"
import { FilterSelectors } from './filter/FilterSelectors';
import FilterDrawer from './filter/FilterDrawer';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { MainPageSkeleton } from './skeletons';

import SuspenseWrapper from './SuspenseWrapper';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <SuspenseWrapper fallback={<MainPageSkeleton />}>
            <NavigationProvider>
                <SearchProvider>
                    <FilterProvider>
                        <ClientLayoutContent>
                            {children}
                        </ClientLayoutContent>
                    </FilterProvider>
                </SearchProvider>
            </NavigationProvider>
        </SuspenseWrapper>
    );
}

function ClientLayoutContent({ children }: { children: React.ReactNode }) {
    useAuth();
    const { isNavVisible, isAtTop } = useScrollDirection();

    const { closeSearchModal } = useSearchContext();
    const { isDrawerOpen, closeDrawer } = useFilterContext();

    const [sideMenuOpen, setSideMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const closeSideMenu = () => setSideMenuOpen(false);
    const toggleSideMenu = () => setSideMenuOpen(!sideMenuOpen);

    return (
        <div className="app-layout">
            <style jsx global>{`
                .app-layout {
                    display: flex;
                    flex-direction: column;
                    min-height: 100vh;
                    width: 100vw;
                    max-width: 100vw;
                    overflow-x: hidden;
                    position: relative;
                }
                
                .header { 
                    z-index: 51;
                    transition: transform 0.3s ease-in-out;
                }

                .filter-bar-absolute {
                    position: absolute;
                    top: 50px; /* Default for larger screens */
                    left: 0;
                    width: 100vw;
                    z-index: 50;
                    min-height: 50px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: flex-start;
                    margin: 0;
                    box-sizing: border-box;
                    opacity: ${isNavVisible && isAtTop ? '1' : '0'};
                    visibility: ${isNavVisible && isAtTop ? 'visible' : 'hidden'};
                    transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
                    background: var(--rich-charcoal);
                }

                /* Responsive positioning for smaller screens */
                @media (max-width: 768px) {
                    .filter-bar-absolute {
                        top: 95px; /* Larger value for mobile when search wraps */
                    }
                }

                .filter-bar-fixed {
                    position: fixed;
                    top: 0px;
                    left: 0;
                    width: 100vw;
                    z-index: 50;
                    min-height: 50px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: flex-start;
                    margin: 0;
                    box-sizing: border-box;
                    opacity: ${isNavVisible && isAtTop ? '0' : '1'};
                    visibility: ${isNavVisible && isAtTop ? 'hidden' : 'visible'};
                    transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
                    /* background: var(--rich-charcoal); */
                    background: rgba(34, 34, 34, 0.8);
                    backdrop-filter: blur(7px);
                }

                .filter-selectors-container {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    min-height: 50px;
                }

                .main-content {
                    width: 80%;
                    max-width: 1040px;
                    margin: auto;
                    margin-top: 30px;
                    transition: margin-top 0.3s ease-in-out;
                }

                /* Media queries for different screen sizes and aspect ratios */
                
                /* Large rectangular screens (ultrawide, external monitors) */
                @media (min-width: 1400px) {
                    .main-content {
                        max-width: 900px; /* More constrained on very wide screens */
                    }
                }
                
                /* Standard desktop screens */
                @media (min-width: 1024px) and (max-width: 1399px) {
                    .main-content {
                        max-width: 800px; /* Slightly more constrained than current */
                    }
                }
                
                /* Square-ish screens and smaller desktops */
                @media (min-width: 768px) and (max-width: 1023px) {
                    .main-content {
                        width: 85%;
                        max-width: 650px; /* Much more constrained for square screens */
                    }
                }
                
                /* Tablets in landscape */
                @media (min-width: 640px) and (max-width: 767px) {
                    .main-content {
                        width: 90%;
                        max-width: 600px;
                    }
                }
                
                /* Mobile devices (keep current good mobile experience) */
                @media (max-width: 639px) {
                    .main-content {
                        width: 95%;
                        max-width: none; /* Let mobile use full available width */
                    }
                }
                
                .side-menu {
                    position: fixed;
                    top: 0;
                    right: 0;
                    height: 100vh;
                    width: 200px;
                    background: white;
                    box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
                    transform: translateX(100%);
                    transition: transform 0.3s ease-in-out;
                    z-index: 60;
                    overflow-y: auto;
                }
                
                .side-menu.open {
                    transform: translateX(0);
                }
                
                .menu-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: rgba(0, 0, 0, 0.5);
                    z-index: 55;
                    opacity: 0;
                    visibility: hidden;
                    transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
                }
                
                .menu-overlay.open {
                    opacity: 1;
                    visibility: visible;
                }
                
                .main { 
                    flex: 1;
                    width: 100%;
                }
            `}</style>

            {/* Filter Bar - Absolute positioned (moves with nav when at top) */}
            <div className="filter-bar-absolute">
                <div className="filter-selectors-container">
                    <FilterSelectors />
                </div>
            </div>

            {/* Filter Bar - Fixed positioned (always at top when nav is hidden) */}
            <div className="filter-bar-fixed">
                <div className="filter-selectors-container">
                    <FilterSelectors />
                </div>
            </div>

            {/* Filter Drawer */}
            <FilterDrawer open={isDrawerOpen} onClose={closeDrawer} />

            {/* Fixed Nav Header - Slides above filter bar */}
            <header className="header">
                <Nav toggleSideMenu={toggleSideMenu} isVisible={isNavVisible} />
            </header>

            {/* Main content area with margin for fixed filter bar */}
            <div className="main-content">
                {children}
            </div>

            {/* Menu overlay */}
            <div
                className={`menu-overlay ${sideMenuOpen ? 'open' : ''}`}
                onClick={closeSideMenu}
            ></div>

            {/* Side menu */}
            <div className={`side-menu ${sideMenuOpen ? 'open' : ''}`} ref={menuRef}>
                <Menu closeSideMenu={closeSideMenu} />
            </div>

            <ClickAwayListener onClickAway={closeSearchModal}>
                <div></div>
            </ClickAwayListener>
        </div>
    );
}
