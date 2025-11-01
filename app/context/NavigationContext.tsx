'use client'

import { createContext, useContext, ReactNode } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { Quote } from '../lib/definitions';
import { useBackrollsStore } from '../store/backrollsStore';

interface NavigationContextType {
    navigateToBackroll: (quote: Quote, searchQuery?: string) => void;
    navigateToBackrollsWithResults: (quotes: Quote[], searchQuery?: string) => void;
    navigateToRandomBackroll: (quote: Quote) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const setDisplayResultsToStore = useBackrollsStore((state) => state.setDisplayResults);

    const navigateToRandomBackroll = async (quote: Quote) => {
        try {
            // Set the single quote to display
            setDisplayResultsToStore([quote]);

            // Navigate to backrolls page
            router.replace(`/backrolls`);
        } catch (error) {
            console.error('Error navigating to random backroll:', error);
        }
    }

    const navigateToBackroll = (quote: Quote, searchQuery?: string) => {
        const params = new URLSearchParams(searchParams);

        if (searchQuery) {
            params.set('query', searchQuery);
        } else {
            params.delete('query');
        }

        // Clear page parameter if not already on backrolls page
        if (pathname !== '/backrolls') {
            params.delete('page');
        }

        // Set the single quote to display
        setDisplayResultsToStore([quote]);

        // Navigate to backrolls page
        router.replace(`/backrolls?${params.toString()}`);
    };

    const navigateToBackrollsWithResults = (quotes: Quote[], searchQuery?: string) => {
        const params = new URLSearchParams(searchParams);

        if (searchQuery) {
            params.set('query', searchQuery);
        } else {
            params.delete('query');
        }

        // Clear page parameter if not already on backrolls page
        if (pathname !== '/backrolls') {
            params.delete('page');
        }

        // Set all quotes to display
        setDisplayResultsToStore(quotes);

        // Navigate to backrolls page
        router.replace(`/backrolls?${params.toString()}`);
    };

    return (
        <NavigationContext.Provider value={{
            navigateToBackroll,
            navigateToBackrollsWithResults,
            navigateToRandomBackroll
        }}>
            {children}
        </NavigationContext.Provider>
    );
}

export function useNavigationContext() {
    const context = useContext(NavigationContext);
    if (!context) {
        throw new Error('useNavigationContext must be used within a NavigationProvider');
    }
    return context;
}