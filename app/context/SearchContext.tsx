'use client'

import { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { Quote } from '../lib/definitions';
import { useNavigationContext } from './NavigationContext';

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
    }, [clearSearchInput, openSearchModal]);

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
        navigateToBackroll(backroll, searchInput);
    }, [searchModal, closeSearchModal, clearSearchInput, navigateToBackroll, searchInput]);

    const handleSearchSubmit = useCallback(async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();

            closeSearchModal();
            setLoading(true);

            try {
                const response = await fetch(`/api/search?q=${encodeURIComponent(searchInput)}`);
                if (response.ok) {
                    const data = await response.json();
                    navigateToBackrollsWithResults(data.quotes || [], searchInput);
                } else {
                    console.error('Search failed');
                    navigateToBackrollsWithResults([], searchInput);
                }
            } catch (error) {
                console.error('Search error:', error);
                navigateToBackrollsWithResults([], searchInput);
            }

            setLoading(false);
        }
    }, [closeSearchModal, searchInput, navigateToBackrollsWithResults]);

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