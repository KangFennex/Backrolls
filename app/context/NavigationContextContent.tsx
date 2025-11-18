'use client'

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Quote } from '../lib/definitions';
import { NavigationContext } from './NavigationContext';

interface NavigationContextContentProps {
    children: ReactNode;
}

export function NavigationContextContent({ children }: NavigationContextContentProps) {
    const router = useRouter();

    // Navigate to a single quote detail page
    const navigateToBackroll = (quote: Quote) => {
        router.push(`/backrolls/${quote.id}`);
    };

    // Navigate to search results page
    const navigateToBackrollsWithResults = (searchQuery: string) => {
        router.push(`/backrolls?search=${encodeURIComponent(searchQuery)}`);
    };

    return (
        <NavigationContext.Provider value={{
            navigateToBackroll,
            navigateToBackrollsWithResults,
        }}>
            {children}
        </NavigationContext.Provider>
    );
}