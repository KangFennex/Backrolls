'use client';

import { trpc } from '../trpc';

interface UseUpdatePostCommentOptions {
    postId: string;
    parentCommentId?: string;
    onSuccess?: () => void;
}

export function useUpdatePostComment({
    postId,
    parentCommentId,
    onSuccess,
}: UseUpdatePostCommentOptions) {
    const utils = trpc.useUtils();

    return trpc.postComment.updateComment.useMutation({
        onSuccess: () => {
            utils.postComment.getPostComments.invalidate({ postId });
            if (parentCommentId) {
                utils.postComment.getCommentReplies.invalidate({ commentId: parentCommentId });
            }
            utils.post.getPost.invalidate({ postId });

            onSuccess?.();
        },
    });
}
