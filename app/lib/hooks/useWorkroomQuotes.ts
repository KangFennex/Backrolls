'use client';

import { trpc } from '../trpc';
import { useEffect } from 'react';

export function useWorkroomQuotes(limit: number = 1) {
    const utils = trpc.useUtils();

    const query = trpc.quotes.getRandom.useQuery(
        { limit },
        {
            staleTime: 1000 * 30,
            retry: 2,
            gcTime: 1000 * 60 * 2,
            refetchOnWindowFocus: false,
        }
    );

    // Listen for vote updates and update cache
    useEffect(() => {
        const handleVoteUpdate = (event: Event) => {
            const customEvent = event as CustomEvent;
            const { quoteId, newVoteCount } = customEvent.detail;

            utils.quotes.getRandom.setData({ limit }, (oldData) => {
                if (!oldData) return oldData;
                return oldData.map((quote) =>
                    quote.id === quoteId
                        ? { ...quote, voteCount: newVoteCount }
                        : quote
                );
            });
        };

        window.addEventListener('voteUpdated', handleVoteUpdate);
        return () => window.removeEventListener('voteUpdated', handleVoteUpdate);
    }, [limit, utils]);

    return query;
}