import { useState, useEffect } from 'react';
import { trpc } from '../trpc';
import { Quote } from '../definitions';

interface UseRandomQuotesProps {
    initialData: {
        quotes: Quote[];
        nextCursor?: string;
        seed: number;
    };
    limit?: number;
}

export function useRandomQuotes({ initialData, limit = 15 }: UseRandomQuotesProps) {
    const [allQuotes, setAllQuotes] = useState<Quote[]>(initialData.quotes);
    const [seed] = useState(initialData.seed);

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = trpc.quotes.getRandom.useInfiniteQuery(
        { limit, seed },
        {
            initialData: {
                pages: [initialData],
                pageParams: [undefined],
            },
            getNextPageParam: (lastPage) => lastPage.nextCursor,
            refetchOnWindowFocus: false,
            staleTime: 1000 * 60 * 5, // 5 minutes
        }
    );

    // Update quotes when new pages are fetched
    useEffect(() => {
        if (data) {
            const quotes = data.pages.flatMap(page => page.quotes);
            setAllQuotes(quotes);
        }
    }, [data]);

    return {
        allQuotes,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    };
}
