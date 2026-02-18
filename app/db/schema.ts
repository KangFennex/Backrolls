import { pgTable, text, boolean, timestamp, varchar, uuid, bigint, date, unique, index } from 'drizzle-orm/pg-core';

export const quotes = pgTable('quotes', {
    id: uuid('id').defaultRandom().primaryKey(),
    quote_text: text('quote_text').notNull(),
    created_at: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    region: varchar('region').notNull(),
    series: varchar('series').notNull(),
    series_code: varchar('series_code').notNull(),
    season: bigint('season', { mode: 'number' }).notNull(),
    episode: bigint('episode', { mode: 'number' }).notNull(),
    episode_title: varchar('episode_title'),
    timestamp: text('timestamp').notNull(),
    speaker: text('speaker').notNull(),
    type: text('type').notNull(),
    air_date: date('air_date', { mode: 'string' }),
    original_language: text('original_language').default('english'),
    original_language_text: text('original_language_text'),
    user_id: uuid('user_id').notNull(),
    is_approved: boolean('is_approved').default(false).notNull(),
    vote_count: bigint('vote_count', { mode: 'number' }).default(0).notNull(),
    comment_count: bigint('comment_count', { mode: 'number' }).default(0).notNull(),
    share_count: bigint('share_count', { mode: 'number' }).default(0).notNull(),
    view_count: bigint('view_count', { mode: 'number' }).default(0).notNull(),
});

export const users = pgTable('profiles', {
    id: uuid('id').defaultRandom().primaryKey(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    username: varchar('username', { length: 100 }).notNull().unique(),
    password_hash: text('password_hash').notNull(),
    created_at: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
    is_verified: boolean('is_verified').default(false).notNull(),
    role: varchar('role', { length: 50 }).default('user').notNull(),
});

export const favorites = pgTable('user_favorites', {
    user_id: uuid('user_id').notNull(),
    quote_id: uuid('quote_id').notNull(),
    favorited_at: timestamp('favorited_at', { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => ({
    pk: { primaryKey: [table.user_id, table.quote_id] },
}));

export const votes = pgTable('user_votes', {
    user_id: uuid('user_id').notNull(),
    quote_id: uuid('quote_id').notNull(),
    vote_type: varchar('vote_type'), // 'upvote' or 'downvote'
    voted_at: timestamp('voted_at', { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => ({
    pk: { primaryKey: [table.user_id, table.quote_id] },
}));

export const quoteContexts = pgTable('quote_contexts', {
    id: uuid('id').defaultRandom().primaryKey(),
    quote_id: uuid('quote_id').notNull(),
    context: text('context').notNull(),
    user_id: uuid('user_id').notNull(),
    submitted_at: timestamp('submitted_at', { mode: 'string' }).defaultNow().notNull(),
    is_verified: boolean('is_verified').default(false).notNull(),
});

// Backroll comments schema

const backrollCommentsSelfRef = () => backrollComments;

export const backrollComments = pgTable('backroll_comments', {
    id: uuid('id').defaultRandom().primaryKey(),
    quote_id: uuid('quote_id').notNull().references(() => quotes.id, { onDelete: 'cascade' }),
    parent_comment_id: uuid('parent_comment_id').references(backrollCommentsSelfRef, { onDelete: 'cascade' }),
    user_id: uuid('user_id').notNull(),
    comment_text: text('comment_text').notNull(),
    created_at: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
    updated_at: timestamp('updated_at', { mode: 'string' }).defaultNow().notNull(),
    is_edited: boolean('is_edited').default(false).notNull(),
    is_flagged: boolean('is_flagged').default(false).notNull(),
    vote_count: bigint('vote_count', { mode: 'number' }).default(0).notNull(),
    status: text('status', { enum: ['active', 'deleted', 'flagged'] }).default('active'),
});

export const commentVotes = pgTable('comment_votes', {
    id: uuid('id').defaultRandom().primaryKey(),
    comment_id: uuid('comment_id').notNull().references(() => backrollComments.id, { onDelete: 'cascade' }),
    user_id: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    vote_type: text('vote_type', { enum: ['up', 'down'] }).notNull(),
    created_at: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
    updated_at: timestamp('updated_at', { mode: 'string' }).defaultNow().notNull(),
}, (table) => ({
    // Prevent duplicate votes
    unq: unique().on(table.user_id, table.comment_id),
}));

// Community (Tea Room) schema

export const communities = pgTable('communities', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 100 }).notNull().unique(),
    slug: varchar('slug', { length: 100 }).notNull().unique(),
    description: text('description'),
    info_content: text('info_content'),
    icon_url: text('icon_url'),
    banner_url: text('banner_url'),
    creator_id: uuid('creator_id').notNull().references(() => users.id, { onDelete: 'restrict' }),
    created_at: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
    updated_at: timestamp('updated_at', { mode: 'string' }).defaultNow().notNull(),
    privacy: text('privacy', { enum: ['public', 'private', 'restricted'] }).default('public').notNull(),
    allow_text_posts: boolean('allow_text_posts').default(true).notNull(),
    allow_link_posts: boolean('allow_link_posts').default(true).notNull(),
    allow_image_posts: boolean('allow_image_posts').default(true).notNull(),
    allow_video_posts: boolean('allow_video_posts').default(true).notNull(),
    require_post_approval: boolean('require_post_approval').default(false).notNull(),
    member_count: bigint('member_count', { mode: 'number' }).default(0).notNull(),
    post_count: bigint('post_count', { mode: 'number' }).default(0).notNull(),
    is_archived: boolean('is_archived').default(false).notNull(),
    archived_at: timestamp('archived_at', { mode: 'string' }),
});

// Community members table
export const communityMembers = pgTable('community_members', {
    id: uuid('id').defaultRandom().primaryKey(),
    community_id: uuid('community_id').notNull().references(() => communities.id, { onDelete: 'cascade' }),
    user_id: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    role: text('role', { enum: ['member', 'moderator', 'admin'] }).default('member').notNull(),
    joined_at: timestamp('joined_at', { mode: 'string' }).defaultNow().notNull(),
    notifications_enabled: boolean('notifications_enabled').default(true).notNull(),
    show_in_feed: boolean('show_in_feed').default(true).notNull(),
    is_banned: boolean('is_banned').default(false).notNull(),
    banned_at: timestamp('banned_at', { mode: 'string' }),
    banned_by: uuid('banned_by'),
    ban_reason: text('ban_reason'),
}, (table) => ({
    unq: unique().on(table.community_id, table.user_id),
}));

export const posts = pgTable('posts', {
    id: uuid('id').defaultRandom().primaryKey(),
    community_id: uuid('community_id').notNull().references(() => communities.id, { onDelete: 'cascade' }),
    community_slug: varchar('community_slug', { length: 100 }).notNull(), // Denormalized for performance
    user_id: uuid('user_id').references(() => users.id, { onDelete: 'set null' }), // Keep post if user deleted
    username: varchar('username', { length: 100 }), // Denormalized for performance, nullable if user deleted

    // Content
    title: varchar('title', { length: 300 }).notNull(),
    body: text('body'), // Markdown content for text posts
    post_type: text('post_type', { enum: ['text', 'link', 'image', 'video'] }).notNull(),

    // For link/media posts
    url: text('url'), // External link or uploaded media URL
    thumbnail_url: text('thumbnail_url'),

    // Metadata
    created_at: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
    updated_at: timestamp('updated_at', { mode: 'string' }).defaultNow().notNull(),
    edited_at: timestamp('edited_at', { mode: 'string' }),

    // Stats (denormalized)
    vote_count: bigint('vote_count', { mode: 'number' }).default(0).notNull(),
    upvote_count: bigint('upvote_count', { mode: 'number' }).default(0).notNull(),
    downvote_count: bigint('downvote_count', { mode: 'number' }).default(0).notNull(),
    comment_count: bigint('comment_count', { mode: 'number' }).default(0).notNull(),
    view_count: bigint('view_count', { mode: 'number' }).default(0).notNull(),

    // Ranking (for hot algorithm)
    hot_score: bigint('hot_score', { mode: 'number' }).default(0).notNull(),
    controversy_score: bigint('controversy_score', { mode: 'number' }).default(0).notNull(),

    // Moderation
    is_pinned: boolean('is_pinned').default(false).notNull(),
    is_locked: boolean('is_locked').default(false).notNull(), // Prevent new comments
    is_archived: boolean('is_archived').default(false).notNull(), // Prevent edits/votes
    is_removed: boolean('is_removed').default(false).notNull(),
    removed_at: timestamp('removed_at', { mode: 'string' }),
    removed_by: uuid('removed_by'),
    removal_reason: text('removal_reason'),

    // Filtering
    is_nsfw: boolean('is_nsfw').default(false).notNull(),
    is_spoiler: boolean('is_spoiler').default(false).notNull(),

    // Flair
    flair_id: uuid('flair_id'), // Optional, link to community flair
    flair_text: varchar('flair_text', { length: 64 }), // Custom text override
}, (table) => ({
    communityIdx: index('posts_community_id_idx').on(table.community_id),
    userIdx: index('posts_user_id_idx').on(table.user_id),
    createdAtIdx: index('posts_created_at_idx').on(table.created_at),
    hotScoreIdx: index('posts_hot_score_idx').on(table.hot_score),
    voteCountIdx: index('posts_vote_count_idx').on(table.vote_count),
    communityHotIdx: index('posts_community_hot_idx').on(table.community_id, table.hot_score),
    communityNewIdx: index('posts_community_new_idx').on(table.community_id, table.created_at),
}));

export const postVotes = pgTable('post_votes', {
    id: uuid('id').defaultRandom().primaryKey(),
    post_id: uuid('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
    user_id: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    vote_type: text('vote_type', { enum: ['up', 'down'] }).notNull(),
    created_at: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
    updated_at: timestamp('updated_at', { mode: 'string' }).defaultNow().notNull(),
}, (table) => ({
    unq: unique().on(table.user_id, table.post_id),
    postIdx: index('post_votes_post_id_idx').on(table.post_id),
    userIdx: index('post_votes_user_id_idx').on(table.user_id),
}));

const postCommentsSelfRef = () => postComments;

export const postComments = pgTable('post_comments', {
    id: uuid('id').defaultRandom().primaryKey(),
    post_id: uuid('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
    parent_comment_id: uuid('parent_comment_id').references(postCommentsSelfRef, { onDelete: 'cascade' }),
    user_id: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
    username: varchar('username', { length: 100 }), // Denormalized for performance, nullable if user deleted

    comment_text: text('comment_text').notNull(),

    created_at: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
    updated_at: timestamp('updated_at', { mode: 'string' }).defaultNow().notNull(),
    edited_at: timestamp('edited_at', { mode: 'string' }),

    is_edited: boolean('is_edited').default(false).notNull(),

    // Stats
    vote_count: bigint('vote_count', { mode: 'number' }).default(0).notNull(),
    upvote_count: bigint('upvote_count', { mode: 'number' }).default(0).notNull(),
    downvote_count: bigint('downvote_count', { mode: 'number' }).default(0).notNull(),
    reply_count: bigint('reply_count', { mode: 'number' }).default(0).notNull(),

    // Depth tracking (optimization for nested comments)
    depth: bigint('depth', { mode: 'number' }).default(0).notNull(),

    // Moderation
    is_removed: boolean('is_removed').default(false).notNull(),
    removed_at: timestamp('removed_at', { mode: 'string' }),
    removed_by: uuid('removed_by'),
    removal_reason: text('removal_reason'),

    status: text('status', { enum: ['active', 'deleted', 'removed'] }).default('active'),
}, (table) => ({
    postIdx: index('post_comments_post_id_idx').on(table.post_id),
    parentIdx: index('post_comments_parent_id_idx').on(table.parent_comment_id),
    userIdx: index('post_comments_user_id_idx').on(table.user_id),
}));

export const postCommentVotes = pgTable('post_comment_votes', {
    id: uuid('id').defaultRandom().primaryKey(),
    comment_id: uuid('comment_id').notNull().references(() => postComments.id, { onDelete: 'cascade' }),
    user_id: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    vote_type: text('vote_type', { enum: ['up', 'down'] }).notNull(),
    created_at: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
    updated_at: timestamp('updated_at', { mode: 'string' }).defaultNow().notNull(),
}, (table) => ({
    unq: unique().on(table.user_id, table.comment_id),
}));

export const communityFlairs = pgTable('community_flairs', {
    id: uuid('id').defaultRandom().primaryKey(),
    community_id: uuid('community_id').notNull().references(() => communities.id, { onDelete: 'cascade' }),
    text: varchar('text', { length: 64 }).notNull(),
    background_color: varchar('background_color', { length: 7 }),
    text_color: varchar('text_color', { length: 7 }),
    created_at: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
}, (table) => ({
    unq: unique().on(table.community_id, table.text),
}));


// Type exports for use in your application
export type Quote = typeof quotes.$inferSelect;
export type NewQuote = typeof quotes.$inferInsert;

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Favorite = typeof favorites.$inferSelect;
export type NewFavorite = typeof favorites.$inferInsert;

export type Vote = typeof votes.$inferSelect;
export type NewVote = typeof votes.$inferInsert;

export type QuoteContext = typeof quoteContexts.$inferSelect;
export type NewQuoteContext = typeof quoteContexts.$inferInsert;

export type CommentVote = typeof commentVotes.$inferSelect;
export type NewCommentVote = typeof commentVotes.$inferInsert;

export type BackrollComment = typeof backrollComments.$inferSelect;
export type NewBackrollComment = typeof backrollComments.$inferInsert;

export type Community = typeof communities.$inferSelect;
export type NewCommunity = typeof communities.$inferInsert;

export type CommunityMember = typeof communityMembers.$inferSelect;
export type NewCommunityMember = typeof communityMembers.$inferInsert;

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;

export type PostVote = typeof postVotes.$inferSelect;
export type NewPostVote = typeof postVotes.$inferInsert;

export type PostComment = typeof postComments.$inferSelect;
export type NewPostComment = typeof postComments.$inferInsert;

export type PostCommentVote = typeof postCommentVotes.$inferSelect;
export type NewPostCommentVote = typeof postCommentVotes.$inferInsert;

export type CommunityFlair = typeof communityFlairs.$inferSelect;
export type NewCommunityFlair = typeof communityFlairs.$inferInsert;