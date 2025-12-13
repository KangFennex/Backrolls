import { trpc } from '../trpc';

export function useQuotesBySpeaker(speaker: string, excludeId?: string, limit: number = 10) {
    return trpc.quotes.getBySpeaker.useQuery(
        {
            speaker,
            excludeId,
            limit,
        },
        {
            enabled: !!speaker,
        }
    );
}
