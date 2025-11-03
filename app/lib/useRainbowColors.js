'use client';

import { useState, useEffect } from 'react';

// Gay pride flag colors - Pastel versions
const RAINBOW_COLORS = [
    '#ffb3ba', // Pastel Red
    '#ffdfba', // Pastel Orange  
    '#ffffba', // Pastel Yellow
    '#baffc9', // Pastel Green
    '#bae1ff', // Pastel Blue
    '#e6baff', // Pastel Purple
];

export const useRainbowColors = () => {
    const [colorOffset, setColorOffset] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setColorOffset(prev => (prev + 1) % RAINBOW_COLORS.length);
        }, 5000); // Change every 5 seconds

        return () => clearInterval(interval);
    }, []);

    // Generate colors for each icon, ensuring no two icons have the same color
    const getColorForIcon = (iconIndex) => {
        const colorIndex = (iconIndex + colorOffset) % RAINBOW_COLORS.length;
        return RAINBOW_COLORS[colorIndex];
    };

    return { getColorForIcon };
};