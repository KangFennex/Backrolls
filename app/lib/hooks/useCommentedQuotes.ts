'use client';

import { trpc } from '../trpc';

export function useCommentedQuotes() {
    return trpc.comments.getCommentedBackrollsByUser.useQuery(
        {},
        {
            staleTime: 1000 * 60 * 2, // 2 minutes
            refetchOnWindowFocus: true,
        });
}
