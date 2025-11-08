'use client';

import './menu.scss';
import { categories } from '../../lib/repertoire';
import { selectBackgroundColor } from "../../lib/utils"
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRef, useEffect } from 'react';

export function SelectCategoryContent() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const isActive = (href: string) => {
        if (!href) return false;

        // Parse href manually to avoid URL constructor issues
        const [hrefPathname, hrefSearchString] = href.split('?');
        const hrefSearchParams = new URLSearchParams(hrefSearchString || '');

        // Check if pathname matches
        if (pathname !== hrefPathname) return false;

        // If there are search params in the href, check if they match current search params
        if (hrefSearchParams.size > 0) {
            for (const [key, value] of hrefSearchParams.entries()) {
                if (searchParams.get(key) !== value) {
                    return false;
                }
            }
        }

        return true;
    };

    const checkScrollPosition = () => {
        // This function is kept for potential future use but currently not needed
        return;
    };

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (container) {
            checkScrollPosition();

            // Check on resize
            const handleResize = () => {
                setTimeout(checkScrollPosition, 100);
            };
            window.addEventListener('resize', handleResize);

            return () => {
                window.removeEventListener('resize', handleResize);
            };
        }
    }, []);

    return (
        <div className="w-full">
            {/* Scrollable Menu Container */}
            <div
                ref={scrollContainerRef}
                className="select-category flex flex-col text-gray-800 gap-2 overflow-y-auto max-h-96"
            >
                {categories.map((category, idx) => {
                    const active = isActive(category.href);
                    return (
                        <Link
                            key={idx}
                            href={category.href}
                            style={{ backgroundColor: selectBackgroundColor(idx) }}
                            className={`
                                flex border rounded-md justify-center items-center cursor-pointer py-3 px-4 w-full
                                transition-all duration-150 ease-in-out
                                hover:shadow-md hover:scale-[0.98] hover:brightness-95
                                active:scale-[0.96] active:shadow-sm
                                ${active ? 'scale-[0.96] ring-2 ring-gray-400/30 shadow-[3px_3px_8px_rgba(0,0,0,0.2)]' : 'shadow-sm'}
                            `}
                        >
                            <h3 className="text-md font-semibold">{category.name}</h3>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}