import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';
import { db } from '../../db';
import { postVotes, posts } from '../../db/schema';
import { eq, and, sql } from 'drizzle-orm';

export const postVotesRouter = router({
    // Get all votes for current user
    getPostUserVotes: publicProcedure
        .query(async ({ ctx }) => {

            if (!ctx.session?.user?.id) {
                return { votes: [] };
            }
            const userId = ctx.session.user.id;

            if (!userId) {
                return { votes: [] };
            }

            const userVotes = await db
                .select()
                .from(postVotes)
                .where(eq(postVotes.user_id, userId));

            return {
                votes: userVotes.map(v => ({
                    post_id: v.post_id,
                    vote_type: v.vote_type as 'up' | 'down',
                })),
            };
        }),

    // Toggle vote (add, remove, or switch)
    togglePostVote: protectedProcedure
        .input(z.object({
            post_id: z.string().uuid(),
            vote_type: z.enum(['up', 'down']),
        }))
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.session.user.id;

            if (!userId) {
                throw new Error('User not authenticated');
            }
            // Check if user already voted on this post
            const existingVote = await db
                .select()
                .from(postVotes)
                .where(
                    and(
                        eq(postVotes.user_id, userId),
                        eq(postVotes.post_id, input.post_id)
                    )
                )
                .limit(1);

            let action: 'added' | 'removed' | 'switched';

            if (existingVote.length > 0) {
                const currentVote = existingVote[0];

                if (currentVote.vote_type === input.vote_type) {
                    // User is removing their vote
                    await db
                        .delete(postVotes)
                        .where(
                            and(
                                eq(postVotes.user_id, userId),
                                eq(postVotes.post_id, input.post_id)
                            )
                        );
                    action = 'removed';
                } else {
                    // User is switching their vote
                    await db
                        .update(postVotes)
                        .set({ vote_type: input.vote_type })
                        .where(
                            and(
                                eq(postVotes.user_id, userId),
                                eq(postVotes.post_id, input.post_id)
                            )
                        );
                    action = 'switched';
                }
            } else {
                // User is casting a new vote
                await db
                    .insert(postVotes)
                    .values({
                        user_id: userId,
                        post_id: input.post_id,
                        vote_type: input.vote_type,
                    });
                action = 'added';
            }

            // Calculate new vote counts for this post
            const voteStats = await db
                .select({
                    upvotes: sql<number>`COUNT(CASE WHEN ${postVotes.vote_type} = 'up' THEN 1 END)`,
                    downvotes: sql<number>`COUNT(CASE WHEN ${postVotes.vote_type} = 'down' THEN 1 END)`,
                })
                .from(postVotes)
                .where(eq(postVotes.post_id, input.post_id));

            const upvoteCount = Number(voteStats[0]?.upvotes || 0);
            const downvoteCount = Number(voteStats[0]?.downvotes || 0);
            const newVoteCount = upvoteCount - downvoteCount;

            // Update the post's vote counts (for analytics) and net vote_count (for display)
            await db
                .update(posts)
                .set({
                    vote_count: newVoteCount,
                    upvote_count: upvoteCount,
                    downvote_count: downvoteCount
                })
                .where(eq(posts.id, input.post_id));

            return {
                success: true,
                action,
                post_id: input.post_id,
                newVoteCount,
            };
        }),
});
