'use client';

import { trpc } from '../trpc';

export function useFreshQuotes(limit: number = 10) {
    const { data, isLoading, error, ...query } = trpc.quotes.getRecent.useQuery(
        { limit },
        {
            staleTime: 1000 * 60 * 2,
            refetchOnWindowFocus: true,
        }
    );

    return { data, isLoading, error, ...query };
}