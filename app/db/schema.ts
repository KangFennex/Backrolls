import { pgTable, text, boolean, timestamp, varchar, uuid, bigint, date } from 'drizzle-orm/pg-core';

export const quotes = pgTable('quotes', {
    id: uuid('id').defaultRandom().primaryKey(),
    quote_text: text('quote_text').notNull(),
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    region: varchar('region').notNull(),
    series: varchar('series').notNull(),
    series_code: varchar('series_code').notNull(),
    season: bigint('season', { mode: 'number' }).notNull(),
    episode: bigint('episode', { mode: 'number' }).notNull(),
    episode_title: varchar('episode_title'),
    timestamp: text('timestamp').notNull(),
    speaker: text('speaker').notNull(),
    type: varchar('type').notNull(),
    air_date: date('air_date', { mode: 'string' }).notNull(),
    original_language: text('original_language'),
    user_id: uuid('user_id').notNull(),
    is_approved: boolean('is_approved').default(false).notNull(),
    vote_count: bigint('vote_count', { mode: 'number' }).default(0).notNull(),
    share_count: bigint('share_count', { mode: 'number' }).default(0).notNull(),
    category: varchar('category'),
});

export const users = pgTable('profiles', {
    id: uuid('id').defaultRandom().primaryKey(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    username: varchar('username', { length: 100 }).notNull().unique(),
    password_hash: text('password_hash').notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    is_verified: boolean('is_verified').default(false).notNull(),
    role: varchar('role', { length: 50 }).default('user').notNull(),
});

export const favorites = pgTable('user_favorites', {
    user_id: uuid('user_id').notNull(),
    quote_id: uuid('quote_id').notNull(),
    favorited_at: timestamp('favorited_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
    pk: { primaryKey: [table.user_id, table.quote_id] },
}));

export const votes = pgTable('user_votes', {
    user_id: uuid('user_id').notNull(),
    quote_id: uuid('quote_id').notNull(),
    vote_type: varchar('vote_type'), // 'upvote' or 'downvote'
    voted_at: timestamp('voted_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
    pk: { primaryKey: [table.user_id, table.quote_id] },
}));

export const quoteContexts = pgTable('quote_contexts', {
    id: uuid('id').defaultRandom().primaryKey(),
    quote_id: uuid('quote_id').notNull(),
    context: text('context').notNull(),
    submitted_by: uuid('submitted_by'),
    submitted_at: timestamp('submitted_at').defaultNow().notNull(),
    is_verified: boolean('is_verified').default(false).notNull(),
});

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
