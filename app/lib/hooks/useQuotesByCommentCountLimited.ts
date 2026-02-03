import { trpc } from '../trpc';

export const useQuotesByCommentCountLimited = (limit: number = 10) => {
    const { data, isLoading, error, ...query } = trpc.quotes.getByCommentCount.useQuery(
        { limit },
        {
            staleTime: 1000 * 60 * 2,
            refetchOnWindowFocus: true,
        }
    );

    return { data, isLoading, error, ...query };
};
