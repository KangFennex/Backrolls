import { trpc } from '../trpc';

interface UseQuotesByCommentCountProps {
    limit?: number;
}

export function useQuotesByCommentCount({ limit = 20 }: UseQuotesByCommentCountProps) {
    const result = trpc.quotes.getByCommentCount.useInfiniteQuery(
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