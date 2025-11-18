'use client';

import { trpc } from '../trpc';

export function useSubmittedQuotes() {
    return trpc.submitted.getUserSubmitted.useQuery(undefined, {
        staleTime: 1000 * 60 * 2, // 2 minutes
        refetchOnWindowFocus: true,
    });
}
