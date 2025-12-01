'use client'

import { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { Quote } from '../lib/definitions';
import { useNavigationContext } from './NavigationContext';
import { trpc } from '../lib/trpc';
import { convertTRPCQuotes } from '../lib/utils';

interface SearchContextType {
    // Search state
    searchModal: boolean;
    searchInput: string;
    searchResults: Quote[];
    loading: boolean;

    // Search modal controls
    openSearchModal: () => void;
    closeSearchModal: () => void;

    // Search functions
    handleInputChange: (input: string) => void;
    handleSearchSubmit: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    handleSetBackroll: (backroll: Quote) => void;
    clearSearchInput: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
    const { navigateToBackroll, navigateToBackrollsWithResults } = useNavigationContext();
    const utils = trpc.useUtils();

    const [searchModal, setSearchModal] = useState(false);
    const [searchInput, setSearchInput] = useState<string>("");
    const [searchResults, setSearchResults] = useState<Quote[]>([]);
    const [loading, setLoading] = useState(false);

    const openSearchModal = useCallback(() => setSearchModal(true), []);
    const closeSearchModal = useCallback(() => setSearchModal(false), []);

    // Clear the search bar
    const clearSearchInput = useCallback(() => {
        setSearchModal(false);
        setSearchInput("");
        setSearchResults([]);
    }, []);

    // Implement search function
    const searchQuotesHandler = useCallback(async (input: string) => {
        if (!input.trim()) {
            clearSearchInput();
            setLoading(false);
            return;
        }
        setLoading(true);
        openSearchModal();

        // Fetch search results using tRPC
        try {
            console.log('Starting the search with tRPC');
            const results = await utils.quotes.search.fetch({ query: input });
            console.log('Search completed', results);
            // tRPC serializes Date objects to strings, convert them back
            setSearchResults(convertTRPCQuotes(results));
        } catch (error) {
            console.error('Search error:', error);
            setSearchResults([]);
        }

        setLoading(false);
    }, [clearSearchInput, openSearchModal, utils]);

    const debouncedSearchQuotesHandler = useDebouncedCallback(searchQuotesHandler, 300);

    const handleInputChange = useCallback((input: string) => {
        setSearchInput(input);
        debouncedSearchQuotesHandler(input);
    }, [debouncedSearchQuotesHandler]);

    const handleSetBackroll = useCallback((backroll: Quote) => {
        if (searchModal) {
            closeSearchModal();
        }
        clearSearchInput();
        navigateToBackroll(backroll);
    }, [searchModal, closeSearchModal, clearSearchInput, navigateToBackroll]);

    const handleSearchSubmit = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();

            if (!searchInput.trim()) return;

            closeSearchModal();
            clearSearchInput();
            navigateToBackrollsWithResults(searchInput);
        }
    }, [closeSearchModal, clearSearchInput, searchInput, navigateToBackrollsWithResults]);

    return (
        <SearchContext.Provider value={{
            searchModal,
            searchInput,
            searchResults,
            loading,
            openSearchModal,
            closeSearchModal,
            handleInputChange,
            handleSearchSubmit,
            handleSetBackroll,
            clearSearchInput
        }}>
            {children}
        </SearchContext.Provider>
    );
}

export function useSearchContext() {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error('useSearchContext must be used within a SearchProvider');
    }
    return context;
}