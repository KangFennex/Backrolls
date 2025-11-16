'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface MenuContextType {
    isMenuOpen: boolean;
    openMenu: () => void;
    closeMenu: (event?: MouseEvent | TouchEvent) => void;
    toggleMenu: () => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function MenuProvider({ children }: { children: ReactNode }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const openMenu = useCallback(() => {
        setIsMenuOpen(true);
    }, []);

    const closeMenu = useCallback((event?: MouseEvent | TouchEvent) => {
        // Don't close if clicking on the arrow button itself
        if (event) {
            const target = event.target as HTMLElement;
            if (target.closest('[aria-label="Open menu"]')) {
                return;
            }
        }
        setIsMenuOpen(false);
    }, []);

    const toggleMenu = useCallback(() => {
        setIsMenuOpen(prev => {
            return !prev;
        });
    }, []);

    return (
        <MenuContext.Provider value={{ isMenuOpen, openMenu, closeMenu, toggleMenu }}>
            {children}
        </MenuContext.Provider>
    );
}

export function useMenu() {
    const context = useContext(MenuContext);
    if (context === undefined) {
        throw new Error('useMenu must be used within a MenuProvider');
    }
    return context;
}
