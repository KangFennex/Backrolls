'use client';

import { trpc } from '../trpc';

interface UseUpdateCommentOptions {
    quoteId: string;
    parentCommentId?: string | null;
    parentListId?: string | null;
    repliesLimit?: number;
    onSuccess?: () => void;
}

export function useUpdateComment({
    quoteId,
    parentCommentId = null,
    parentListId = null,
    repliesLimit = 30,
    onSuccess,
}: UseUpdateCommentOptions) {
    const utils = trpc.useUtils();

    return trpc.comments.update.useMutation({
        onMutate: async (variables) => {
            // Cancel outgoing refetches
            await Promise.all([
                utils.comments.getCommentsByQuoteId.cancel({ id: quoteId }),
                parentCommentId
                    ? utils.comments.getCommentReplies.cancel({
                        parentCommentId,
                        limit: repliesLimit,
                    })
                    : Promise.resolve(),
                parentListId
                    ? utils.comments.getCommentReplies.cancel({
                        parentCommentId: parentListId,
                        limit: repliesLimit,
                    })
                    : Promise.resolve(),
            ]);

            const previousComments = utils.comments.getCommentsByQuoteId.getData({ id: quoteId });
            const previousReplies = parentCommentId
                ? utils.comments.getCommentReplies.getData({
                    parentCommentId,
                    limit: repliesLimit,
                })
                : undefined;
            const previousParentList = parentListId
                ? utils.comments.getCommentReplies.getData({
                    parentCommentId: parentListId,
                    limit: repliesLimit,
                })
                : undefined;

            // Optimistically update the comment text
            if (parentCommentId || parentListId) {
                const listToUpdate = parentCommentId || parentListId;
                utils.comments.getCommentReplies.setData(
                    { parentCommentId: listToUpdate!, limit: repliesLimit },
                    (old) =>
                        old?.map((item) =>
                            item.comment.id === variables.commentId
                                ? {
                                    ...item,
                                    comment: {
                                        ...item.comment,
                                        comment_text: variables.commentText,
                                        is_edited: true,
                                    },
                                }
                                : item
                        )
                );
            } else {
                utils.comments.getCommentsByQuoteId.setData(
                    { id: quoteId },
                    (old) =>
                        old?.map((item) =>
                            item.comment.id === variables.commentId
                                ? {
                                    ...item,
                                    comment: {
                                        ...item.comment,
                                        comment_text: variables.commentText,
                                        is_edited: true,
                                    },
                                }
                                : item
                        )
                );
            }

            return { previousComments, previousReplies, previousParentList };
        },
        onError: (_error, _variables, context) => {
            utils.comments.getCommentsByQuoteId.setData(
                { id: quoteId },
                context?.previousComments
            );
            if (parentCommentId) {
                utils.comments.getCommentReplies.setData(
                    { parentCommentId, limit: repliesLimit },
                    context?.previousReplies
                );
            }
            if (parentListId) {
                utils.comments.getCommentReplies.setData(
                    { parentCommentId: parentListId, limit: repliesLimit },
                    context?.previousParentList
                );
            }
        },
        onSuccess: () => {
            utils.comments.getCommentsByQuoteId.invalidate({ id: quoteId });
            if (parentCommentId) {
                utils.comments.getCommentReplies.invalidate({ parentCommentId, limit: repliesLimit });
            }
            if (parentListId) {
                utils.comments.getCommentReplies.invalidate({ parentCommentId: parentListId, limit: repliesLimit });
            }

            onSuccess?.();
        },
        onSettled: () => {
            utils.comments.getCommentsByQuoteId.invalidate({ id: quoteId });
            if (parentCommentId) {
                utils.comments.getCommentReplies.invalidate({ parentCommentId, limit: repliesLimit });
            }
            if (parentListId) {
                utils.comments.getCommentReplies.invalidate({ parentCommentId: parentListId, limit: repliesLimit });
            }
        },
    });
}
