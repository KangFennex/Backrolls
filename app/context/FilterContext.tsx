'use client'

import { createContext, useContext, ReactNode, useState } from 'react';

interface FilterContextType {
    isFilterVisible: boolean;
    showFilter: () => void;
    hideFilter: () => void;
    toggleFilter: () => void;
    isDrawerOpen: boolean;
    openDrawer: () => void;
    closeDrawer: () => void;
    toggleDrawer: () => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const showFilter = () => setIsFilterVisible(true);
    const hideFilter = () => setIsFilterVisible(false);
    const toggleFilter = () => setIsFilterVisible(prev => !prev);

    const openDrawer = () => setIsDrawerOpen(true);
    const closeDrawer = () => setIsDrawerOpen(false);
    const toggleDrawer = () => setIsDrawerOpen(prev => !prev);

    return (
        <FilterContext.Provider value={{
            isFilterVisible,
            showFilter,
            hideFilter,
            toggleFilter,
            isDrawerOpen,
            openDrawer,
            closeDrawer,
            toggleDrawer
        }}>
            {children}
        </FilterContext.Provider>
    );
}

export function useFilterContext() {
    const context = useContext(FilterContext);
    if (!context) {
        throw new Error('useFilterContext must be used within a FilterProvider');
    }
    return context;
}