import { trpc } from '../trpc';

export const useQuotesByCommentCount = (limit: number) => {
    return trpc.quotes.getByCommentCount.useQuery({ limit });
};