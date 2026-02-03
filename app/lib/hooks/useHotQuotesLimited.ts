import { trpc } from '../trpc';

export function useHotQuotesLimited(limit: number = 10) {
    const { data, isLoading, error, ...query } = trpc.quotes.getTopRated.useQuery(
        { limit },
        {
            staleTime: 1000 * 60 * 2,
            refetchOnWindowFocus: true,
        }
    );

    return { data, isLoading, error, ...query };
}
