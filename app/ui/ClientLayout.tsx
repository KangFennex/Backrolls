'use client';

import { useState, useRef } from "react";
import { useAuth } from '../lib/hooks';
import { SeriesProvider } from '../context/SeriesContext';
import Nav from "./topnav/nav";
import Menu from "./menu/menu"
import SearchModal from "./search/SearchModal";
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Portal from '@mui/material/Portal';
import { useDebouncedCallback } from 'use-debounce';
import { Quote } from '../lib/definitions';
import { useBackrollsStore } from "../store/backrollsStore";
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    useAuth();

    const setDisplayResultsToStore = useBackrollsStore((state) => state.setDisplayResults);

    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const router = useRouter();

    const [searchModal, setSearchModal] = useState(false);
    const [searchInput, setSearchInput] = useState<string>("")
    const [searchResults, setSearchResults] = useState<Quote[]>([])
    const [loading, setLoading] = useState(false);

    const openSearchModal = () => setSearchModal(true);
    const closeSearchModal = () => setSearchModal(false);

    const [menu, setMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Clear the search bar
    const clearSearchInput = () => {
        closeSearchModal();
        setSearchInput("");
        setSearchResults([]);
    };

    // Implement search function
    const searchQuotesHandler = async (input: string) => {
        if (!input.trim()) {
            clearSearchInput()
            setLoading(false);
            return;
        }
        setLoading(true);
        openSearchModal();

        // Fetch search results from the API
        try {
            const response = await fetch(`/api/search?q=${encodeURIComponent(input)}`);
            if (response.ok) {
                console.log('Starting the search fetch');
                const data = await response.json();
                console.log('Search fetch completed', data);
                setSearchResults(data.quotes || []);
            } else {
                console.error('Search failed');
                setSearchResults([]);
            }
        } catch (error) {
            console.error('Search error:', error);
            setSearchResults([]);
        }

        setLoading(false);
    }

    const debouncedSearchQuotesHandler = useDebouncedCallback(searchQuotesHandler, 300);

    const handleInputChange = (input: string) => {
        setSearchInput(input);
        debouncedSearchQuotesHandler(input);
    };

    const handleSetBackroll = (backroll: Quote) => {
        const params = new URLSearchParams(searchParams);
        if (searchModal) {
            closeSearchModal();
        }
        if (clearSearchInput) {
            clearSearchInput();
        }
        if (searchInput) {
            params.set('query', searchInput);
        } else {
            params.delete('query');
        }
        if (pathname !== '/backrolls') {
            params.delete('page');
        }
        console.log(params.toString())
        setLoading(true);
        setDisplayResultsToStore([backroll])
        replace(`/backrolls?${params.toString()}`);
        router.replace(`/backrolls?${params.toString()}`);
        setLoading(false);
    }

    const handleSearchSubmit = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();

            const params = new URLSearchParams(searchParams);
            if (searchInput) {
                params.set('query', searchInput);
            } else {
                params.delete('query');
            }
            if (pathname !== '/backrolls') {
                params.delete('page');
            }
            console.log(params.toString())
            closeSearchModal();
            setLoading(true);

            try {
                const response = await fetch(`/api/search?q=${encodeURIComponent(searchInput)}`);
                if (response.ok) {
                    const data = await response.json();
                    setDisplayResultsToStore(data.quotes || []);
                } else {
                    console.error('Search failed');
                    setDisplayResultsToStore([]);
                }
            } catch (error) {
                console.error('Search error:', error);
                setDisplayResultsToStore([]);
            }

            replace(`/backrolls?${params.toString()}`);
            router.replace(`/backrolls?${params.toString()}`);
            setLoading(false);
        }
    };

    return (
        <SeriesProvider>
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
                    <Nav
                        menu={menu}
                        setMenu={setMenu}
                        searchModal={searchModal}
                        openSearchModal={openSearchModal}
                        handleInputChange={handleInputChange}
                        clearSearchInput={clearSearchInput}
                        searchInput={searchInput}
                        handleSearchSubmit={handleSearchSubmit}
                    />
                </header>

                <div className="sidebar">
                    <Menu menu={menu} setMenu={setMenu} ref={menuRef} />
                </div>

                <ClickAwayListener onClickAway={closeSearchModal}>
                    <Portal>
                        {searchModal && <SearchModal
                            searchResults={searchResults}
                            loading={loading}
                            handleSetBackroll={handleSetBackroll}
                        />}
                    </Portal>
                </ClickAwayListener>
                <div className="main pt-14 md:pt-0 min-h-screen overflow-x-hidden overflow-y-hidden">
                    {children}
                </div>
            </div>
        </SeriesProvider>
    );
}