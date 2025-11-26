import { trpc } from '../trpc';

export function useQuoteById(quoteId?: string | null) {
    return trpc.quotes.getById.useQuery(
        quoteId ? { id: quoteId } : undefined,
        {
            staleTime: 1000 * 60 * 5,
            refetchOnWindowFocus: false,
            enabled: !!quoteId,
        });
}