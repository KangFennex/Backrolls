'use client';

import { useState, useRef } from "react";
import { useAuth } from '../lib/hooks';
import { SeriesProvider } from '../context/SeriesContext';
import { NavigationProvider } from '../context/NavigationContext';
import { SearchProvider, useSearchContext } from '../context/SearchContext';
import Nav from "./topnav/nav";
import Menu from "./menu/menu"
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
                    position: sticky;
                    top: 0;
                    z-index: 50;
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
            <header className="header">
                <Nav toggleSideMenu={toggleSideMenu} />
            </header>

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
            <div className="main min-h-screen overflow-x-hidden overflow-y-hidden w-full min-w-0 max-w-full">
                {children}
            </div>
        </div>
    );
}
