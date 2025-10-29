'use client'

import { SeriesContextType } from '../lib/definitions';
import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

const SeriesContext = createContext<SeriesContextType | undefined>(undefined);

export function SeriesProvider({ children }: { children: React.ReactNode }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    // Tracks if we're in the middle of an internal update
    const isInternalUpdate = useRef(false);

    // Extract series category from URL query category
    const [seriesCategory, setSeriesCategoryState] = useState<string>(() => {
        return searchParams.get('category') || 'main-series';
    });

    // Initialize state from URL params
    const [selectedSeries, setSelectedSeriesState] = useState<string | null>(() => {
        const series = searchParams.get('series')
        return series ? series : null;
    });

    const [selectedSeason, setSelectedSeasonState] = useState<number | null>(() => {
        const season = searchParams.get('season');
        return season ? parseInt(season) : null;
    });

    const [selectedEpisode, setSelectedEpisodeState] =
        useState<number | null>(() => {
            const episode = searchParams.get('episode');
            return episode ? parseInt(episode) : null;
        });

    // Update URL when state changes
    const updateURL = useCallback((newSeriesCategory: string, selectedSeries: string | null, season: number | null, episode: number | null) => {
        isInternalUpdate.current = true;
        const params = new URLSearchParams();

        params.set('category', newSeriesCategory);

        if (selectedSeries) {
            params.set('series', selectedSeries);
        } else {
            params.delete('series');
        }

        if (season) {
            params.set('season', season.toString());
        } else {
            params.delete('season');
        }

        if (episode) {
            params.set('episode', episode.toString());
        } else {
            params.delete('episode');
        }

        const newURL = `${pathname}${params.toString() ? '?' + params.toString() : ''}`;
        router.replace(newURL, { scroll: false });
    }, [pathname, router]);

    useEffect(() => {
        console.log('🔍 State changed:', {
            seriesCategory,
            selectedSeries,
            selectedSeason,
            selectedEpisode
        });
    }, [seriesCategory, selectedSeries, selectedSeason, selectedEpisode]);

    // Add this to see URL changes
    useEffect(() => {
        console.log('🌐 URL params changed:', {
            category: searchParams.get('category'),
            series: searchParams.get('series'),
            season: searchParams.get('season'),
            episode: searchParams.get('episode')
        });
    }, [searchParams]);

    // Wrapped setters that update both state and URL
    const setSeriesCategory = useCallback((newSeriesCategory: string) => {
        console.log('🎯 Setting category to:', newSeriesCategory);
        setSeriesCategoryState(newSeriesCategory);

        // Handles main-series auto-selection
        let newSeries = null;
        if (newSeriesCategory === 'main-series') {
            newSeries = "RuPaul's Drag Race";
            setSelectedSeriesState(newSeries);
        } else {
            setSelectedSeriesState(null);
        }
        setSelectedSeasonState(null);
        setSelectedEpisodeState(null);
        updateURL(newSeriesCategory, newSeries, null, null);
    }, [updateURL]);

    const setSelectedSeries = useCallback((series: string | null) => {
        console.log('📺 Setting series to:', series);
        setSelectedSeriesState(series);

        setSelectedSeasonState(null);
        setSelectedEpisodeState(null);

        updateURL(seriesCategory, series, null, null);

    }, [seriesCategory, updateURL]);

    // Fix other setters similarly
    const setSelectedSeason = useCallback((season: number | null) => {
        console.log('📅 Setting season to:', season);
        setSelectedSeasonState(season);

        setSelectedEpisodeState(null);

        updateURL(seriesCategory, selectedSeries, season, null);
    }, [seriesCategory, selectedSeries, updateURL]);

    const setSelectedEpisode = useCallback((episode: number | null) => {
        console.log('🎬 Setting episode to:', episode);
        setSelectedEpisodeState(episode);
        updateURL(seriesCategory, selectedSeries, selectedSeason, episode);
    }, [seriesCategory, selectedSeries, selectedSeason, updateURL]);

    const clearFilters = useCallback(() => {
        setSeriesCategoryState('main-series');
        setSelectedSeriesState(null);
        setSelectedSeasonState(null);
        setSelectedEpisodeState(null);
        updateURL(seriesCategory, selectedSeries, null, null);
    }, [seriesCategory, selectedSeries, updateURL]);

    // Syncs only with URL changes from external navigation (browser back/forward)

    useEffect(() => {
        if (isInternalUpdate.current) {
            isInternalUpdate.current = false;
            return;
        }

        const categoryFromURL = searchParams.get('category') || 'main-series';
        const seriesFromURL = searchParams.get('series');
        const seasonFromURL = searchParams.get('season');
        const episodeFromURL = searchParams.get('episode');

        // Only update if values actually changed
        if (categoryFromURL !== seriesCategory) {
            setSeriesCategoryState(categoryFromURL);
        }

        if (seriesFromURL !== selectedSeries) {
            setSelectedSeriesState(seriesFromURL);
        }

        const newSeason = seasonFromURL ? parseInt(seasonFromURL) : null;
        if (newSeason !== selectedSeason) {
            setSelectedSeasonState(newSeason);
        }

        const newEpisode = episodeFromURL ? parseInt(episodeFromURL) : null;
        if (newEpisode !== selectedEpisode) {
            setSelectedEpisodeState(newEpisode);
        }
    }, [searchParams, seriesCategory, selectedSeries, selectedSeason, selectedEpisode]);

    // Clear filters when navigating to different pages (not series page)
    useEffect(() => {
        if (!pathname.includes('/series')) {
            setSelectedSeriesState(null);
            setSelectedSeasonState(null);
            setSelectedEpisodeState(null);
            setSeriesCategoryState('main-series');
        }
    }, [pathname]);

    return (
        <SeriesContext.Provider value={{
            seriesCategory,
            selectedSeries,
            selectedSeason,
            selectedEpisode,
            setSeriesCategory,
            setSelectedSeries,
            setSelectedSeason,
            setSelectedEpisode,
            clearFilters
        }}>
            {children}
        </SeriesContext.Provider>
    );
}

export function useSeriesContext() {
    const context = useContext(SeriesContext);
    if (!context) {
        throw new Error('useSeriesContext must be used within a SeriesProvider');
    }
    return context;
}