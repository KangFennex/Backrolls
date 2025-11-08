import { series, seriesSeasons, seriesEpisodes } from '../repertoire';

export const useSeriesFiltering = () => {
    // This hook doesn't manage state - it gets from SeriesContext
    // and provides utility functions for the filtering component

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

    const getSeriesByCategory = (category: string) => {
        const categoryMap: Record<string, string> = {
            'main-series': 'main-series',
            'all-stars': 'all-stars',
            'international': 'international',
            'spin-off': 'spin-off'
        };

        const seriesType = categoryMap[category];
        return series.filter(s => s.type === seriesType);
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

    const getSeriesDisplayName = (seriesId: string): string => {
        const foundSeries = series.find(s => s.name === seriesId);
        return foundSeries?.name || seriesId;
    };

    return {
        getSeasonCount,
        getSeasonOptions,
        getEpisodeOptions,
        getEpisodeCount,
        getSeriesByCategory,
        getCategoryDisplayName,
        getSeriesDisplayName
    };
};