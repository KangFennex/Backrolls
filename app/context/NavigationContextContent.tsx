'use client'

import { ReactNode } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { Quote } from '../lib/definitions';
import { useBackrollsStore } from '../store/backrollsStore';
import { NavigationContext } from './NavigationContext';

interface NavigationContextContentProps {
    children: ReactNode;
}

export function NavigationContextContent({ children }: NavigationContextContentProps) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const setDisplayResultsToStore = useBackrollsStore((state) => state.setDisplayResults);

    const navigateToBackroll = (quote: Quote, searchQuery?: string) => {
        const params = new URLSearchParams(searchParams);

        if (searchQuery) {
            params.set('query', searchQuery);
        } else {
            params.delete('query');
        }

        console.log('navigateToBackroll - searchQuery:', searchQuery);

        // Clear page parameter if not already on backrolls page
        if (pathname !== '/backrolls') {
            params.delete('page');
        }

        console.log('navigateToBackroll - pathname:', pathname);

        // Clear parameters that don't belong on backrolls page
        params.delete('limit');

        // Set the single quote to display
        setDisplayResultsToStore([quote]);

        console.log('navigateToBackroll - navigating to /backrolls with params:', params.toString());

        // Navigate to backrolls page
        router.replace(`/backrolls?${params.toString()}`);

        console.log('navigateToBackroll - finished navigating');
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

        // Clear parameters that don't belong on backrolls page
        params.delete('limit');

        // Set all quotes to display
        setDisplayResultsToStore(quotes);

        // Navigate to backrolls page
        router.replace(`/backrolls?${params.toString()}`);
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