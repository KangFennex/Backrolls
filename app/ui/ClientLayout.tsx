'use client';

import './ClientLayout.scss';
import { useRef, useState } from "react";
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
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import FiltersModal from './filters/FiltersModal';
import { trpc, getBaseUrl } from '../lib/trpc';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpLink } from '@trpc/client';
import RightSidePanel from './side-panels/RightSidePanel';
import { usePathname } from 'next/navigation';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 1000 * 60 * 5, // 5 minutes
                gcTime: 1000 * 60 * 10, // 10 minutes
            },
        },
    }));

    const [trpcClient] = useState(() =>
        trpc.createClient({
            links: [
                httpLink({
                    url: `${getBaseUrl()}/api/trpc`,
                    fetch(url, options) {
                        return fetch(url, {
                            ...options,
                            credentials: 'include',
                        });
                    },
                }),
            ],
        })
    );

    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
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
        </trpc.Provider>
    );
}

function ClientLayoutContent({ children }: { children: React.ReactNode }) {
    useAuth();
    const { isNavVisible, isAtTop } = useScrollDirection();
    const { closeSearchModal } = useSearchContext();
    const { isMenuOpen, toggleMenu, closeMenu } = useMenu();
    const menuRef = useRef<HTMLDivElement>(null);
    const currentPathname = usePathname();
    const isWorkroomPage = currentPathname === '/';

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
                    <Menu isOpen={isMenuOpen} ref={menuRef} onClick={closeMenu} />
                </div>
            </ClickAwayListener>


            {/* Main layout grid */}
            <div className="main-layout-grid">
                <div className="main-content">
                    {children}
                </div>
                {isWorkroomPage && (
                    <div className="right-side-panel">
                        <RightSidePanel />
                    </div>
                )}
            </div>

            {/* Filters Modal */}
            <FiltersModal />

            <ClickAwayListener onClickAway={closeSearchModal}>
                <div></div>
            </ClickAwayListener>
        </div >
    );
}
