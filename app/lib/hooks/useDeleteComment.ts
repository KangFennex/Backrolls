'use client';

import { trpc } from '../trpc';

interface UseDeleteCommentOptions {
    quoteId: string;
    parentCommentId?: string | null;
    onSuccess?: () => void;
}

export function useDeleteComment({
    quoteId,
    parentCommentId = null,
    onSuccess,
}: UseDeleteCommentOptions) {
    const utils = trpc.useUtils();

    return trpc.comments.delete.useMutation({
        onSuccess: () => {
            utils.comments.getCommentsByQuoteId.invalidate({ id: quoteId });
            utils.comments.getCommentCount.invalidate({ quoteId });

            if (parentCommentId) {
                utils.comments.getCommentReplies.invalidate({ parentCommentId });
            }

            onSuccess?.();
        },
    });
}
