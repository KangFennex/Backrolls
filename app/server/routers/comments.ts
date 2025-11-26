import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { db } from "../../db";
import { backrollComments, users, commentVotes } from "../../db/schema";
import { eq, and, desc, isNull, count, sql } from "drizzle-orm";

export const commentsRouter = router({
    // Get top-level comments for a quote
    getCommentsByQuoteId: publicProcedure
        .input(z.object({
            id: z.string().uuid(),
            limit: z.number().optional().default(10),
            cursor: z.string().uuid().optional(),
        }))
        .query(async ({ input }) => {
            const { id, limit, cursor } = input;

            const baseQuery = db
                .select({
                    comment: backrollComments,
                    user: {
                        id: users.id,
                        username: users.username,
                    }
                })
                .from(backrollComments)
                .where(
                    and(
                        eq(backrollComments.quote_id, id),
                        isNull(backrollComments.parent_comment_id),
                        eq(backrollComments.status, 'active')
                    )
                )
                .leftJoin(users, eq(backrollComments.user_id, users.id))
                .orderBy(desc(backrollComments.vote_count), desc(backrollComments.created_at));

            const commentsWithUsers = await (cursor
                ? baseQuery.where(/* cursor logic */).limit(limit)
                : baseQuery.limit(limit)
            );

            // Get reply counts for each comment
            const commentIds = commentsWithUsers.map(c => c.comment.id);
            let replyCounts: { parent_comment_id: string; count: number }[] = [];

            if (commentIds.length > 0) {
                replyCounts = await db
                    .select({
                        parent_comment_id: backrollComments.parent_comment_id,
                        count: count(backrollComments.id)
                    })
                    .from(backrollComments)
                    .where(and(
                        eq(backrollComments.status, 'active'),
                        sql`${backrollComments.parent_comment_id} IN (${sql.join(commentIds, sql`, `)})`
                    ))
                    .groupBy(backrollComments.parent_comment_id);
            }

            // Combine comments with their reply counts
            const commentsWithCounts = commentsWithUsers.map(commentData => ({
                ...commentData,
                replyCount: replyCounts.find(rc => rc.parent_comment_id === commentData.comment.id)?.count || 0
            }));

            return commentsWithCounts;
        }),

    // Get replies to a specific comment
    getCommentReplies: publicProcedure
        .input(z.object({
            parentCommentId: z.string().uuid(),
            limit: z.number().optional().default(10),
            cursor: z.string().uuid().optional(),
        }))
        .query(async ({ input }) => {
            const { parentCommentId, limit, cursor } = input;

            const baseQuery = db
                .select({
                    comment: backrollComments,
                    user: {
                        id: users.id,
                        username: users.username,
                    }
                })
                .from(backrollComments)
                .where(
                    and(
                        eq(backrollComments.parent_comment_id, parentCommentId),
                        eq(backrollComments.status, 'active')
                    )
                )
                .leftJoin(users, eq(backrollComments.user_id, users.id))
                .orderBy(desc(backrollComments.vote_count), desc(backrollComments.created_at));

            const commentsWithUsers = await (cursor
                ? baseQuery.where(/* cursor logic */).limit(limit)
                : baseQuery.limit(limit)
            );

            // Get reply counts for nested replies (if you want multi-level nesting)
            const commentIds = commentsWithUsers.map(c => c.comment.id);
            let replyCounts: { parent_comment_id: string; count: number }[] = [];

            if (commentIds.length > 0) {
                replyCounts = await db
                    .select({
                        parent_comment_id: backrollComments.parent_comment_id,
                        count: count(backrollComments.id)
                    })
                    .from(backrollComments)
                    .where(and(
                        eq(backrollComments.status, 'active'),
                        sql`${backrollComments.parent_comment_id} IN (${sql.join(commentIds, sql`, `)})`
                    ))
                    .groupBy(backrollComments.parent_comment_id);
            }

            // Combine comments with their reply counts
            const commentsWithCounts = commentsWithUsers.map(commentData => ({
                ...commentData,
                replyCount: replyCounts.find(rc => rc.parent_comment_id === commentData.comment.id)?.count || 0
            }));

            return commentsWithCounts;
        }),

    // Get commented backrolls by a user
    getCommentedBackrollsByUser: protectedProcedure
        .input(z.object({
            limit: z.number().optional().default(10),
            cursor: z.string().uuid().optional(),
        }))
        .query(async ({ input, ctx }) => {
            const { limit, cursor } = input;
            const userId = ctx.session.user.id;

            const baseQuery = db
                .select({
                    comment_text: backrollComments.comment_text,
                    created_at: backrollComments.created_at,
                    quote_id: backrollComments.quote_id,
                    parent_comment_id: backrollComments.parent_comment_id,
                    id: backrollComments.id,
                })
                .from(backrollComments)
                .where(eq(backrollComments.user_id, userId))
                .orderBy(desc(backrollComments.created_at));

            const comments = await (cursor
                ? baseQuery.where(lt(backrollComments.id, cursor)).limit(limit)
                : baseQuery.limit(limit)
            );

            // Return the next cursor
            let nextCursor: typeof cursor | undefined = undefined;
            if (comments.length === limit) {
                const lastItem = comments[comments.length - 1];
                nextCursor = lastItem.id;
            }

            return {
                comments,
                nextCursor,
            };
        }),

    // Create a new comment
    create: protectedProcedure
        .input(z.object({
            quoteId: z.string().uuid(),
            parentCommentId: z.string().uuid().optional().nullable(),
            commentText: z.string().min(1).max(1000),
        }))
        .mutation(async ({ ctx, input }) => {
            const { quoteId, parentCommentId, commentText } = input;
            const userId = ctx.session.user.id;

            const [newComment] = await db
                .insert(backrollComments)
                .values({
                    quote_id: quoteId,
                    parent_comment_id: parentCommentId || null,
                    user_id: userId,
                    comment_text: commentText,
                })
                .returning();

            // Get updated count and dispatch event
            const [countResult] = await db
                .select({
                    count: count(backrollComments.id)
                })
                .from(backrollComments)
                .where(
                    and(
                        eq(backrollComments.quote_id, quoteId),
                        eq(backrollComments.status, 'active')
                    )
                );

            const newCommentCount = countResult?.count || 0;

            // Dispatch event for real-time count update
            if (typeof window !== 'undefined') {
                const event = new CustomEvent('commentAdded', {
                    detail: {
                        newCommentCount,
                        quoteId
                    }
                });
                window.dispatchEvent(event);
            }

            return newComment;
        }),

    // Update a comment
    update: protectedProcedure
        .input(z.object({
            commentId: z.string().uuid(),
            commentText: z.string().min(1).max(1000),
        }))
        .mutation(async ({ ctx, input }) => {
            const { commentId, commentText } = input;
            const userId = ctx.session.user.id;

            const [updatedComment] = await db
                .update(backrollComments)
                .set({
                    comment_text: commentText,
                    is_edited: true,
                    updated_at: new Date(),
                })
                .where(and(
                    eq(backrollComments.id, commentId),
                    eq(backrollComments.user_id, userId)
                ))
                .returning();

            return updatedComment;
        }),

    // Get comment count for a backroll
    getCommentCount: publicProcedure
        .input(z.object({
            quoteId: z.string().uuid(),
        }))
        .query(async ({ input }) => {
            const { quoteId } = input;

            const [result] = await db
                .select({
                    count: count(backrollComments.id)
                })
                .from(backrollComments)
                .where(
                    and(
                        eq(backrollComments.quote_id, quoteId),
                        eq(backrollComments.status, 'active')
                    )
                );

            return result?.count || 0;
        }),
    refetchCommentCount: publicProcedure
        .input(z.object({
            quoteId: z.string().uuid(),
        }))
        .query(async ({ input }) => {
            const { quoteId } = input;

            const [result] = await db
                .select({
                    count: count(backrollComments.id)
                })
                .from(backrollComments)
                .where(
                    and(
                        eq(backrollComments.quote_id, quoteId),
                        eq(backrollComments.status, 'active')
                    )
                );

            return result?.count || 0;
        }),

    // Delete a comment (soft delete)
    delete: protectedProcedure
        .input(z.object({
            commentId: z.string().uuid(),
        }))
        .mutation(async ({ ctx, input }) => {
            const { commentId } = input;
            const userId = ctx.session.user.id;

            const [commentToDelete] = await db
                .select({ quote_id: backrollComments.quote_id })
                .from(backrollComments)
                .where(and(
                    eq(backrollComments.id, commentId),
                ));

            if (!commentToDelete) {
                throw new Error("Comment not found or you don't have permission to delete it.");
            }

            const [deletedComment] = await db
                .update(backrollComments)
                .set({
                    status: 'deleted',
                    updated_at: new Date(),
                })
                .where(and(
                    eq(backrollComments.id, commentId),
                    eq(backrollComments.user_id, userId)
                ))
                .returning();

            // Get updated count and dispatch event
            const [countResult] = await db
                .select({
                    count: count(backrollComments.id)
                })
                .from(backrollComments)
                .where(
                    and(
                        eq(backrollComments.quote_id, commentToDelete.quote_id),
                        eq(backrollComments.status, 'active')
                    )
                );

            const newCommentCount = countResult?.count || 0;

            // Dispatch event for real-time count update
            if (typeof window !== 'undefined') {
                const event = new CustomEvent('commentAdded', {
                    detail: {
                        newCommentCount,
                        quoteId: commentToDelete.quote_id
                    }
                });
                window.dispatchEvent(event);
            }

            return deletedComment;
        }),

    // Vote on a comment
    vote: protectedProcedure
        .input(z.object({
            commentId: z.string().uuid(),
            voteType: z.enum(['up', 'down']),
        }))
        .mutation(async ({ ctx, input }) => {
            const { commentId, voteType } = input;
            const userId = ctx.session.user.id;

            // Start a transaction to handle the vote
            return await db.transaction(async (tx) => {
                // Check if user already voted
                const existingVote = await tx
                    .select()
                    .from(commentVotes)
                    .where(and(
                        eq(commentVotes.comment_id, commentId),
                        eq(commentVotes.user_id, userId)
                    ))
                    .limit(1);

                if (existingVote.length > 0) {
                    const currentVote = existingVote[0];

                    if (currentVote.vote_type === voteType) {
                        // User is clicking the same vote again - remove the vote
                        await tx
                            .delete(commentVotes)
                            .where(and(
                                eq(commentVotes.comment_id, commentId),
                                eq(commentVotes.user_id, userId)
                            ));

                        // Update comment vote count
                        const voteChange = voteType === 'up' ? -1 : 1;
                        const [updatedComment] = await tx
                            .update(backrollComments)
                            .set({
                                vote_count: sql`${backrollComments.vote_count} + ${voteChange}`
                            })
                            .where(eq(backrollComments.id, commentId))
                            .returning();

                        return { comment: updatedComment, action: 'removed' };
                    } else {
                        // User is changing their vote
                        await tx
                            .update(commentVotes)
                            .set({ vote_type: voteType })
                            .where(and(
                                eq(commentVotes.comment_id, commentId),
                                eq(commentVotes.user_id, userId)
                            ));

                        // Update comment vote count (flip from previous vote)
                        const voteChange = voteType === 'up' ? 2 : -2;
                        const [updatedComment] = await tx
                            .update(backrollComments)
                            .set({
                                vote_count: sql`${backrollComments.vote_count} + ${voteChange}`
                            })
                            .where(eq(backrollComments.id, commentId))
                            .returning();

                        return { comment: updatedComment, action: 'changed' };
                    }
                } else {
                    // New vote
                    await tx
                        .insert(commentVotes)
                        .values({
                            comment_id: commentId,
                            user_id: userId,
                            vote_type: voteType,
                        });

                    // Update comment vote count
                    const voteChange = voteType === 'up' ? 1 : -1;
                    const [updatedComment] = await tx
                        .update(backrollComments)
                        .set({
                            vote_count: sql`${backrollComments.vote_count} + ${voteChange}`
                        })
                        .where(eq(backrollComments.id, commentId))
                        .returning();

                    return { comment: updatedComment, action: 'added' };
                }
            });
        }),
});