'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Quote } from '../definitions';

interface SeriesFilters {
    region?: string;
    series?: string | null;
    season?: number | null;
    episode?: number | null;
}

interface SeriesQueryData {
    quotes: Quote[];
    count: number;
}

/**
 * Custom hook to fetch filtered series quotes using TanStack Query
 * This hook integrates with the Zustand store for filter state management
 */
export function useSeriesQuotes(filters: SeriesFilters, initialData?: Quote[]) {
    const queryClient = useQueryClient();

    // Generate a stable query key based on filters
    const queryKey = ['seriesQuotes', filters.region, filters.series, filters.season, filters.episode];

    const query = useQuery<SeriesQueryData, Error>({
        queryKey,
        queryFn: async () => {
            const { region, series, season, episode } = filters;

            // Don't fetch if no region is selected
            if (!region) {
                return { quotes: [], count: 0 };
            }

            const searchParams = new URLSearchParams();
            searchParams.set('region', region);

            if (series) {
                searchParams.set('series', series);
            }

            if (season !== null && season !== undefined) {
                searchParams.set('season', season.toString());
            }

            if (episode !== null && episode !== undefined) {
                searchParams.set('episode', episode.toString());
            }

            const response = await fetch(`/api/series?${searchParams.toString()}`);

            if (!response.ok) {
                throw new Error('Failed to fetch quotes');
            }

            const data = await response.json();
            return data;
        },
        // Only run query if region exists
        enabled: !!filters.region,
        // Use server-side data as initial data for hydration
        initialData: initialData ? { quotes: initialData, count: initialData.length } : undefined,
        // Keep previous data while fetching new results
        placeholderData: (previousData) => previousData,
        // Stale time to prevent unnecessary refetches
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    /**
     * Manually update a quote in the cache (useful for vote updates)
     */
    const updateQuoteInCache = (quoteId: string, updates: Partial<Quote>) => {
        queryClient.setQueryData<SeriesQueryData>(
            queryKey,
            (oldData) => {
                if (!oldData?.quotes) return oldData;

                return {
                    ...oldData,
                    quotes: oldData.quotes.map((quote) =>
                        quote.id === quoteId
                            ? { ...quote, ...updates }
                            : quote
                    )
                };
            }
        );
    };

    return {
        ...query,
        updateQuoteInCache,
    };
}
