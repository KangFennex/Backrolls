'use client';

import { useEffect } from 'react';
import { trpc } from '../trpc';

interface SeriesFilters {
    region?: string;
    series?: string | null;
    season?: number | null;
    episode?: number | null;
}

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

    // Listen for vote updates and update cache
    useEffect(() => {
        const handleVoteUpdate = (event: Event) => {
            const customEvent = event as CustomEvent;
            const { quoteId, newVoteCount } = customEvent.detail;

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
                                ? { ...quote, vote_count: newVoteCount }
                                : quote
                        )
                    };
                }
            );
        };

        window.addEventListener('voteUpdated', handleVoteUpdate);
        return () => window.removeEventListener('voteUpdated', handleVoteUpdate);
    }, [filters.region, filters.series, filters.season, filters.episode, utils]);

    return query;
}
