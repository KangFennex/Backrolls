'use client';

import { useState, useRef } from "react";
import { useAuth } from '../lib/hooks';
import { useScrollDirection } from '../lib/useScrollDirection';
import { SeriesProvider } from '../context/SeriesContext';
import { NavigationProvider } from '../context/NavigationContext';
import { SearchProvider, useSearchContext } from '../context/SearchContext';
import Nav from "./topnav/nav";
import Menu from "./menu/menu"
import { FilterSelectors } from './search/components/FilterSelectors';
import ClickAwayListener from '@mui/material/ClickAwayListener';

import SuspenseWrapper from './SuspenseWrapper';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <SuspenseWrapper fallback={<div>Loading application...</div>}>
            <SeriesProvider>
                <NavigationProvider>
                    <SearchProvider>
                        <ClientLayoutContent>
                            {children}
                        </ClientLayoutContent>
                    </SearchProvider>
                </NavigationProvider>
            </SeriesProvider>
        </SuspenseWrapper>
    );
}

function ClientLayoutContent({ children }: { children: React.ReactNode }) {
    useAuth();
    const { isNavVisible, isAtTop } = useScrollDirection();

    const { closeSearchModal } = useSearchContext();

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
                    top: 45px; /* Default for larger screens */
                    left: 0;
                    width: 100vw;
                    z-index: 50;
                    padding: 8px 16px;
                    backdrop-filter: blur(8px);
                    height: 45px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0;
                    box-sizing: border-box;
                    opacity: ${isNavVisible && isAtTop ? '1' : '0'};
                    visibility: ${isNavVisible && isAtTop ? 'visible' : 'hidden'};
                    transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
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
                    padding: 8px 16px;
                    backdrop-filter: blur(8px);
                    height: 45px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0;
                    box-sizing: border-box;
                    opacity: ${isNavVisible && isAtTop ? '0' : '1'};
                    visibility: ${isNavVisible && isAtTop ? 'hidden' : 'visible'};
                    transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
                }

                .main-content {
                    margin-top: ${isNavVisible && isAtTop ? '30px' : '25px'};
                    transition: margin-top 0.3s ease-in-out;
                }

                /* Responsive main content margin */
                @media (min-width: 769px) {
                    .main-content {
                        margin-top: ${isNavVisible && isAtTop ? '40px' : '25px'}; 
                    }
                }

                .main-blur {
                    position: relative;
                }

                .main-blur::before {
                    content: '';
                    position: absolute;
                    top: -10px;
                    left: 0;
                    right: 0;
                    height: 20px;
                    background: linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 100%);
                    backdrop-filter: blur(4px);
                    z-index: 1;
                    pointer-events: none;
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
                <FilterSelectors />
            </div>

            {/* Filter Bar - Fixed positioned (always at top when nav is hidden) */}
            <div className="filter-bar-fixed">
                <FilterSelectors />
            </div>

            {/* Fixed Nav Header - Slides above filter bar */}
            <header className="header">
                <Nav toggleSideMenu={toggleSideMenu} isVisible={isNavVisible} />
            </header>

            {/* Main content area with margin for fixed filter bar */}
            <div className="main-content">
                <div className="main main-blur min-h-screen overflow-x-hidden overflow-y-hidden w-full min-w-0 max-w-full">
                    {children}
                </div>
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
