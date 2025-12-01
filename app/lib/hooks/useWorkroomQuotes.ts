'use client';

import { trpc } from '../trpc';

/**
 * Legacy hook for fetching random quotes - kept for backward compatibility
 * New workroom page uses infinite query with server-side hydration
 */
export function useWorkroomQuotes(limit: number = 30) {
    const query = trpc.quotes.getRandom.useInfiniteQuery(
        { limit },
        {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
            staleTime: 1000 * 60 * 5,
            refetchOnWindowFocus: false,
        }
    );

    return {
        data: query.data?.pages.flatMap(page => page.quotes),
        isLoading: query.isLoading,
        error: query.error,
        fetchNextPage: query.fetchNextPage,
        hasNextPage: query.hasNextPage,
        isFetchingNextPage: query.isFetchingNextPage,
    };
}