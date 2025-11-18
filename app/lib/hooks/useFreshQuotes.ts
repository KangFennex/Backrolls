'use client';

import { trpc } from '../trpc';

export function useFreshQuotes(limit: number = 10) {
    return trpc.quotes.getRecent.useQuery(
        { limit },
        {
            staleTime: 1000 * 60 * 2,
            refetchOnWindowFocus: true,
        }
    );
}