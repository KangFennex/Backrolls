'use client';

import { trpc } from '../trpc';

interface UseCreateCommentOptions {
    quoteId: string;
    parentCommentId?: string | null;
    parentListId?: string | null;
    repliesLimit?: number;
    currentUser?: { id: string; username?: string | null } | null;
    onSuccess?: () => void;
}

export function useCreateComment({
    quoteId,
    parentCommentId = null,
    parentListId = null,
    repliesLimit = 30,
    currentUser,
    onSuccess,
}: UseCreateCommentOptions) {
    const utils = trpc.useUtils();

    return trpc.comments.create.useMutation({
        onMutate: async (variables) => {
            await Promise.all([
                utils.comments.getCommentsByQuoteId.cancel({ id: variables.quoteId }),
                variables.parentCommentId
                    ? utils.comments.getCommentReplies.cancel({
                        parentCommentId: variables.parentCommentId,
                        limit: repliesLimit,
                    })
                    : Promise.resolve(),
                utils.comments.getCommentCount.cancel({ quoteId: variables.quoteId }),
            ]);

            const previousComments = utils.comments.getCommentsByQuoteId.getData({ id: variables.quoteId });

            const previousReplies = variables.parentCommentId
                ? utils.comments.getCommentReplies.getData({
                    parentCommentId: variables.parentCommentId,
                    limit: repliesLimit,
                })
                : undefined;

            const previousParentList = parentListId
                ? utils.comments.getCommentReplies.getData({
                    parentCommentId: parentListId,
                    limit: repliesLimit,
                })
                : undefined;

            const previousCount = utils.comments.getCommentCount.getData({ quoteId: variables.quoteId });

            const optimisticId = typeof crypto !== 'undefined' && 'randomUUID' in crypto
                ? crypto.randomUUID()
                : `optimistic-${Date.now()}`;

            const optimisticComment = {
                comment: {
                    id: optimisticId,
                    comment_text: variables.commentText,
                    user_id: currentUser?.id || 'optimistic-user',
                    quote_id: variables.quoteId,
                    parent_comment_id: variables.parentCommentId || null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    is_edited: false,
                    is_flagged: false,
                    vote_count: 0,
                    status: 'active' as const,
                },
                user: currentUser
                    ? { id: currentUser.id, username: currentUser.username || 'You' }
                    : null,
                replyCount: 0,
            };

            const topLevelLimit = previousComments?.length ?? 10;

            if (variables.parentCommentId) {
                utils.comments.getCommentReplies.setData(
                    { parentCommentId: variables.parentCommentId, limit: repliesLimit },
                    (old) => {
                        const next = old ? [optimisticComment, ...old] : [optimisticComment];
                        return next.slice(0, repliesLimit);
                    }
                );

                if (parentListId) {
                    utils.comments.getCommentReplies.setData(
                        { parentCommentId: parentListId, limit: repliesLimit },
                        (old) => old?.map((item) =>
                            item.comment.id === variables.parentCommentId
                                ? { ...item, replyCount: item.replyCount + 1 }
                                : item
                        )
                    );
                } else {
                    utils.comments.getCommentsByQuoteId.setData(
                        { id: variables.quoteId },
                        (old) => old?.map((item) =>
                            item.comment.id === variables.parentCommentId
                                ? { ...item, replyCount: item.replyCount + 1 }
                                : item
                        )
                    );
                }
            } else {
                utils.comments.getCommentsByQuoteId.setData(
                    { id: variables.quoteId },
                    (old) => {
                        const next = old ? [optimisticComment, ...old] : [optimisticComment];
                        return next.slice(0, topLevelLimit);
                    }
                );
            }

            utils.comments.getCommentCount.setData(
                { quoteId: variables.quoteId },
                (old) => (typeof old === 'number' ? old + 1 : 1)
            );

            return { previousComments, previousReplies, previousParentList, previousCount };
        },
        onError: (_error, variables, context) => {
            utils.comments.getCommentsByQuoteId.setData(
                { id: variables.quoteId },
                context?.previousComments
            );
            if (variables.parentCommentId) {
                utils.comments.getCommentReplies.setData(
                    { parentCommentId: variables.parentCommentId, limit: repliesLimit },
                    context?.previousReplies
                );
            }
            if (parentListId) {
                utils.comments.getCommentReplies.setData(
                    { parentCommentId: parentListId, limit: repliesLimit },
                    context?.previousParentList
                );
            }
            if (typeof context?.previousCount === 'number') {
                utils.comments.getCommentCount.setData(
                    { quoteId: variables.quoteId },
                    context.previousCount
                );
            }
        },
        onSuccess: () => {
            utils.comments.getCommentsByQuoteId.invalidate({ id: quoteId });
            utils.comments.getCommentCount.invalidate({ quoteId });
            if (parentCommentId) {
                utils.comments.getCommentReplies.invalidate({ parentCommentId, limit: repliesLimit });
            }

            onSuccess?.();
        },
        onSettled: () => {
            utils.comments.getCommentsByQuoteId.invalidate({ id: quoteId });
            utils.comments.getCommentCount.invalidate({ quoteId });
            if (parentCommentId) {
                utils.comments.getCommentReplies.invalidate({ parentCommentId, limit: repliesLimit });
            }
        },
    });
}
