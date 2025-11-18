import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { db } from '../../db';
import { favorites, quotes } from '../../db/schema';
import { eq, and, inArray } from 'drizzle-orm';
import { getUserFromRequest } from '../../lib/auth';

export const favoritesRouter = router({
    // Get all favorites for current user (returns full quote data)
    getUserFavorites: publicProcedure
        .query(async () => {
            const userId = await getUserFromRequest();
            
            if (!userId) {
                return { favoriteIds: [], quotes: [] };
            }

            const userFavorites = await db
                .select()
                .from(favorites)
                .where(eq(favorites.user_id, userId));

            const favoriteIds = userFavorites.map(f => f.quote_id);

            // If no favorites, return empty
            if (favoriteIds.length === 0) {
                return { favoriteIds: [], quotes: [] };
            }

            // Fetch full quote data for all favorites
            const favoriteQuotes = await db
                .select()
                .from(quotes)
                .where(inArray(quotes.id, favoriteIds));

            return {
                favoriteIds,
                quotes: favoriteQuotes,
            };
        }),

    // Toggle favorite (add or remove)
    toggleFavorite: publicProcedure
        .input(z.object({
            quoteId: z.string().uuid(),
        }))
        .mutation(async ({ input }) => {
            const userId = await getUserFromRequest();

            if (!userId) {
                throw new Error('User not authenticated');
            }

            // Check if favorite already exists
            const existing = await db
                .select()
                .from(favorites)
                .where(
                    and(
                        eq(favorites.user_id, userId),
                        eq(favorites.quote_id, input.quoteId)
                    )
                )
                .limit(1);

            if (existing.length > 0) {
                // Remove favorite
                await db
                    .delete(favorites)
                    .where(
                        and(
                            eq(favorites.user_id, userId),
                            eq(favorites.quote_id, input.quoteId)
                        )
                    );

                return {
                    success: true,
                    action: 'removed',
                    quoteId: input.quoteId,
                };
            } else {
                // Add favorite
                await db.insert(favorites).values({
                    user_id: userId,
                    quote_id: input.quoteId,
                });

                return {
                    success: true,
                    action: 'added',
                    quoteId: input.quoteId,
                };
            }
        }),
});
