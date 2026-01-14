import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { db } from "../../db";
import { posts, postVotes, communityMembers } from "../../db/schema";
import { desc, lt, eq, and } from "drizzle-orm";

export const postRouter = router({
    // Create a new post
    createPost: protectedProcedure
        .input(z.object({
            communityId: z.string().uuid(),
            title: z.string().min(3).max(300),
            body: z.string().max(40000).optional(),
            postType: z.enum(['text', 'link', 'image', 'video']),
            url: z.string().url().optional(),
            thumbnailUrl: z.string().url().optional(),
            isNsfw: z.boolean().optional().default(false),
            isSpoiler: z.boolean().optional().default(false),
            flairId: z.string().uuid().optional(),
            flairText: z.string().max(64).optional(),
        }))
        .mutation(async ({ ctx, input }) => {
            const { communityId, title, body, postType, url, thumbnailUrl, isNsfw, isSpoiler, flairId, flairText } = input;
            const userId = ctx.session.user.id;

            // Verify user is a member and not banned
            const membership = await db
                .select()
                .from(communityMembers)
                .where(
                    and(
                        eq(communityMembers.community_id, communityId),
                        eq(communityMembers.user_id, userId)
                    )
                )
                .limit(1);

            if (membership.length === 0) {
                throw new Error("Must be a member to post");
            }

            if (membership[0].is_banned) {
                throw new Error("You are banned from this community");
            }

            // Create post
            const [newPost] = await db
                .insert(posts)
                .values({
                    community_id: communityId,
                    user_id: userId,
                    title,
                    body,
                    post_type: postType,
                    url,
                    thumbnail_url: thumbnailUrl,
                    is_nsfw: isNsfw,
                    is_spoiler: isSpoiler,
                    flair_id: flairId,
                    flair_text: flairText,
                })
                .returning();

            return newPost;
        }),

    // Get a single post
    getPost: publicProcedure
        .input(z.object({
            postId: z.string().uuid(),
        }))
        .query(async ({ input }) => {
            const { postId } = input;

            const results = await db
                .select()
                .from(posts)
                .where(eq(posts.id, postId))
                .limit(1);

            if (results.length === 0) {
                throw new Error("Post not found");
            }

            return results[0];
        }),

    // Update a post (own posts only)
    updatePost: protectedProcedure
        .input(z.object({
            postId: z.string().uuid(),
            title: z.string().min(3).max(300).optional(),
            body: z.string().max(40000).optional(),
            isNsfw: z.boolean().optional(),
            isSpoiler: z.boolean().optional(),
            flairText: z.string().max(64).optional(),
        }))
        .mutation(async ({ ctx, input }) => {
            const { postId, ...updates } = input;
            const userId = ctx.session.user.id;

            // Verify ownership
            const post = await db
                .select()
                .from(posts)
                .where(eq(posts.id, postId))
                .limit(1);

            if (post.length === 0) {
                throw new Error("Post not found");
            }

            if (post[0].user_id !== userId) {
                throw new Error("Unauthorized: You can only edit your own posts");
            }

            if (post[0].is_locked) {
                throw new Error("This post is locked");
            }

            // Update post
            const [updatedPost] = await db
                .update(posts)
                .set({
                    ...updates,
                    edited_at: new Date().toISOString(),
                })
                .where(eq(posts.id, postId))
                .returning();

            return updatedPost;
        }),

    // Delete a post
    deletePost: protectedProcedure
        .input(z.object({
            postId: z.string().uuid(),
        }))
        .mutation(async ({ ctx, input }) => {
            const { postId } = input;
            const userId = ctx.session.user.id;

            // Get post with community info
            const post = await db
                .select()
                .from(posts)
                .where(eq(posts.id, postId))
                .limit(1);

            if (post.length === 0) {
                throw new Error("Post not found");
            }

            const isOwner = post[0].user_id === userId;

            // Check if user is moderator/admin if not owner
            if (!isOwner) {
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
                    throw new Error("Unauthorized: You can only delete your own posts");
                }
            }

            // Delete post (cascade will handle comments and votes)
            await db
                .delete(posts)
                .where(eq(posts.id, postId));

            return { success: true };
        }),

    // Vote on a post
    votePost: protectedProcedure
        .input(z.object({
            postId: z.string().uuid(),
            voteType: z.enum(['up', 'down']),
        }))
        .mutation(async ({ ctx, input }) => {
            const { postId, voteType } = input;
            const userId = ctx.session.user.id;

            // Check if user already voted
            const existingVote = await db
                .select()
                .from(postVotes)
                .where(
                    and(
                        eq(postVotes.post_id, postId),
                        eq(postVotes.user_id, userId)
                    )
                )
                .limit(1);

            if (existingVote.length > 0) {
                // Update existing vote if different, otherwise remove it
                if (existingVote[0].vote_type === voteType) {
                    // Remove vote (unvote)
                    await db
                        .delete(postVotes)
                        .where(
                            and(
                                eq(postVotes.post_id, postId),
                                eq(postVotes.user_id, userId)
                            )
                        );
                    return { action: 'removed', voteType: null };
                } else {
                    // Change vote
                    const [updatedVote] = await db
                        .update(postVotes)
                        .set({ 
                            vote_type: voteType,
                            updated_at: new Date().toISOString(),
                        })
                        .where(
                            and(
                                eq(postVotes.post_id, postId),
                                eq(postVotes.user_id, userId)
                            )
                        )
                        .returning();
                    return { action: 'changed', voteType: updatedVote.vote_type };
                }
            } else {
                // Create new vote
                const [newVote] = await db
                    .insert(postVotes)
                    .values({
                        post_id: postId,
                        user_id: userId,
                        vote_type: voteType,
                    })
                    .returning();
                return { action: 'created', voteType: newVote.vote_type };
            }
        }),

    // Get user's vote on a post
    getUserVote: protectedProcedure
        .input(z.object({
            postId: z.string().uuid(),
        }))
        .query(async ({ ctx, input }) => {
            const { postId } = input;
            const userId = ctx.session.user.id;

            const vote = await db
                .select()
                .from(postVotes)
                .where(
                    and(
                        eq(postVotes.post_id, postId),
                        eq(postVotes.user_id, userId)
                    )
                )
                .limit(1);

            return vote.length > 0 ? vote[0] : null;
        }),

    // List posts by user
    listUserPosts: publicProcedure
        .input(z.object({
            userId: z.string().uuid(),
            limit: z.number().min(1).max(100).optional().default(20),
            cursor: z.string().uuid().optional(),
        }))
        .query(async ({ input }) => {
            const { userId, limit, cursor } = input;

            const results = await db
                .select()
                .from(posts)
                .where(
                    cursor
                        ? and(
                            eq(posts.user_id, userId),
                            lt(posts.id, cursor)
                        )
                        : eq(posts.user_id, userId)
                )
                .orderBy(desc(posts.created_at))
                .limit(limit + 1);

            const hasMore = results.length > limit;
            const items = hasMore ? results.slice(0, limit) : results;

            return {
                items,
                nextCursor: hasMore ? items[items.length - 1].id : undefined,
            };
        }),
});
