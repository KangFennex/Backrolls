import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { db } from "../../db";
import { communities, communityMembers, posts } from "../../db/schema";
import { desc, lt, eq, and, sql } from "drizzle-orm";

export const communityRouter = router({
    // Create a new community
    createCommunity: protectedProcedure
        .input(z.object({
            name: z.string().min(4).max(100),
            description: z.string().min(20).max(10000),
            privacy: z.enum(["public", "private", "restricted"]),
        }))
        .mutation(async ({ ctx, input }) => {
            const { name, description, privacy } = input;
            const userId = ctx.session.user.id;

            // Generate a URL-safe slug from the name
            const slug = name
                .toLowerCase()
                .trim()
                .replace(/[^\w\s-]/g, '') // Remove non-word chars except spaces and hyphens
                .replace(/[\s_-]+/g, '-')  // Replace spaces, underscores, multiple hyphens with single hyphen
                .replace(/^-+|-+$/g, '');  // Remove leading/trailing hyphens

            return await db.transaction(async (tx) => {
                // Check if slug already exists and make it unique if needed
                let uniqueSlug = slug;
                let counter = 1;
                while (true) {
                    const existing = await tx
                        .select()
                        .from(communities)
                        .where(eq(communities.slug, uniqueSlug))
                        .limit(1);

                    if (existing.length === 0) break;
                    uniqueSlug = `${slug}-${counter}`;
                    counter++;
                }

                // Insert the new community
                const [newCommunity] = await tx
                    .insert(communities)
                    .values({
                        name,
                        slug: uniqueSlug,
                        description,
                        privacy,
                        creator_id: userId,
                    })
                    .returning();

                // Add the creator as a member and admin
                await tx
                    .insert(communityMembers)
                    .values({
                        community_id: newCommunity.id,
                        user_id: userId,
                        role: 'admin',
                    });

                return newCommunity;
            });
        }),

    // Get details of a single community
    getCommunity: publicProcedure
        .input(z.object({
            id: z.string().uuid(),
        }))
        .query(async ({ input }) => {
            const { id } = input;

            const results = await db
                .select()
                .from(communities)
                .where(eq(communities.id, id))
                .limit(1);

            return results[0] || null;
        }),

    // List all communities
    listCommunities: publicProcedure
        .input(z.object({
            limit: z.number().min(1).max(100).optional().default(20),
            cursor: z.string().uuid().optional(),
        }))
        .query(async ({ input }) => {
            const { limit, cursor } = input;

            const results = await db
                .select()
                .from(communities)
                .where(cursor ? lt(communities.id, cursor) : undefined)
                .orderBy(desc(communities.member_count), desc(communities.created_at))
                .limit(limit + 1);

            const hasMore = results.length > limit;
            const items = hasMore ? results.slice(0, limit) : results;

            return {
                items,
                nextCursor: hasMore ? items[items.length - 1].id : undefined,
            };
        }),

    // Join community
    joinCommunity: protectedProcedure
        .input(z.object({
            communityId: z.string().uuid(),
        }))
        .mutation(async ({ ctx, input }) => {
            const { communityId } = input;
            const userId = ctx.session.user.id;

            // Check if already a member
            const existing = await db
                .select()
                .from(communityMembers)
                .where(
                    and(
                        eq(communityMembers.community_id, communityId),
                        eq(communityMembers.user_id, userId)
                    )
                )
                .limit(1);

            if (existing.length > 0) {
                throw new Error("Already a member of this community");
            }

            // Add membership
            const [member] = await db
                .insert(communityMembers)
                .values({
                    community_id: communityId,
                    user_id: userId,
                    role: 'member',
                })
                .returning();

            return member;
        }),

    // Leave community
    leaveCommunity: protectedProcedure
        .input(z.object({
            communityId: z.string().uuid(),
        }))
        .mutation(async ({ ctx, input }) => {
            const { communityId } = input;
            const userId = ctx.session.user.id;

            // Check if user is the creator/admin
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
                throw new Error("Not a member of this community");
            }

            if (membership[0].role === 'admin') {
                // Check if there are other admins
                const adminCount = await db
                    .select()
                    .from(communityMembers)
                    .where(
                        and(
                            eq(communityMembers.community_id, communityId),
                            eq(communityMembers.role, 'admin')
                        )
                    );

                if (adminCount.length === 1) {
                    throw new Error("Cannot leave: you are the only admin. Transfer admin role first.");
                }
            }

            // Remove membership
            await db
                .delete(communityMembers)
                .where(
                    and(
                        eq(communityMembers.community_id, communityId),
                        eq(communityMembers.user_id, userId)
                    )
                );

            return { success: true };
        }),

    // Update community settings (moderators/admins only)
    updateCommunity: protectedProcedure
        .input(z.object({
            communityId: z.string().uuid(),
            name: z.string().min(4).max(100).optional(),
            description: z.string().min(20).max(10000).optional(),
            info_content: z.string().max(50000).optional(),
            privacy: z.enum(["public", "private", "restricted"]).optional(),
            allow_text_posts: z.boolean().optional(),
            allow_link_posts: z.boolean().optional(),
            allow_image_posts: z.boolean().optional(),
            allow_video_posts: z.boolean().optional(),
            require_post_approval: z.boolean().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
            const { communityId, ...updates } = input;
            const userId = ctx.session.user.id;

            // Check if user is a moderator or admin
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

            if (membership.length === 0 || !['admin', 'moderator'].includes(membership[0].role)) {
                throw new Error("Unauthorized: Must be a moderator or admin");
            }

            // If name is being updated, regenerate slug and update posts
            if (updates.name) {
                const newSlug = updates.name
                    .toLowerCase()
                    .trim()
                    .replace(/[^\w\s-]/g, '')
                    .replace(/[\s_-]+/g, '-')
                    .replace(/^-+|-+$/g, '');

                // Check slug uniqueness
                let uniqueSlug = newSlug;
                let counter = 1;
                while (true) {
                    const existing = await db
                        .select()
                        .from(communities)
                        .where(and(
                            eq(communities.slug, uniqueSlug),
                            sql`${communities.id} != ${communityId}`
                        ))
                        .limit(1);

                    if (existing.length === 0) break;
                    uniqueSlug = `${newSlug}-${counter}`;
                    counter++;
                }

                // Update posts with new slug
                await db
                    .update(posts)
                    .set({ community_slug: uniqueSlug })
                    .where(eq(posts.community_id, communityId));

                // Add slug to updates
                const updatedValues = { ...updates, slug: uniqueSlug };

                // Update community
                const [updatedCommunity] = await db
                    .update(communities)
                    .set(updatedValues)
                    .where(eq(communities.id, communityId))
                    .returning();

                return updatedCommunity;
            }

            // Update community
            const [updatedCommunity] = await db
                .update(communities)
                .set(updates)
                .where(eq(communities.id, communityId))
                .returning();

            return updatedCommunity;
        }),

    // Get community members
    getCommunityMembers: publicProcedure
        .input(z.object({
            communityId: z.string().uuid(),
            limit: z.number().min(1).max(100).optional().default(20),
            cursor: z.string().uuid().optional(),
        }))
        .query(async ({ input }) => {
            const { communityId, limit, cursor } = input;

            const results = await db
                .select()
                .from(communityMembers)
                .where(
                    cursor
                        ? and(
                            eq(communityMembers.community_id, communityId),
                            lt(communityMembers.id, cursor)
                        )
                        : eq(communityMembers.community_id, communityId)
                )
                .orderBy(desc(communityMembers.joined_at))
                .limit(limit + 1);

            const hasMore = results.length > limit;
            const items = hasMore ? results.slice(0, limit) : results;

            return {
                items,
                nextCursor: hasMore ? items[items.length - 1].id : undefined,
            };
        }),

    // Get posts in a community
    getCommunityPosts: publicProcedure
        .input(z.object({
            communityId: z.string().uuid(),
            sortBy: z.enum(['hot', 'new', 'top']).optional().default('hot'),
            limit: z.number().min(1).max(100).optional().default(20),
            cursor: z.string().uuid().optional(),
        }))
        .query(async ({ input }) => {
            const { communityId, sortBy, limit, cursor } = input;

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
                    cursor
                        ? and(
                            eq(posts.community_id, communityId),
                            lt(posts.id, cursor)
                        )
                        : eq(posts.community_id, communityId)
                )
                .orderBy(...orderByClause)
                .limit(limit + 1);

            const hasMore = results.length > limit;
            const items = hasMore ? results.slice(0, limit) : results;

            return {
                items,
                nextCursor: hasMore ? items[items.length - 1].id : undefined,
            };
        }),
});