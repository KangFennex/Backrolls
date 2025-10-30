'use client';

import { useState, useRef } from "react";
import { useAuth } from '../lib/hooks';
import { SeriesProvider } from '../context/SeriesContext';
import { NavigationProvider } from '../context/NavigationContext';
import { SearchProvider, useSearchContext } from '../context/SearchContext';
import Nav from "./topnav/nav";
import Menu from "./menu/menu"
import SearchModal from "./search/SearchModal";
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Portal from '@mui/material/Portal';

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

    const { searchModal, closeSearchModal } = useSearchContext();

    const [menu, setMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    return (
        <div className="app-layout">
            <style jsx global>{`
                .app-layout {
                    display: grid;
                    grid-template-areas: 
                        "header header"
                        "sidebar main";
                    grid-template-columns: 200px 1fr;
                    grid-template-rows: auto 1fr;
                    min-height: 100vh;
                }
                
                .header { grid-area: header; }
                .sidebar { grid-area: sidebar; }
                .main { grid-area: main; }
                
                @media (max-width: 768px) {
                    .app-layout {
                        grid-template-areas: 
                            "header"
                            "sidebar"
                            "main";
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
            <header className="header">
                <Nav />
            </header>

            <div className="sidebar">
                <Menu menu={menu} setMenu={setMenu} ref={menuRef} />
            </div>

            <ClickAwayListener onClickAway={closeSearchModal}>
                <Portal>
                    {searchModal && <SearchModal />}
                </Portal>
            </ClickAwayListener>
            <div className="main mt-14 md:mt-0 min-h-screen overflow-x-hidden overflow-y-hidden">
                {children}
            </div>
        </div>
    );
}
