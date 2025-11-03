'use client';

import { useState, useEffect } from 'react';

interface UseScrollDirectionProps {
    threshold?: number;
}

export const useScrollDirection = ({ threshold = 10 }: UseScrollDirectionProps = {}) => {
    const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
    const [isNavVisible, setIsNavVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isAtTop, setIsAtTop] = useState(true);

    useEffect(() => {
        const updateScrollDirection = () => {
            const scrollY = window.scrollY;
            const direction = scrollY > lastScrollY ? 'down' : 'up';
            const atTop = scrollY < 45; // Consider "at top" if within 45px

            setIsAtTop(atTop);

            if (direction !== scrollDirection && Math.abs(scrollY - lastScrollY) > threshold) {
                setScrollDirection(direction);

                // Show nav when scrolling up or at the top
                // Hide nav when scrolling down and past threshold
                if (direction === 'up' || atTop) {
                    setIsNavVisible(true);
                } else if (direction === 'down' && scrollY > 100) {
                    setIsNavVisible(false);
                }
            }

            setLastScrollY(scrollY > 0 ? scrollY : 0);
        };

        const handleScroll = () => {
            window.requestAnimationFrame(updateScrollDirection);
        };

        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, [scrollDirection, lastScrollY, threshold]);

    return { scrollDirection, isNavVisible, isAtTop };
};