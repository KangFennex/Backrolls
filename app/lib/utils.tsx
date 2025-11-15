import { useEffect, useState } from "react";

export default function usePlaceholderLogic() {
    const placeholders = [
        "It's getting gaggy",
        "And I hoop",
        "Party",
        "Let's get sickening"
    ];

    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % placeholders.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [placeholders.length]);

    return placeholders[index];
}

export const selectBackgroundColor = (index: number): string => {
    const backgroundColor = [
        "#D1EED3", // Soft mint green
        "#F1E4AC", // Pale gold
        "#D8C3E0", // Lavender
        "#F6D7C5", // Peach
        "#F7A8B2", // Blush pink
        "#BCE5E2", // Seafoam green
        "#FFD6E5", // Cotton candy pink
        "#C9E4FF", // Baby blue
        "#E2F0CB", // Soft lime green
        "#FFE6CC", // Pale apricot
        "#E6D7FF", // Lilac
        "#B5EAD7", // Mint teal
        "#FFEDC9", // Buttery yellow
        "#D4F1F9", // Ice blue
        "#FFD8E6", // Bubblegum pink
        "#DCEDC1"  // Sage green
    ];

    return backgroundColor[index % backgroundColor.length];
}

// Assign card size based on quote text length with some randomness
export const getMosaicClass = (quoteText: string, index: number): string => {
    const textLength = quoteText.length;

    // Use index for pseudo-random distribution while keeping consistency
    const variant = index % 5;

    // Very long quotes (100+ chars) - always get large or wide
    if (textLength > 100) {
        return variant === 0 ? 'card-large' : 'card-wide';
    }

    // Long quotes (70-100 chars) - mostly wide, some large
    if (textLength > 70) {
        return variant < 2 ? 'card-wide' : variant === 2 ? 'card-large' : 'card-tall';
    }

    // Medium-long quotes (50-70 chars) - mix of wide and tall
    if (textLength > 50) {
        return variant === 0 ? 'card-wide' : variant < 3 ? 'card-tall' : '';
    }

    // Medium quotes (30-50 chars) - mostly tall, some normal
    if (textLength > 30) {
        return variant < 2 ? '' : '';
    }

    // Short quotes (< 30 chars) - mostly normal, occasional tall
    return variant === 0 ? 'card-tall' : '';
}