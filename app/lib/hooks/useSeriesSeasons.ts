import { useState } from 'react';
import { seriesSeasons, seriesEpisodes } from '../repertoire';

// Local state hook for SubmitQuote and other components
export const useSeriesSeasons = () => {
    // ✅ Keep local state for components that don't need URL sync
    const [selectedSeries, setSelectedSeries] = useState<string>('RuPaul\'s Drag Race');
    const [selectedSeason, setSelectedSeason] = useState<number>(1);

    const getSeasonCount = (seriesName: string): number => {
        return seriesSeasons[seriesName] || 1;
    };

    const getSeasonOptions = (seriesName: string) => {
        const seasonCount = getSeasonCount(seriesName);
        return Array.from({ length: seasonCount }, (_, i) => ({
            value: i + 1,
            label: `Season ${i + 1}`
        }));
    };

    const getEpisodeCount = (seriesName: string, season: number): number => {
        return seriesEpisodes[seriesName]?.[season] || seriesEpisodes.default?.[season] || 10;
    };

    const getEpisodeOptions = (seriesName: string, season: number) => {
        const episodeCount = getEpisodeCount(seriesName, season);
        return Array.from({ length: episodeCount }, (_, i) => ({
            value: i + 1,
            label: `Episode ${i + 1}`
        }));
    };

    const getCategoryDisplayName = (category: string): string => {
        const displayNames: Record<string, string> = {
            'main-series': 'Main Series',
            'all-stars': 'All Stars',
            'international': 'International',
            'spin-off': 'Spin Offs'
        };
        return displayNames[category] || category;
    };

    return {
        selectedSeries,
        selectedSeason,
        setSelectedSeries,
        setSelectedSeason,
        getCategoryDisplayName,
        getSeasonCount,
        getSeasonOptions,
        getEpisodeOptions,
        getEpisodeCount,
    };
};