import { trpc } from '../trpc';

export function useFreshQuotesLimited(limit = 20) {
    const { data, isLoading, error } = trpc.quotes.getRecent.useQuery({
        limit
    });

    return {
        data,
        isLoading,
        error,
        quotes: data?.quotes || []
    };
}