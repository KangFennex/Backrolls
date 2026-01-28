'use client';

import Search from '../../search/Search';

interface SearchSectionProps {
    isMobileSearchOpen: boolean;
}

export function SearchSection({ isMobileSearchOpen }: SearchSectionProps) {
    return (
        <>
            {/* Mobile Search - Full width when open */}
            {isMobileSearchOpen && (
                <div className="w-full max-w-[calc(100%-60px)] md:hidden">
                    <Search />
                </div>
            )}

            {/* Desktop Search - always visible on desktop, hidden on mobile */}
            {!isMobileSearchOpen && (
                <div className="hidden md:block absolute left-1/2 -translate-x-1/2 w-[60%] lg:w-[50%] max-w-[600px]">
                    <Search />
                </div>
            )}
        </>
    );
}
