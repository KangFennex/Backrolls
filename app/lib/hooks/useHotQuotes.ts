import { trpc } from '../trpc';

interface UseHotQuotesProps {
    limit?: number;
}

export function useHotQuotes({ limit = 20 }: UseHotQuotesProps) {
    const result = trpc.quotes.getTopRated.useInfiniteQuery(
        { limit },
        {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
            refetchOnWindowFocus: false,
            staleTime: 1000 * 60 * 5,
        }
    );

    const allQuotes = result.data?.pages.flatMap(page => page.quotes) ?? [];

    return {
        ...result,
        allQuotes,
    };
}