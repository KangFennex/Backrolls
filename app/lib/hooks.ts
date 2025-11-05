import { useState, useEffect, useCallback } from 'react';
import { useBackrollsStore } from '../store/backrollsStore';
import { series, seriesSeasons, seriesEpisodes } from './repertoire';
import { Quote, ExtendedUser } from './definitions';
import { NextResponse } from 'next/server';
import { useSession } from 'next-auth/react';

export function useQuotes(type: string, enabled = true) {
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchQuotes = useCallback(async () => {
        if (!enabled) return;

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/display?type=${type}&limit=10`);
            const data = await response.json();

            if (data.success) {
                setQuotes(data.quotes || []);
            } else {
                setError(data.error || 'Failed to fetch quotes');
            }
        } catch (error) {
            setError('Failed to fetch quotes');
            return NextResponse.json({
                error: 'Failed to fetch quotes.',
                details: error instanceof Error ? error.message : 'Unknown error'
            }, { status: 500 });
        } finally {
            setLoading(false);
        }
    }, [enabled, type]);

    // Listen for vote updates
    useEffect(() => {
        const handleVoteUpdate = (event: Event) => {
            const customEvent = event as CustomEvent;
            const { quoteId, newVoteCount } = customEvent.detail;

            setQuotes(currentQuotes =>
                currentQuotes.map(quote =>
                    quote.id === quoteId
                        ? { ...quote, vote_count: newVoteCount }
                        : quote
                )
            )
        }

        window.addEventListener('voteUpdated', handleVoteUpdate);

        return () => {
            window.removeEventListener('voteUpdated', handleVoteUpdate);
        };
    }, []);

    useEffect(() => {
        fetchQuotes();
    }, [fetchQuotes]);

    return {
        quotes,
        loading,
        error,
        refresh: fetchQuotes
    };
}

export function useAuth() {
    const [user, setUser] = useState<ExtendedUser | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { data: session, status } = useSession();

    const setCurrentUser = useBackrollsStore((state) => state.setCurrentUser);

    // Function to check auth from custom endpoint
    const checkCustomAuth = useCallback(async () => {
        try {
            const response = await fetch('/api/auth/verify', {
                credentials: 'include',
            });

            const result = await response.json();

            if (result.authenticated && result.user) {
                setUser(result.user);
                setIsAuthenticated(true);
                setCurrentUser(result.user.id);
            } else {
                setUser(null);
                setIsAuthenticated(false);
                setCurrentUser(null);
            }
        } catch (error) {
            setUser(null);
            setIsAuthenticated(false);
            setCurrentUser(null);
            console.error('Auth verification failed:', error);
        }
    }, [setCurrentUser]);

    // Listen for NextAuth session changes
    useEffect(() => {
        setIsLoading(status === 'loading');

        if (status === 'authenticated' && session?.user) {
            // Session exists - update state
            const sessionUser = session.user as ExtendedUser;
            const extendedUser: ExtendedUser = {
                id: sessionUser.id,
                username: sessionUser.username || sessionUser.name || sessionUser.email?.split('@')[0],
                email: sessionUser.email,
                name: sessionUser.name,
                image: sessionUser.image
            };

            setUser(extendedUser);
            setIsAuthenticated(true);
            setCurrentUser(sessionUser.id || null);
        } else if (status === 'unauthenticated') {
            // No session - check custom auth as fallback
            checkCustomAuth();
        }
    }, [session, status, setCurrentUser, checkCustomAuth]);

    // Initial auth check
    useEffect(() => {
        if (status === 'unauthenticated') {
            checkCustomAuth().finally(() => setIsLoading(false));
        }
    }, [status, checkCustomAuth]);

    return {
        user,
        isAuthenticated,
        isLoading
    };
}

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

export const getBackrollCardBackground = (index: number): string => {
    const pastelColors = [
        // Warm pastels
        '#FFE4E1',  // Misty Rose
        '#FFEFD5',  // Papaya Whip
        '#FFE4B5',  // Moccasin
        '#FFDAB9',  // Peach Puff
        '#FFB6C1',  // Light Pink
        '#FFC0CB',  // Pink

        // Cool pastels
        '#E0FFFF',  // Light Cyan
        '#F0F8FF',  // Alice Blue
        '#E6E6FA',  // Lavender
        '#DDA0DD',  // Plum
        '#D8BFD8',  // Thistle
        '#B0E0E6',  // Powder Blue

        // Green pastels
        '#F0FFF0',  // Honeydew
        '#F5FFFA',  // Mint Cream
        '#E0FFE0',  // Light Green
        '#AFEEEE',  // Pale Turquoise
        '#98FB98',  // Pale Green
        '#C7FFDB',  // Light Mint

        // Yellow/Orange pastels
        '#FFFACD',  // Lemon Chiffon
        '#FFF8DC',  // Cornsilk
        '#FFFFE0',  // Light Yellow
        '#F0E68C',  // Khaki
        '#FFEAA7',  // Warm Yellow
        '#FDCB6E',  // Soft Orange

        // Purple/Pink pastels
        '#F8F8FF',  // Ghost White
        '#FAF0E6',  // Linen
        '#FDF2E9',  // Seashell
        '#E8D5C4',  // Warm Beige
        '#F7DC6F',  // Soft Gold
        '#BB8FCE'   // Light Purple
    ];

    const randomIndex = Math.floor(Math.random() * pastelColors.length);
    if (index === undefined || index === null) {
        return pastelColors[randomIndex];
    }

    return pastelColors[randomIndex];
};

