import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { db } from '../../db';
import { quotes } from '../../db/schema';
import { eq, and, or, like, desc, sql, asc, SQL } from 'drizzle-orm';

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
                        like(quotes.quote_text, searchPattern),
                        like(quotes.speaker, searchPattern)
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

            let query = db.select().from(quotes);

            if (conditions.length > 0) {
                query = query.where(and(...conditions));
            }

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
            limit: z.number().optional().default(1),
        }))
        .query(async ({ input }) => {
            console.log('✅ getRandom called with limit:', input.limit);

            const results = await db
                .select()
                .from(quotes)
                .orderBy(sql`RANDOM()`)
                .limit(input.limit);

            console.log(`✅ getRandom returning ${results.length} quotes`);
            return results;
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
                .orderBy(sql`RANDOM()`)
                .limit(input.limit);

            if (selectedQuotes.length === 0) {
                return [];
            }

            // Get all unique speakers for wrong options
            const allSpeakers = await db
                .selectDistinct({ speaker: quotes.speaker })
                .from(quotes);

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
});
