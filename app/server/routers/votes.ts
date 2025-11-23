import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';
import { db } from '../../db';
import { votes, quotes } from '../../db/schema';
import { eq, and, sql } from 'drizzle-orm';

export const votesRouter = router({
    // Get all votes for current user
    getUserVotes: publicProcedure
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
                .from(votes)
                .where(eq(votes.user_id, userId));

            return {
                votes: userVotes.map(v => ({
                    quote_id: v.quote_id,
                    vote_type: v.vote_type as 'upvote' | 'downvote',
                })),
            };
        }),

    // Toggle vote (add, remove, or switch)
    toggleVote: protectedProcedure
        .input(z.object({
            quoteId: z.string().uuid(),
            voteType: z.enum(['upvote', 'downvote']),
        }))
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.session.user.id;

            if (!userId) {
                throw new Error('User not authenticated');
            }

            // Check if user already voted on this quote
            const existingVote = await db
                .select()
                .from(votes)
                .where(
                    and(
                        eq(votes.user_id, userId),
                        eq(votes.quote_id, input.quoteId)
                    )
                )
                .limit(1);

            let action: 'added' | 'removed' | 'switched';

            if (existingVote.length > 0) {
                const currentVote = existingVote[0];

                if (currentVote.vote_type === input.voteType) {
                    // User is removing their vote
                    await db
                        .delete(votes)
                        .where(
                            and(
                                eq(votes.user_id, userId),
                                eq(votes.quote_id, input.quoteId)
                            )
                        );
                    action = 'removed';
                } else {
                    // User is switching their vote
                    await db
                        .update(votes)
                        .set({ vote_type: input.voteType })
                        .where(
                            and(
                                eq(votes.user_id, userId),
                                eq(votes.quote_id, input.quoteId)
                            )
                        );
                    action = 'switched';
                }
            } else {
                // User is casting a new vote
                await db.insert(votes).values({
                    user_id: userId,
                    quote_id: input.quoteId,
                    vote_type: input.voteType,
                });
                action = 'added';
            }

            // Calculate new vote count for this quote
            const voteStats = await db
                .select({
                    upvotes: sql<number>`COUNT(CASE WHEN ${votes.vote_type} = 'upvote' THEN 1 END)`,
                    downvotes: sql<number>`COUNT(CASE WHEN ${votes.vote_type} = 'downvote' THEN 1 END)`,
                })
                .from(votes)
                .where(eq(votes.quote_id, input.quoteId));

            const upvoteCount = Number(voteStats[0]?.upvotes || 0);
            const downvoteCount = Number(voteStats[0]?.downvotes || 0);
            const newVoteCount = upvoteCount - downvoteCount;

            // Update the quote's vote_count
            await db
                .update(quotes)
                .set({ vote_count: newVoteCount })
                .where(eq(quotes.id, input.quoteId));

            return {
                success: true,
                action,
                quoteId: input.quoteId,
                newVoteCount,
            };
        }),
});
