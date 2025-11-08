'use client';

import './ClientLayout.scss';
import { useState, useRef } from "react";
import { useAuth, useScrollDirection } from '../lib/hooks';
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
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
            suspense: true, // Enable Suspense mode globally
        },
    },
})

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <NavigationProvider>
                <SearchProvider>
                    <FilterProvider>
                        <SuspenseWrapper fallback={<MainPageSkeleton />}>
                            <ClientLayoutContent>
                                {children}
                            </ClientLayoutContent>
                        </SuspenseWrapper>
                    </FilterProvider>
                </SearchProvider>
            </NavigationProvider>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
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
            {/* Filter Bar - Absolute positioned (moves with nav when at top) */}
            <div className={`filter-bar-absolute ${isNavVisible && isAtTop ? 'visible' : ''}`}>
                <div className="filter-selectors-container">
                    <FilterSelectors />
                </div>
            </div>

            {/* Filter Bar - Fixed positioned (always at top when nav is hidden) */}
            <div className={`filter-bar-fixed ${isNavVisible && isAtTop ? 'hidden' : ''}`}>
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
