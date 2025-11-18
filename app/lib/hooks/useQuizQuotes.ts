'use client';

import { trpc } from '../trpc';

export function useQuizQuotes(limit: number = 10) {
    return trpc.quotes.getQuiz.useQuery(
        { limit },
        {
            staleTime: Infinity,
            gcTime: 0,
            refetchOnWindowFocus: false,
        }
    );
}
