'use client';

import { trpc } from '../trpc';

export function useCommentButton(quoteId: string) {
    return trpc.comments.getCommentCount.useQuery(
        { quoteId },
        {
            enabled: !!quoteId
        }
    );
}