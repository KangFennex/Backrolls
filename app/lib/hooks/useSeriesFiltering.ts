import { codeEquivalence, series, seriesSeasons, seriesEpisodes } from '../newRepertoire';


export const useSeriesFiltering = () => {
    // This hook doesn't manage state - it gets from SeriesContext
    // and provides utility functions for the filtering component

    const getSeriesByRegion = (region: string) => {
        const regionMap: Record<string, string> = {
            'americas': 'americas',
            'asia': 'asia',
            'europe': 'europe',
            'oceania': 'oceania',
            'africa': 'africa',
            'global': 'global'
        };
        const seriesRegion = regionMap[region];
        return series.filter(s => s.region === seriesRegion);
    };

    const getSeriesOptions = (code: string) => {
        const seriesName = codeEquivalence[code] || code;
        return series
            .filter(s => s.name === seriesName)
            .map(s => ({
                value: s.name,
                label: s.name
            }));
    }

    const getSeasonCount = (code: string): number => {
        const seriesName = codeEquivalence[code] || code;
        return seriesSeasons[seriesName] || 1;
    };

    const getSeasonOptions = (code: string) => {
        const seasonCount = getSeasonCount(code);
        return Array.from({ length: seasonCount }, (_, i) => ({
            value: i + 1,
            label: `Season ${i + 1}`
        }));
    };

    const getEpisodeCount = (code: string, season: number): number => {
        const seriesName = codeEquivalence[code] || code;
        return seriesEpisodes[seriesName]?.[season] || seriesEpisodes.default?.[season] || 10;
    };

    const getEpisodeOptions = (code: string, season: number) => {
        const episodeCount = getEpisodeCount(code, season);
        return Array.from({ length: episodeCount }, (_, i) => ({
            value: i + 1,
            label: `Episode ${i + 1}`
        }));
    };

    return {
        getSeriesOptions,
        getSeasonCount,
        getSeasonOptions,
        getEpisodeOptions,
        getEpisodeCount,
        getSeriesByRegion
    };
};