import { useEffect, useState } from "react";

export default function usePlaceholderLogic() {
    const placeholders = [
        "It's getting gaggy",
        "Party",
        "Let's get sickening",
        "Bam!",
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

export const selectBackgroundColor = () => {
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

    // Select a random color from the array
    const randomColor = backgroundColor[Math.floor(Math.random() * backgroundColor.length)];
    return randomColor;
}

export const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) return 'just now';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30);
    return `${months}mo ago`;
};

// Helper function to format region display
export const adjustedRegion = (region: string | null) => {
    if (region === 'americas') return "Americas";
    if (region === 'asia') return "Asia";
    if (region === 'europe') return "Europe";
    if (region === 'oceania') return "Oceania";
    if (region === 'africa') return "Africa";
    if (region === 'global') return "Global";
    return region;
};
export {
    contestantImages,
    DEFAULT_CONTESTANT_FALLBACK_IMAGE,
    getSpeakerBackgroundImageValue,
    getSpeakerImage,
    getSpeakerImageWithFallback,
} from './contestantImages';
