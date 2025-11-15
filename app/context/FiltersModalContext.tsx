'use client'

import { createContext, useContext, ReactNode, useState } from 'react';

interface FilterContextType {
    isFiltersModalVisible: boolean;
    toggleFilters: () => void;
}

const FiltersContext = createContext<FilterContextType | undefined>(undefined);

export function FiltersProvider({ children }: { children: ReactNode }) {
    const [isFiltersModalVisible, setIsFiltersModalVisible] = useState(false);

    const toggleFilters = () => setIsFiltersModalVisible(prev => !prev);

    return (
        <FiltersContext.Provider value={{
            isFiltersModalVisible,
            toggleFilters,
        }}>
            {children}
        </FiltersContext.Provider>
    );
}

export function useFiltersContext() {
    const context = useContext(FiltersContext);
    if (!context) {
        throw new Error('useFiltersContext must be used within a FiltersProvider');
    }
    return context;
}