'use client';

import './ClientLayout.scss';
import { useRef } from "react";
import { useAuth, useScrollDirection } from '../lib/hooks';
import { NavigationProvider } from '../context/NavigationContext';
import { SearchProvider, useSearchContext } from '../context/SearchContext';
import { FiltersProvider } from '../context/FiltersModalContext';
import { MenuProvider, useMenu } from '../context/MenuContext';
import Nav from "./topnav/nav";
import Menu from "./menu/menu"
import { FilterSelectors } from './filters/FilterSelectors';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { MainPageSkeleton } from './skeletons';
import SuspenseWrapper from './SuspenseWrapper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { usePathname } from 'next/navigation';
import FiltersModal from './filters/FiltersModal';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
        },
    },
})

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <NavigationProvider>
                <SearchProvider>
                    <FiltersProvider>
                        <MenuProvider>
                            <SuspenseWrapper fallback={<MainPageSkeleton />}>
                                <ClientLayoutContent>
                                    {children}
                                </ClientLayoutContent>
                            </SuspenseWrapper>
                        </MenuProvider>
                    </FiltersProvider>
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
    const { isMenuOpen, toggleMenu, closeMenu } = useMenu();
    const menuRef = useRef<HTMLDivElement>(null);

    const isMainPage = usePathname() === '/';

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

            {/* Fixed Nav Header - Slides above filter bar */}
            <header className="header">
                <Nav 
                    toggleDropdownMenu={toggleMenu} 
                    isVisible={isNavVisible}
                    isMenuOpen={isMenuOpen}
                />
            </header>

            {/* Dropdown Menu */}
            <ClickAwayListener 
                onClickAway={closeMenu}
                mouseEvent={isMenuOpen ? 'onMouseDown' : false}
                touchEvent={isMenuOpen ? 'onTouchStart' : false}
            >
                <div>
                    <Menu isOpen={isMenuOpen} ref={menuRef} />
                </div>
            </ClickAwayListener>

            {/* Main content area with margin for fixed filter bar */}
            <div className={`main-content ${isMainPage ? 'isMainPage' : ''}`}>
                {children}
            </div>

            {/* Filters Modal */}
            <FiltersModal />

            <ClickAwayListener onClickAway={closeSearchModal}>
                <div></div>
            </ClickAwayListener>
        </div>
    );
}
