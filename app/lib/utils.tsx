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

export const contestantImages: Record<string, string> = {
    // RuPaul
    'RuPaul': 'https://htsnvmrjwfbpjoqicyrk.supabase.co/storage/v1/object/public/contestant-avatar/RuPaul.jpg',
    //Michelle Visage
    'Michelle Visage': 'https://htsnvmrjwfbpjoqicyrk.supabase.co/storage/v1/object/public/contestant-avatar/MichelleVisage-rpdr-S3.jpg',
    // rpdr - S01
    'Akashia': 'https://htsnvmrjwfbpjoqicyrk.supabase.co/storage/v1/object/public/contestant-avatar/Akashia-rpdr-S1.jpg',
    'BeBe Zahara Benet': 'https://htsnvmrjwfbpjoqicyrk.supabase.co/storage/v1/object/public/contestant-avatar/BeBeZaharaBenet-rpdr-S1.jpg',
    'Nina Flowers': 'https://htsnvmrjwfbpjoqicyrk.supabase.co/storage/v1/object/public/contestant-avatar/NinaFlowers-rpdr-S1.jpg',
    'Jade Sotomayor': 'https://htsnvmrjwfbpjoqicyrk.supabase.co/storage/v1/object/public/contestant-avatar/JadeSotomayor-rpdr-S1.jpg',
    'Ongina': 'https://htsnvmrjwfbpjoqicyrk.supabase.co/storage/v1/object/public/contestant-avatar/Ongina-rpdr-S1.jpg',
    'Rebecca Glasscock': 'https://htsnvmrjwfbpjoqicyrk.supabase.co/storage/v1/object/public/contestant-avatar/RebeccaGlasscock-rpdr-S1.jpg',
    'Shannel': 'https://htsnvmrjwfbpjoqicyrk.supabase.co/storage/v1/object/public/contestant-avatar/Shannel-rpdr-S1.jpg',
    'Tammie Brown': 'https://htsnvmrjwfbpjoqicyrk.supabase.co/storage/v1/object/public/contestant-avatar/TammieBrown-rpdr-S1.jpg',
    'Porkchop Parker': 'https://htsnvmrjwfbpjoqicyrk.supabase.co/storage/v1/object/public/contestant-avatar/VictoriaParker-rpdr-S1.jpg',
    // rpdr - S02
    'Tyra Sanchez': 'https://htsnvmrjwfbpjoqicyrk.supabase.co/storage/v1/object/public/contestant-avatar/TyraSanchez-rpdr-S2.jpg',
    'Raven': 'https://htsnvmrjwfbpjoqicyrk.supabase.co/storage/v1/object/public/contestant-avatar/Raven-rpdr-S2.jpg',
    'Jujubee': 'https://htsnvmrjwfbpjoqicyrk.supabase.co/storage/v1/object/public/contestant-avatar/Jujubee-rpdr-S2.jpg',
    'Tatianna': 'https://htsnvmrjwfbpjoqicyrk.supabase.co/storage/v1/object/public/contestant-avatar/Tatianna-rpdr-S2.jpg',
    'Pandora Boxx': 'https://htsnvmrjwfbpjoqicyrk.supabase.co/storage/v1/object/public/contestant-avatar/PandoraBoxx-rpdr-S2.jpg',
    'Jessica Wild': 'https://htsnvmrjwfbpjoqicyrk.supabase.co/storage/v1/object/public/contestant-avatar/JessicaWild-rpdr-S2.jpg',
    'Sahara Davenport': 'https://htsnvmrjwfbpjoqicyrk.supabase.co/storage/v1/object/public/contestant-avatar/SaharaDavenport-rpdr-S2.jpg',
    'Sonique': 'https://htsnvmrjwfbpjoqicyrk.supabase.co/storage/v1/object/public/contestant-avatar/Sonique-rpdr-S2.jpg',
    'Morgan McMichaels': 'https://htsnvmrjwfbpjoqicyrk.supabase.co/storage/v1/object/public/contestant-avatar/MorganMcMichaels-rpdr-S2.jpg',
    'Mystique Summers': 'https://htsnvmrjwfbpjoqicyrk.supabase.co/storage/v1/object/public/contestant-avatar/MystiqueSummers-rpdr-S2.jpg',
    'Nicole Page Brooks': 'https://htsnvmrjwfbpjoqicyrk.supabase.co/storage/v1/object/public/contestant-avatar/NicolePaigeBrooks-rpdr-S2.jpg',
    'Shangela': 'https://htsnvmrjwfbpjoqicyrk.supabase.co/storage/v1/object/public/contestant-avatar/Shangela-rpdr-S2.jpg',
    // rpdr - S03
    'Raja': 'https://htsnvmrjwfbpjoqicyrk.supabase.co/storage/v1/object/public/contestant-avatar/Raja-rpdr-S3.jpg',
    'Manila Luzon': 'https://htsnvmrjwfbpjoqicyrk.supabase.co/storage/v1/object/public/contestant-avatar/ManilaLuzon-rpdr-S3.jpg',
    'Delta Work': 'https://htsnvmrjwfbpjoqicyrk.supabase.co/storage/v1/object/public/contestant-avatar/DeltaWork-rpdr-S3.jpg',
    'Carmen Carrera': 'https://htsnvmrjwfbpjoqicyrk.supabase.co/storage/v1/object/public/contestant-avatar/CarmenCarrera-rpdr-S3.jpg',
    'Stacy Layne Matthews': 'https://htsnvmrjwfbpjoqicyrk.supabase.co/storage/v1/object/public/contestant-avatar/StacyLayneMatthews-rpdr-S3.jpg',
    'Alexis Mateo': 'https://htsnvmrjwfbpjoqicyrk.supabase.co/storage/v1/object/public/contestant-avatar/AlexisMateo-rpdr-S3.jpg',
    'Yara Sofia': 'https://htsnvmrjwfbpjoqicyrk.supabase.co/storage/v1/object/public/contestant-avatar/YaraSofia-rpdr-S3.jpg',
    'India Ferrah': 'https://htsnvmrjwfbpjoqicyrk.supabase.co/storage/v1/object/public/contestant-avatar/IndiaFerrah-rpdr-S3.jpg',
    'Mimi Imfurst': 'https://htsnvmrjwfbpjoqicyrk.supabase.co/storage/v1/object/public/contestant-avatar/MimiImfurst-rpdr-S3.jpg',
    'Phoenix': 'https://htsnvmrjwfbpjoqicyrk.supabase.co/storage/v1/object/public/contestant-avatar/Phoenix-rpdr-S3.jpg',
    'Venus D-Lite': 'https://htsnvmrjwfbpjoqicyrk.supabase.co/storage/v1/object/public/contestant-avatar/VenusDLite-rpdr-S3.jpg',
    'Mariah': 'https://htsnvmrjwfbpjoqicyrk.supabase.co/storage/v1/object/public/contestant-avatar/Mariah-rpdr-S3.jpg',
    //'Shangela': 'https://htsnvmrjwfbpjoqicyrk.supabase.co/storage/v1/object/public/contestant-avatar/Shangela-rpdr-S3.jpg',
};

/**
 * Get the speaker's image URL from Supabase storage
 * @param speakerName - The name of the speaker/contestant
 * @returns The image URL or undefined if not found
 */
export const getSpeakerImage = (speakerName: string): string | undefined => {
    return contestantImages[speakerName];
};

/**
 * Get the speaker's image URL with a fallback to a default avatar
 * @param speakerName - The name of the speaker/contestant
 * @param fallbackUrl - Optional fallback URL (defaults to a placeholder)
 * @returns The image URL or fallback
 */
export const getSpeakerImageWithFallback = (
    speakerName: string,
    fallbackUrl: string = '/media/RuPaul-Chaka.jpg'
): string => {
    return contestantImages[speakerName] || fallbackUrl;
};
