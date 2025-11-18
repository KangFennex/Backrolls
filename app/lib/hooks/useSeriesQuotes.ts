'use client';

import { trpc } from '../trpc';
import { Quote } from '../definitions';

interface SeriesFilters {
    region?: string;
    series?: string | null;
    season?: number | null;
    episode?: number | null;
}

/**
 * Custom hook to fetch filtered series quotes using tRPC
 * This hook integrates with the Zustand store for filter state management
 */
export function useSeriesQuotes(filters: SeriesFilters) {
    const utils = trpc.useUtils();

    const query = trpc.quotes.getFiltered.useQuery(
        {
            region: filters.region,
            series: filters.series || undefined,
            season: filters.season || undefined,
            episode: filters.episode || undefined,
        },
        {
            enabled: !!filters.region,
            refetchOnMount: true,
            staleTime: 0,
        }
    );

    /**
     * Manually update a quote in the cache (useful for vote updates)
     */
    const updateQuoteInCache = (quoteId: string, updates: Partial<Quote>) => {
        utils.quotes.getFiltered.setData(
            {
                region: filters.region,
                series: filters.series || undefined,
                season: filters.season || undefined,
                episode: filters.episode || undefined,
            },
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
