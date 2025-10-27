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