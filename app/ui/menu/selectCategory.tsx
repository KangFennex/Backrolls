'use client';

import './menu.scss';
import { categories } from '../../lib/repertoire';
import { selectBackgroundColor } from "../../lib/utils"
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

export default function SelectCategory() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);

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
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setShowLeftArrow(scrollLeft > 0);
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
        }
    };

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({
                left: -200,
                behavior: 'smooth'
            });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({
                left: 200,
                behavior: 'smooth'
            });
        }
    };

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (container) {
            checkScrollPosition();
            container.addEventListener('scroll', checkScrollPosition);

            // Check on resize
            const handleResize = () => {
                setTimeout(checkScrollPosition, 100);
            };
            window.addEventListener('resize', handleResize);

            return () => {
                container.removeEventListener('scroll', checkScrollPosition);
                window.removeEventListener('resize', handleResize);
            };
        }
    }, []);

    return (
        <div className="relative flex items-center w-full">
            {/* Left Arrow */}
            {showLeftArrow && (
                <button
                    onClick={scrollLeft}
                    className="absolute left-2 z-10 w-8 h-8 bg-white border border-gray-300 rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-all duration-150"
                    aria-label="Scroll left"
                >
                    <IoIosArrowBack className="w-4 h-4 text-gray-600" />
                </button>
            )}

            {/* Scrollable Menu Container */}
            <div
                ref={scrollContainerRef}
                className="select-category flex text-gray-800 gap-2 items-center justify-center overflow-x-auto flex-1"
                onScroll={checkScrollPosition}
            >
                {categories.map((category, idx) => {
                    const active = isActive(category.href);
                    return (
                        <Link
                            key={idx}
                            href={category.href}
                            style={{ backgroundColor: selectBackgroundColor(idx) }}
                            className={`
                                flex border rounded-md justify-center items-center cursor-pointer py-1 px-2 whitespace-nowrap flex-shrink-0 min-w-max
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

            {/* Right Arrow */}
            {showRightArrow && (
                <button
                    onClick={scrollRight}
                    className="absolute right-2 z-10 w-8 h-8 bg-white border border-gray-300 rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-all duration-150"
                    aria-label="Scroll right"
                >
                    <IoIosArrowForward className="w-4 h-4 text-gray-600" />
                </button>
            )}
        </div>
    );
}
