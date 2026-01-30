import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';
import { db } from '../../db';
import { quotes, quoteContexts } from '../../db/schema';
import { eq, and, or, ilike, desc, sql, asc, SQL, inArray } from 'drizzle-orm';

export const quotesRouter = router({

    // Search quotes by text or speaker
    search: publicProcedure
        .input(z.object({
            query: z.string(),
        }))
        .query(async ({ input }) => {
            if (!input.query.trim()) return [];

            const searchPattern = `%${input.query}%`;
            const results = await db
                .select()
                .from(quotes)
                .where(
                    or(
                        ilike(quotes.quote_text, searchPattern),
                        ilike(quotes.speaker, searchPattern)
                    )
                )
                .orderBy(desc(quotes.created_at));

            return results;
        }),

    // Get quote by ID
    getById: publicProcedure
        .input(z.object({
            id: z.union([z.string(), z.number()]),
        }))
        .query(async ({ input }) => {
            const result = await db
                .select()
                .from(quotes)
                .where(eq(quotes.id, input.id.toString()))
                .limit(1);

            return result[0] || null;
        }),

    // Get quote by IDs
    getByIds: publicProcedure
        .input(z.object({
            ids: z.array(z.string()),
        }))
        .query(async ({ input }) => {
            if (input.ids.length === 0) {
                return [];
            }

            const result = await db
                .select()
                .from(quotes)
                .where(inArray(quotes.id, input.ids));

            return result;
        }),

    // Get recent quotes
    getRecent: publicProcedure
        .input(z.object({
            limit: z.number().optional().default(10),
        }))
        .query(async ({ input }) => {
            const results = await db
                .select()
                .from(quotes)
                .orderBy(desc(quotes.created_at))
                .limit(input.limit);

            return {
                quotes: results,
                count: results.length,
            };
        }),

    // Get top rated quotes
    getTopRated: publicProcedure
        .input(z.object({
            limit: z.number().optional().default(10),
        }))
        .query(async ({ input }) => {
            const results = await db
                .select()
                .from(quotes)
                .where(sql`${quotes.vote_count} > 0`)
                .orderBy(desc(quotes.vote_count))
                .limit(input.limit);

            return {
                quotes: results,
                count: results.length,
            };
        }),

    // Get filtered quotes (series page)
    getFiltered: publicProcedure
        .input(z.object({
            region: z.string().optional(),
            series: z.string().optional(),
            season: z.number().optional(),
            episode: z.number().optional(),
            limit: z.number().optional().default(50),
        }))
        .query(async ({ input }) => {
            const conditions: SQL[] = [];

            if (input.region) {
                conditions.push(eq(quotes.region, input.region));
            }

            if (input.series) {
                conditions.push(eq(quotes.series_code, input.series));
            }

            if (input.season !== undefined && input.season !== null) {
                conditions.push(eq(quotes.season, input.season));
            }

            if (input.episode !== undefined && input.episode !== null) {
                conditions.push(eq(quotes.episode, input.episode));
            }

            const baseQuery = db.select().from(quotes);

            const query = conditions.length > 0
                ? baseQuery.where(and(...conditions))
                : baseQuery;

            const results = await query
                .orderBy(asc(quotes.timestamp))
                .limit(input.limit);

            return {
                quotes: results,
                count: results.length,
            };
        }),

    // Get random quotes
    getRandom: publicProcedure
        .input(z.object({
            limit: z.number().optional().default(30),
            cursor: z.string().optional(),
            seed: z.number().optional(),
        }))
        .query(async ({ input }) => {
            const { limit, cursor, seed } = input;

            // Use seed for consistent random ordering within a session
            const randomSeed = seed || Math.random();

            // For cursor-based pagination, we need to track which IDs we've already seen
            const excludeIds = cursor ? cursor.split(',').filter(Boolean) : [];

            const baseQuery = db
                .select()
                .from(quotes)
                .where(sql`${quotes.speaker} != 'RuPaul'`); // Exclude RuPaul quotes

            const results = excludeIds.length > 0
                ? await baseQuery
                    .where(sql`${quotes.id} NOT IN (${sql.join(excludeIds.map(id => sql`${id}`), sql`, `)})`)
                    .orderBy(sql`RANDOM()`)
                    .limit(limit)
                : await baseQuery
                    .orderBy(sql`RANDOM()`)
                    .limit(limit);

            // Create cursor from current IDs
            const allSeenIds = [...excludeIds, ...results.map(q => q.id)];
            const nextCursor = results.length === limit ? allSeenIds.join(',') : undefined;

            console.log(`getRandom returning ${results.length} quotes, cursor: ${nextCursor ? 'has more' : 'end'}`);

            return {
                quotes: results,
                nextCursor,
                seed: randomSeed,
            };
        }),

    // Get quiz questions
    getQuiz: publicProcedure
        .input(z.object({
            limit: z.number().optional().default(10),
        }))
        .query(async ({ input }) => {
            // Get random quotes
            const selectedQuotes = await db
                .select()
                .from(quotes)
                .where(sql`${quotes.speaker} != 'RuPaul'`)
                .orderBy(sql`RANDOM()`)
                .limit(input.limit);

            if (selectedQuotes.length === 0) {
                return [];
            }

            // Get all unique speakers for wrong options
            const allSpeakers = await db
                .selectDistinct({ speaker: quotes.speaker })
                .from(quotes)
                .where(sql`${quotes.speaker} != 'RuPaul'`);

            const uniqueSpeakers = allSpeakers.map(s => s.speaker);

            // Build quiz questions
            const quizQuestions = selectedQuotes.map((quote) => {
                const correctSpeaker = quote.speaker;

                // Get 3 wrong answers
                const wrongOptions = uniqueSpeakers
                    .filter(speaker => speaker !== correctSpeaker)
                    .sort(() => Math.random() - 0.5)
                    .slice(0, 3);

                // Combine and shuffle all options
                const allOptions = [correctSpeaker, ...wrongOptions]
                    .sort(() => Math.random() - 0.5);

                return {
                    id: quote.id.toString(),
                    quote: quote.quote_text,
                    correctSpeaker: correctSpeaker,
                    series: quote.series,
                    season: quote.season,
                    episode: quote.episode,
                    options: allOptions,
                };
            });

            return quizQuestions;
        }),

    // Submit a new quote
    submit: protectedProcedure
        .input(z.object({
            region: z.string(),
            series: z.string(),
            series_code: z.string(),
            season: z.number(),
            episode: z.number(),
            quote_text: z.string(),
            speaker: z.string(),
            timestamp: z.string(),
            episode_title: z.string().optional(),
            type: z.string(),
            air_date: z.string().optional().nullable(),
            original_language: z.string().optional().default('english'),
            original_language_text: z.string().optional(),
            context: z.string().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.session.user.id;

            if (!userId) {
                throw new Error('User not authenticated');
            }

            // Use a transaction to ensure both operations succeed or fail together
            const result = await db.transaction(async (tx) => {
                // Insert the quote
                const quoteResult = await tx
                    .insert(quotes)
                    .values({
                        region: input.region,
                        series: input.series,
                        series_code: input.series_code,
                        season: input.season,
                        episode: input.episode,
                        quote_text: input.quote_text,
                        speaker: input.speaker,
                        timestamp: input.timestamp,
                        episode_title: input.episode_title || null,
                        type: input.type,
                        air_date: null,
                        original_language: input.original_language,
                        original_language_text: input.original_language_text || null,
                        user_id: userId,
                        is_approved: false,
                        vote_count: 0,
                        share_count: 0,
                        created_at: new Date().toISOString(),
                    })
                    .returning();

                // If context was provided, insert it into quoteContexts
                if (input.context && input.context.trim()) {
                    await tx.insert(quoteContexts).values({
                        quote_id: quoteResult[0].id,
                        context: input.context,
                        user_id: userId,
                        submitted_at: new Date().toISOString(),
                        is_verified: false,
                    });
                }

                return quoteResult[0];
            });

            return result;
        }),

    // Adding context
    addContext: protectedProcedure
        .input(z.object({
            quote_id: z.string(),
            context: z.string().min(1, "Context cannot be empty"),
        }))
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.session.user.id;

            if (!userId) {
                throw new Error('User not authenticated');
            }

            const result = await db
                .insert(quoteContexts)
                .values({
                    quote_id: input.quote_id,
                    context: input.context,
                    user_id: userId,
                    submitted_at: new Date().toISOString(),
                    is_verified: false,
                })
                .returning();

            return result[0];
        }),

    // Get quotes by comment count
    getByCommentCount: publicProcedure
        .input(z.object({
            limit: z.number().optional().default(10),
        }))
        .query(async ({ input }) => {
            const results = await db
                .select()
                .from(quotes)
                .orderBy(desc(quotes.comment_count))
                .limit(input.limit);

            return {
                quotes: results,
                count: results.length,
            };
        }),

    // Get quotes by speaker
    getBySpeaker: publicProcedure
        .input(z.object({
            speaker: z.string(),
            excludeId: z.string().optional(),
            limit: z.number().optional().default(10),
        }))
        .query(async ({ input }) => {
            const conditions: SQL[] = [
                eq(quotes.speaker, input.speaker)
            ];

            if (input.excludeId) {
                conditions.push(sql`${quotes.id} != ${input.excludeId}`);
            }

            const results = await db
                .select()
                .from(quotes)
                .where(and(...conditions))
                .orderBy(desc(quotes.vote_count))
                .limit(input.limit);

            return results;
        })
});