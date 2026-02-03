import { trpc } from '../trpc';

interface UseFreshQuotesProps {
    limit?: number;
}

export function useFreshQuotes({ limit = 20 }: UseFreshQuotesProps) {

    const result = trpc.quotes.getRecent.useInfiniteQuery(
        { limit },
        {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
            refetchOnWindowFocus: false,
            staleTime: 1000 * 60 * 5, // 5 minutes
        }
    );

    const allQuotes = result.data?.pages.flatMap(page => page.quotes) ?? [];

    return {
        ...result,
        allQuotes,
    };
}
