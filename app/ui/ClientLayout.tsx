'use client';

import { useState, useEffect, useRef } from "react";
import Nav from "./topnav/nav";
import Menu from "./topnav/menu/menu"
import SearchModal from "./search/SearchModal";
import { searchQuotes } from '../lib/data';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Portal from '@mui/material/Portal';

export default function ClientLayout({ children }: { children: React.ReactNode }) {

    const [searchModal, setSearchModal] = useState(false);
    const [searchInput, setSearchInputState] = useState<string>("")
    const [searchResults, setSearchResults] = useState<typeof quotes>([])
    const [loading, setLoading] = useState(false);

    const setSearchInput = (input: string) => {
        setSearchInputState(input);
    };

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
            setSearchResults([]);
            setLoading(false);
            return;
        }
        setLoading(true);
        const results = await searchQuotes(input);
        setSearchResults(results);
        setLoading(false);
    }

    // useEffect to trigger search when input changes after 0.3s
    useEffect(() => {
        const timer = setTimeout(() => {
            searchQuotesHandler(searchInput);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchInput]);

    return (
        <>
            <Nav
                menu={menu}
                setMenu={setMenu}
                searchModal={searchModal}
                openSearchModal={openSearchModal}
                setSearchInput={setSearchInput}
                clearSearchInput={clearSearchInput}
                searchInput={searchInput}
            />
            <div className="overflow-x-hidden overflow-y-hidden">

                <div>
                    <Menu menu={menu} setMenu={setMenu} ref={menuRef} />
                </div>

                <ClickAwayListener onClickAway={closeSearchModal}>
                    <Portal>
                        {searchModal && <SearchModal
                            searchResults={searchResults}
                            loading={loading}
                            clearSearchInput={clearSearchInput}
                        />}
                    </Portal>
                </ClickAwayListener>
                <div className="pt-14 min-h-screen">
                    {children}
                </div>
            </div>
        </>
    );
}