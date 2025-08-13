'use client';

import { useState, useEffect, useRef } from "react";
import Nav from "./topnav/nav";
import Menu from "./topnav/menu/menu"
import SearchModal from "./search/SearchModal";
import { quotes } from "../lib/placeholder-data";

export default function ClientLayout({ children }: { children: React.ReactNode }) {

    const [searchModal, setSearchModal] = useState(false);
    const [searchInput, setSearchInput] = useState<string>("")
    const [searchResults, setSearchResults] = useState<typeof quotes>([])

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

    // Search function
    const searchQuotes = (input: string) => {

        if (!input.trim()) {
            setSearchResults([]);
            return;
        }

        const results = quotes.filter((quote) =>
            quote.quote_text.toLowerCase().includes(input.toLowerCase())
        );

        setSearchResults(results);
    };

    // Add useEffect to trigger search when input changes
    useEffect(() => {
        const timer = setTimeout(() => {
            searchQuotes(searchInput);
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
                closeSearchModal={closeSearchModal}
                setSearchInput={setSearchInput}
                clearSearchInput={clearSearchInput}
                searchInput={searchInput}
            />
            <div className="overflow-x-hidden overflow-y-hidden">

                <div>
                    <Menu menu={menu} setMenu={setMenu} ref={menuRef} />
                </div>

                {searchModal && <SearchModal
                    closeSearchModal={closeSearchModal}
                    searchResults={searchResults}
                />}

                <div className="flex-grow">
                    {children}
                </div>
            </div>
        </>
    );
}