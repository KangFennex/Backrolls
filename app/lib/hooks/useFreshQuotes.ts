'use client';

import { useEffect } from 'react';
import { trpc } from '../trpc';

export function useFreshQuotes(limit: number = 10) {
    const utils = trpc.useUtils();

    const query = trpc.quotes.getRecent.useQuery(
        { limit },
        {
            staleTime: 1000 * 60 * 2,
            refetchOnWindowFocus: true,
        }
    );

    // Listen for vote updates and update cache
    useEffect(() => {
        const handleVoteUpdate = (event: Event) => {
            const customEvent = event as CustomEvent;
            const { quoteId, newVoteCount } = customEvent.detail;

            utils.quotes.getRecent.setData({ limit }, (oldData) => {
                if (!oldData) return oldData;
                return {
                    ...oldData,
                    quotes: oldData.quotes.map(quote =>
                        quote.id = quoteId
                            ? { ...quote, vote_count: newVoteCount }
                            : quote
                    )
                };
            });
        };

        window.addEventListener('voteUpdated', handleVoteUpdate);
        return () => window.removeEventListener('voteUpdated', handleVoteUpdate);
    }, [limit, utils]);

    return query;
}