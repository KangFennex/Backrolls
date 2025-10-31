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

    const [menu, setMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

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
                }
                
                .header { 
                    position: sticky;
                    top: 0;
                    z-index: 50;
                }
                
                .menu-section {
                    position: sticky;
                    top: 60px; /* Adjust this based on your header height */
                    z-index: 40;
                    border-bottom: 1px solid #e5e7eb;
                }
                
                .main { 
                    flex: 1;
                    width: 100%;
                }
            `}</style>
            <header className="header">
                <Nav />
            </header>

            <div className="menu-section">
                <Menu menu={menu} setMenu={setMenu} ref={menuRef} />
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
