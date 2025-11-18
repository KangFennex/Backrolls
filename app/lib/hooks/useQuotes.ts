'use client';

import { useEffect } from 'react';
import { trpc } from '../trpc';

export function useQuotes(type: string, enabled = true, limit = 10) {
    const utils = trpc.useUtils();

    // Select the appropriate query based on type
    const query = type === 'recent'
        ? trpc.quotes.getRecent.useQuery({ limit }, { enabled })
        : trpc.quotes.getTopRated.useQuery({ limit }, { enabled });

    // Listen for vote updates
    useEffect(() => {
        const handleVoteUpdate = (event: Event) => {
            const customEvent = event as CustomEvent;
            const { quoteId, newVoteCount } = customEvent.detail;

            // Update both caches
            if (type === 'recent') {
                utils.quotes.getRecent.setData({ limit }, (oldData) => {
                    if (!oldData) return oldData;
                    return oldData.map(quote =>
                        quote.id === quoteId
                            ? { ...quote, voteCount: newVoteCount }
                            : quote
                    );
                });
            } else {
                utils.quotes.getTopRated.setData({ limit }, (oldData) => {
                    if (!oldData) return oldData;
                    return oldData.map(quote =>
                        quote.id === quoteId
                            ? { ...quote, voteCount: newVoteCount }
                            : quote
                    );
                });
            }
        }

        window.addEventListener('voteUpdated', handleVoteUpdate);

        return () => {
            window.removeEventListener('voteUpdated', handleVoteUpdate);
        };
    }, [type, limit, utils]);

    return {
        quotes: query.data || [],
        loading: query.isLoading,
        error: query.error?.message || null,
        refresh: query.refetch
    };
}