'use client'

import { trpc } from '../trpc'

export function useQuotesByIds(quoteIds?: string[]) {
    const uniqueIds = [...new Set(quoteIds.filter(Boolean))];

    return trpc.quotes.getByIds.useQuery(
        uniqueIds.length > 0 ? { ids: uniqueIds } : undefined,
        {
            staleTime: 1000 * 60 * 5,
            refetchOnWindowFocus: false,
            enabled: uniqueIds.length > 0,
        });
}