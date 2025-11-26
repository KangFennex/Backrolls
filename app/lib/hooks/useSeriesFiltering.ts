import { useMemo } from 'react';
import { codeEquivalence, series, seriesSeasons, seriesEpisodes, LANGUAGES } from '../newRepertoire';

export const useSeriesFiltering = () => {
    const memoizedFunctions = useMemo(() => {
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
        };

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

        const getSeriesOriginalLanguage = (seriesCode: string): string => {
            const seriesObj = series.find(s => s.code === seriesCode);
            return seriesObj?.original_language || LANGUAGES.ENGLISH;
        };

        const getAvailableLanguages = () => {
            const uniqueLanguages = [...new Set(series.map(s => s.original_language))];
            return uniqueLanguages.map(lang => ({
                value: lang,
                label: lang.charAt(0).toUpperCase() + lang.slice(1)
            }));
        };

        return {
            getSeriesOptions,
            getSeasonCount,
            getSeasonOptions,
            getEpisodeOptions,
            getEpisodeCount,
            getSeriesByRegion,
            getSeriesOriginalLanguage,
            getAvailableLanguages,
            LANGUAGES
        };
    }, []); // Empty dependency array since all data is static

    return memoizedFunctions;
};