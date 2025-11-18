'use client';

import { trpc } from '../trpc';

export function useHotQuotes(limit: number = 10) {
    return trpc.quotes.getTopRated.useQuery(
        { limit },
        {
            staleTime: 1000 * 60 * 2,
            refetchOnWindowFocus: true,
        }
    );
}