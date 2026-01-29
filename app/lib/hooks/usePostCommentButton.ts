'use client';

import { trpc } from '../trpc';

export function usePostCommentButton(postId: string) {
    const { data: post } = trpc.post.getPost.useQuery(
        { postId },
        {
            enabled: !!postId,
            select: (data) => data.comment_count
        }
    );

    return { data: post ?? 0 };
}