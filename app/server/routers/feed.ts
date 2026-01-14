import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { db } from "../../db";
import { posts, communities, communityMembers } from "../../db/schema";
import { desc, eq, inArray, and } from "drizzle-orm";

export const feedRouter = router({
    // Get personalized home feed (posts from subscribed communities)
    getHomeFeed: protectedProcedure
        .input(z.object({
            sortBy: z.enum(['hot', 'new', 'top']).optional().default('hot'),
            limit: z.number().min(1).max(100).optional().default(25),
            offset: z.number().min(0).optional().default(0),
        }))
        .query(async ({ ctx, input }) => {
            const { sortBy, limit, offset } = input;
            const userId = ctx.session.user.id;

            // Get user's subscribed communities
            const subscriptions = await db
                .select({ communityId: communityMembers.community_id })
                .from(communityMembers)
                .where(
                    and(
                        eq(communityMembers.user_id, userId),
                        eq(communityMembers.show_in_feed, true)
                    )
                );

            if (subscriptions.length === 0) {
                return {
                    items: [],
                    hasMore: false,
                };
            }

            const communityIds = subscriptions.map(s => s.communityId);

            // Determine order by clause based on sortBy
            const orderByClause = sortBy === 'hot'
                ? [desc(posts.hot_score), desc(posts.created_at)]
                : sortBy === 'new'
                    ? [desc(posts.created_at)]
                    : [desc(posts.vote_count), desc(posts.created_at)];

            const results = await db
                .select()
                .from(posts)
                .where(
                    and(
                        inArray(posts.community_id, communityIds),
                        eq(posts.is_removed, false),
                        eq(posts.is_archived, false)
                    )
                )
                .orderBy(...orderByClause)
                .offset(offset)
                .limit(limit + 1);

            const hasMore = results.length > limit;
            const items = hasMore ? results.slice(0, limit) : results;

            return {
                items,
                hasMore,
                nextOffset: hasMore ? offset + limit : undefined,
            };
        }),

    // Get popular feed (r/all equivalent - posts from all public communities)
    getPopularFeed: publicProcedure
        .input(z.object({
            sortBy: z.enum(['hot', 'new', 'top']).optional().default('hot'),
            limit: z.number().min(1).max(100).optional().default(25),
            offset: z.number().min(0).optional().default(0),
            timeframe: z.enum(['hour', 'day', 'week', 'month', 'year', 'all']).optional().default('day'),
        }))
        .query(async ({ input }) => {
            const { sortBy, limit, offset, timeframe } = input;

            // Calculate time threshold for filtering
            let timeThreshold: Date | null = null;
            if (sortBy === 'top' && timeframe !== 'all') {
                const now = new Date();
                switch (timeframe) {
                    case 'hour':
                        timeThreshold = new Date(now.getTime() - 60 * 60 * 1000);
                        break;
                    case 'day':
                        timeThreshold = new Date(now.getTime() - 24 * 60 * 60 * 1000);
                        break;
                    case 'week':
                        timeThreshold = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                        break;
                    case 'month':
                        timeThreshold = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                        break;
                    case 'year':
                        timeThreshold = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
                        break;
                }
            }

            // Get public communities
            const publicCommunities = await db
                .select({ id: communities.id })
                .from(communities)
                .where(eq(communities.privacy, 'public'));

            if (publicCommunities.length === 0) {
                return {
                    items: [],
                    hasMore: false,
                };
            }

            const communityIds = publicCommunities.map(c => c.id);

            // Determine order by clause based on sortBy
            const orderByClause = sortBy === 'hot'
                ? [desc(posts.hot_score), desc(posts.created_at)]
                : sortBy === 'new'
                    ? [desc(posts.created_at)]
                    : [desc(posts.vote_count), desc(posts.created_at)];

            const results = await db
                .select()
                .from(posts)
                .where(
                    and(
                        inArray(posts.community_id, communityIds),
                        eq(posts.is_removed, false),
                        eq(posts.is_archived, false)
                    )
                )
                .orderBy(...orderByClause)
                .offset(offset)
                .limit(limit + 1);

            const hasMore = results.length > limit;
            const items = hasMore ? results.slice(0, limit) : results;

            return {
                items,
                hasMore,
                nextOffset: hasMore ? offset + limit : undefined,
            };
        }),

    // Get trending communities
    getTrendingCommunities: publicProcedure
        .input(z.object({
            limit: z.number().min(1).max(50).optional().default(10),
        }))
        .query(async ({ input }) => {
            const { limit } = input;

            // Get communities sorted by recent activity (member count and post count)
            const results = await db
                .select()
                .from(communities)
                .where(
                    and(
                        eq(communities.privacy, 'public'),
                        eq(communities.is_archived, false)
                    )
                )
                .orderBy(
                    desc(communities.member_count),
                    desc(communities.post_count),
                    desc(communities.created_at)
                )
                .limit(limit);

            return results;
        }),

    // Search posts across all accessible communities
    searchPosts: publicProcedure
        .input(z.object({
            query: z.string().min(1).max(200),
            communityId: z.string().uuid().optional(),
            sortBy: z.enum(['hot', 'new', 'top', 'relevance']).optional().default('relevance'),
            limit: z.number().min(1).max(100).optional().default(25),
            offset: z.number().min(0).optional().default(0),
        }))
        .query(async ({ input }) => {
            const { query: searchQuery, communityId, sortBy, limit, offset } = input;

            // Determine where conditions based on communityId
            const whereConditions = communityId
                ? and(
                    eq(posts.community_id, communityId),
                    eq(posts.is_removed, false),
                    eq(posts.is_archived, false)
                )
                : and(
                    eq(posts.is_removed, false),
                    eq(posts.is_archived, false)
                );

            // Determine order by clause based on sortBy
            const orderByClause = sortBy === 'hot'
                ? [desc(posts.hot_score), desc(posts.created_at)]
                : sortBy === 'new'
                    ? [desc(posts.created_at)]
                    : sortBy === 'top'
                        ? [desc(posts.vote_count), desc(posts.created_at)]
                        : [desc(posts.created_at)]; // relevance - prioritize recent posts

            const results = await db
                .select()
                .from(posts)
                .where(whereConditions)
                .orderBy(...orderByClause)
                .offset(offset)
                .limit(limit + 1);

            // Simple text matching - filter results in memory
            // For production, use PostgreSQL's to_tsvector or a search engine like Elasticsearch
            const filteredResults = results.filter(post => {
                const titleMatch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
                const bodyMatch = post.body?.toLowerCase().includes(searchQuery.toLowerCase());
                return titleMatch || bodyMatch;
            });

            const hasMore = filteredResults.length > limit;
            const items = hasMore ? filteredResults.slice(0, limit) : filteredResults;

            return {
                items,
                hasMore,
                nextOffset: hasMore ? offset + limit : undefined,
            };
        }),
});
