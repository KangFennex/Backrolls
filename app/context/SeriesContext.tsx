'use client'

import { SeriesContextType } from '../lib/definitions';
import { createContext, useContext, Suspense } from 'react';
import { SeriesContextContent } from './SeriesContextContent';

export const SeriesContext = createContext<SeriesContextType | undefined>(undefined);

export function SeriesProvider({ children }: { children: React.ReactNode }) {
    return (
        <Suspense fallback={<div>Loading series...</div>}>
            <SeriesContextContent>
                {children}
            </SeriesContextContent>
        </Suspense>
    );
}

export function useSeriesContext() {
    const context = useContext(SeriesContext);
    if (!context) {
        throw new Error('useSeriesContext must be used within a SeriesProvider');
    }
    return context;
}