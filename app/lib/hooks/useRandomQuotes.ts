'use client';

import { trpc } from '../trpc';

export function useRandomQuotes(limit: number = 1) {
    return trpc.quotes.getRandom.useQuery(
        { limit },
        {
            staleTime: 1000 * 30,
            retry: 2,
            gcTime: 1000 * 60 * 2,
        }
    );
}