'use client';

import '@/app/scss/layout/ClientLayout.scss';
import { useState } from "react";
import { useAuth } from '../lib/hooks';
import { NavigationProvider } from '../context/NavigationContext';
import { SearchProvider, useSearchContext } from '../context/SearchContext';
import { FiltersProvider } from '../context/FiltersModalContext';
import { MenuProvider, useMenu } from '../context/MenuContext';
import Nav from "./topnav/nav";
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { MainPageSkeleton } from './skeletons';
import SuspenseWrapper from './SuspenseWrapper';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import FiltersModal from './filters/FiltersModal';
import { trpc, getBaseUrl } from '../lib/trpc';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpLink } from '@trpc/client';
import Footer from './footer/Footer';
import SidePanel from './panel/SidePanel';

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
                {/* Loading Progress Bar */}
                <ProgressBar
                    height="5px"
                    color="#ff1493"
                    options={{ showSpinner: false, easing: 'ease', speed: 200 }}
                    shallowRouting
                />
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
    const { closeSearchModal } = useSearchContext();
    const { isMenuOpen, toggleMenu, closeMenu } = useMenu();
    // Removed old menu ref

    // Use MenuContext for unified right-side panel
    const closeSidePanel = closeMenu;

    return (
        <div className="app-layout">

            {/* Sticky Nav Header */}
            <header className="header">
                <Nav
                    toggleDropdownMenu={toggleMenu}
                    isMenuOpen={isMenuOpen}
                />
            </header>

            {/* Right Side Panel Component (combined menu) */}
            <SidePanel open={isMenuOpen} onClose={closeSidePanel} anchor="right" />

            {/* Main layout grid */}
            <div className="main-layout-grid">
                <div className="main-content">
                    {children}
                </div>
            </div>

            {/* Filters Modal */}
            <FiltersModal />

            <ClickAwayListener onClickAway={closeSearchModal}>
                <div></div>
            </ClickAwayListener>

            {/* Footer */}
            <Footer />
        </div >
    );
}
