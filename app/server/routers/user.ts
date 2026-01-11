import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { db } from '../../db';
import { users, quotes, backrollComments, votes } from '../../db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const userRouter = router({
    // Get user statistics
    getStats: protectedProcedure
        .query(async ({ ctx }) => {
            const userId = ctx.session.user.id;

            // Get quotes submitted count
            const quotesSubmitted = await db
                .select({ count: sql<number>`count(*)` })
                .from(quotes)
                .where(eq(quotes.user_id, userId));

            // Get comments count
            const commentsCount = await db
                .select({ count: sql<number>`count(*)` })
                .from(backrollComments)
                .where(eq(backrollComments.user_id, userId));

            // Get votes count
            const votesCount = await db
                .select({ count: sql<number>`count(*)` })
                .from(votes)
                .where(eq(votes.user_id, userId));

            return {
                quotesSubmitted: Number(quotesSubmitted[0]?.count || 0),
                commentsCount: Number(commentsCount[0]?.count || 0),
                votesCount: Number(votesCount[0]?.count || 0),
            };
        }),

    // Get user profile
    getProfile: protectedProcedure
        .query(async ({ ctx }) => {
            const userId = ctx.session.user.id;

            const [user] = await db
                .select({
                    id: users.id,
                    username: users.username,
                    email: users.email,
                    created_at: users.created_at,
                    role: users.role,
                })
                .from(users)
                .where(eq(users.id, userId));

            return user;
        }),

    // Update username
    updateUsername: protectedProcedure
        .input(z.object({
            username: z.string().min(3).max(100),
        }))
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.session.user.id;

            // Check if username is already taken
            const existing = await db
                .select()
                .from(users)
                .where(and(
                    eq(users.username, input.username),
                ));

            if (existing.length > 0 && existing[0].id !== userId) {
                throw new Error('Username already taken');
            }

            // Update username
            await db
                .update(users)
                .set({ username: input.username })
                .where(eq(users.id, userId));

            return { success: true };
        }),

    // Update password
    updatePassword: protectedProcedure
        .input(z.object({
            currentPassword: z.string(),
            newPassword: z.string().min(8),
        }))
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.session.user.id;

            // Get user email for Supabase auth
            const [user] = await db
                .select({ email: users.email })
                .from(users)
                .where(eq(users.id, userId));

            if (!user) {
                throw new Error('User not found');
            }

            // Verify current password by attempting sign in
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: user.email,
                password: input.currentPassword,
            });

            if (signInError) {
                throw new Error('Current password is incorrect');
            }

            // Update password via Supabase
            const { error: updateError } = await supabase.auth.updateUser({
                password: input.newPassword,
            });

            if (updateError) {
                throw new Error('Failed to update password');
            }

            return { success: true };
        }),
});
