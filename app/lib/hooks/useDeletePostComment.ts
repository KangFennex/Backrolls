'use client';

import { trpc } from '../trpc';

interface UseDeletePostCommentOptions {
    postId: string;
    parentCommentId?: string | null;
    onSuccess?: () => void;
}

export function useDeletePostComment({
    postId,
    parentCommentId = null,
    onSuccess,
}: UseDeletePostCommentOptions) {
    const utils = trpc.useUtils();

    return trpc.postComment.deleteComment.useMutation({
        onSuccess: () => {
            utils.postComment.getPostComments.invalidate({ postId });
            utils.post.getPost.invalidate({ postId });

            if (parentCommentId) {
                utils.postComment.getCommentReplies.invalidate({ commentId: parentCommentId });
            }

            onSuccess?.();
        },
    });
}
