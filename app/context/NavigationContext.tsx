'use client'

import { createContext, useContext, ReactNode, Suspense } from 'react';
import { Quote } from '../lib/definitions';
import { NavigationContextContent } from './NavigationContextContent';

interface NavigationContextType {
    navigateToBackroll: (quote: Quote, searchQuery?: string) => void;
    navigateToBackrollsWithResults: (quotes: Quote[], searchQuery?: string) => void;
}

export const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
    return (
        <Suspense fallback={<div>Loading navigation...</div>}>
            <NavigationContextContent>
                {children}
            </NavigationContextContent>
        </Suspense>
    );
}

export function useNavigationContext() {
    const context = useContext(NavigationContext);
    if (!context) {
        throw new Error('useNavigationContext must be used within a NavigationProvider');
    }
    return context;
}