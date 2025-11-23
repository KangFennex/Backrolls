import { router, publicProcedure } from '../trpc';
import { db } from '../../db';
import { quotes } from '../../db/schema';
import { eq, desc } from 'drizzle-orm';

export const submittedRouter = router({
    // Get all submitted quotes for current user
    getUserSubmitted: publicProcedure
        .query(async ({ ctx }) => {
            const userId = ctx.session.user.id;

            if (!userId) {
                return { quotes: [], count: 0 };
            }

            const userSubmitted = await db
                .select()
                .from(quotes)
                .where(eq(quotes.user_id, userId))
                .orderBy(desc(quotes.created_at));

            return {
                quotes: userSubmitted,
                count: userSubmitted.length,
            };
        }),
});
