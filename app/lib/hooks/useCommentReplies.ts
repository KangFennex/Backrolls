'use client';

import { trpc } from '../trpc';

export function useCommentReplies(parentCommentId?: string | null, limit = 30) {
    return trpc.comments.getCommentReplies.useQuery(
        { parentCommentId: parentCommentId || '', limit },
        {
            staleTime: 1000 * 60 * 2,
            refetchOnWindowFocus: true,
            enabled: !!parentCommentId,
        }
    );
}