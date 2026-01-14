import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { db } from "../../db";
import { postComments, postCommentVotes, communityMembers, posts } from "../../db/schema";
import { desc, eq, and } from "drizzle-orm";

export const postCommentRouter = router({
    // Create a comment on a post
    createComment: protectedProcedure
        .input(z.object({
            postId: z.string().uuid(),
            commentText: z.string().min(1).max(10000),
            parentCommentId: z.string().uuid().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
            const { postId, commentText, parentCommentId } = input;
            const userId = ctx.session.user.id;

            // Get post and verify it exists and isn't locked
            const post = await db
                .select()
                .from(posts)
                .where(eq(posts.id, postId))
                .limit(1);

            if (post.length === 0) {
                throw new Error("Post not found");
            }

            if (post[0].is_locked) {
                throw new Error("This post is locked and cannot receive new comments");
            }

            // Verify user is a member of the community and not banned
            const membership = await db
                .select()
                .from(communityMembers)
                .where(
                    and(
                        eq(communityMembers.community_id, post[0].community_id),
                        eq(communityMembers.user_id, userId)
                    )
                )
                .limit(1);

            if (membership.length === 0) {
                throw new Error("Must be a member to comment");
            }

            if (membership[0].is_banned) {
                throw new Error("You are banned from this community");
            }

            // Calculate depth if replying to a comment
            let depth = 0;
            if (parentCommentId) {
                const parentComment = await db
                    .select()
                    .from(postComments)
                    .where(eq(postComments.id, parentCommentId))
                    .limit(1);

                if (parentComment.length === 0) {
                    throw new Error("Parent comment not found");
                }

                depth = Number(parentComment[0].depth) + 1;

                if (depth > 10) {
                    throw new Error("Maximum nesting depth reached");
                }
            }

            // Create comment
            const [newComment] = await db
                .insert(postComments)
                .values({
                    post_id: postId,
                    parent_comment_id: parentCommentId,
                    user_id: userId,
                    comment_text: commentText,
                    depth: depth,
                })
                .returning();

            return newComment;
        }),

    // Get comments for a post
    getPostComments: publicProcedure
        .input(z.object({
            postId: z.string().uuid(),
            sortBy: z.enum(['hot', 'new', 'top']).optional().default('hot'),
            limit: z.number().min(1).max(200).optional().default(50),
        }))
        .query(async ({ input }) => {
            const { postId, sortBy, limit } = input;

            let query = db
                .select()
                .from(postComments)
                .where(
                    and(
                        eq(postComments.post_id, postId),
                        eq(postComments.status, 'active')
                    )
                );

            // Apply sorting
            if (sortBy === 'hot') {
                query = query.orderBy(desc(postComments.vote_count), desc(postComments.created_at));
            } else if (sortBy === 'new') {
                query = query.orderBy(desc(postComments.created_at));
            } else if (sortBy === 'top') {
                query = query.orderBy(desc(postComments.vote_count));
            }

            const results = await query.limit(limit);
            return results;
        }),

    // Update a comment
    updateComment: protectedProcedure
        .input(z.object({
            commentId: z.string().uuid(),
            commentText: z.string().min(1).max(10000),
        }))
        .mutation(async ({ ctx, input }) => {
            const { commentId, commentText } = input;
            const userId = ctx.session.user.id;

            // Verify ownership
            const comment = await db
                .select()
                .from(postComments)
                .where(eq(postComments.id, commentId))
                .limit(1);

            if (comment.length === 0) {
                throw new Error("Comment not found");
            }

            if (comment[0].user_id !== userId) {
                throw new Error("Unauthorized: You can only edit your own comments");
            }

            if (comment[0].status !== 'active') {
                throw new Error("Cannot edit deleted or removed comments");
            }

            // Update comment
            const [updatedComment] = await db
                .update(postComments)
                .set({
                    comment_text: commentText,
                    is_edited: true,
                    edited_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                })
                .where(eq(postComments.id, commentId))
                .returning();

            return updatedComment;
        }),

    // Delete a comment
    deleteComment: protectedProcedure
        .input(z.object({
            commentId: z.string().uuid(),
        }))
        .mutation(async ({ ctx, input }) => {
            const { commentId } = input;
            const userId = ctx.session.user.id;

            // Get comment with post info
            const comment = await db
                .select()
                .from(postComments)
                .where(eq(postComments.id, commentId))
                .limit(1);

            if (comment.length === 0) {
                throw new Error("Comment not found");
            }

            const isOwner = comment[0].user_id === userId;

            // Check if user is moderator/admin if not owner
            if (!isOwner) {
                const post = await db
                    .select()
                    .from(posts)
                    .where(eq(posts.id, comment[0].post_id))
                    .limit(1);

                if (post.length > 0) {
                    const membership = await db
                        .select()
                        .from(communityMembers)
                        .where(
                            and(
                                eq(communityMembers.community_id, post[0].community_id),
                                eq(communityMembers.user_id, userId)
                            )
                        )
                        .limit(1);

                    if (membership.length === 0 || !['admin', 'moderator'].includes(membership[0].role)) {
                        throw new Error("Unauthorized: You can only delete your own comments");
                    }
                }
            }

            // Soft delete - mark as deleted instead of removing
            await db
                .update(postComments)
                .set({
                    status: 'deleted',
                    comment_text: '[deleted]',
                    updated_at: new Date().toISOString(),
                })
                .where(eq(postComments.id, commentId));

            return { success: true };
        }),

    // Vote on a comment
    voteComment: protectedProcedure
        .input(z.object({
            commentId: z.string().uuid(),
            voteType: z.enum(['up', 'down']),
        }))
        .mutation(async ({ ctx, input }) => {
            const { commentId, voteType } = input;
            const userId = ctx.session.user.id;

            // Check if user already voted
            const existingVote = await db
                .select()
                .from(postCommentVotes)
                .where(
                    and(
                        eq(postCommentVotes.comment_id, commentId),
                        eq(postCommentVotes.user_id, userId)
                    )
                )
                .limit(1);

            if (existingVote.length > 0) {
                // Update existing vote if different, otherwise remove it
                if (existingVote[0].vote_type === voteType) {
                    // Remove vote (unvote)
                    await db
                        .delete(postCommentVotes)
                        .where(
                            and(
                                eq(postCommentVotes.comment_id, commentId),
                                eq(postCommentVotes.user_id, userId)
                            )
                        );
                    return { action: 'removed', voteType: null };
                } else {
                    // Change vote
                    const [updatedVote] = await db
                        .update(postCommentVotes)
                        .set({
                            vote_type: voteType,
                            updated_at: new Date().toISOString(),
                        })
                        .where(
                            and(
                                eq(postCommentVotes.comment_id, commentId),
                                eq(postCommentVotes.user_id, userId)
                            )
                        )
                        .returning();
                    return { action: 'changed', voteType: updatedVote.vote_type };
                }
            } else {
                // Create new vote
                const [newVote] = await db
                    .insert(postCommentVotes)
                    .values({
                        comment_id: commentId,
                        user_id: userId,
                        vote_type: voteType,
                    })
                    .returning();
                return { action: 'created', voteType: newVote.vote_type };
            }
        }),

    // Get user's vote on a comment
    getUserCommentVote: protectedProcedure
        .input(z.object({
            commentId: z.string().uuid(),
        }))
        .query(async ({ ctx, input }) => {
            const { commentId } = input;
            const userId = ctx.session.user.id;

            const vote = await db
                .select()
                .from(postCommentVotes)
                .where(
                    and(
                        eq(postCommentVotes.comment_id, commentId),
                        eq(postCommentVotes.user_id, userId)
                    )
                )
                .limit(1);

            return vote.length > 0 ? vote[0] : null;
        }),

    // Get comment replies (for threaded comments)
    getCommentReplies: publicProcedure
        .input(z.object({
            commentId: z.string().uuid(),
            sortBy: z.enum(['hot', 'new', 'top']).optional().default('hot'),
            limit: z.number().min(1).max(100).optional().default(25),
        }))
        .query(async ({ input }) => {
            const { commentId, sortBy, limit } = input;

            let query = db
                .select()
                .from(postComments)
                .where(
                    and(
                        eq(postComments.parent_comment_id, commentId),
                        eq(postComments.status, 'active')
                    )
                );

            // Apply sorting
            if (sortBy === 'hot') {
                query = query.orderBy(desc(postComments.vote_count), desc(postComments.created_at));
            } else if (sortBy === 'new') {
                query = query.orderBy(desc(postComments.created_at));
            } else if (sortBy === 'top') {
                query = query.orderBy(desc(postComments.vote_count));
            }

            const results = await query.limit(limit);
            return results;
        }),
});
