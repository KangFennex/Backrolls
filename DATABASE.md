# Database Setup with Drizzle ORM

## Overview

This project now uses Drizzle ORM for type-safe database queries with PostgreSQL.

## File Structure

```
app/
  db/
    schema.ts    # Database schema definitions
    index.ts     # Database connection
drizzle.config.ts # Drizzle Kit configuration
```

## Environment Variables

Make sure you have `DATABASE_URL` in your `.env` file:

```env
DATABASE_URL=postgresql://user:password@host:port/database
```

## Available Scripts

- `pnpm db:generate` - Generate migrations from schema
- `pnpm db:push` - Push schema changes directly to database (no migration files)
- `pnpm db:migrate` - Run migrations
- `pnpm db:studio` - Open Drizzle Studio (GUI for database)

## Schema

The main tables are:

- **quotes** - Quote data with region, series, season, episode info
- **users** - User accounts
- **favorites** - User favorite quotes
- **votes** - User votes on quotes
- **quote_contexts** - Additional context for quotes

## Usage

### Importing

```typescript
import { db } from '@/app/db';
import { quotes, users } from '@/app/db/schema';
import { eq, and, or, like } from 'drizzle-orm';
```

### Example Queries

```typescript
// Select all quotes
const allQuotes = await db.select().from(quotes);

// Filter by series
const rpdrQuotes = await db
  .select()
  .from(quotes)
  .where(eq(quotes.seriesCode, 'rpdr'));

// Multiple conditions
const filtered = await db
  .select()
  .from(quotes)
  .where(
    and(
      eq(quotes.region, 'americas'),
      eq(quotes.season, 1)
    )
  );

// Search with LIKE
const searchResults = await db
  .select()
  .from(quotes)
  .where(like(quotes.quoteText, '%sashay%'));
```

## Migration from Supabase

All database queries have been migrated from Supabase client to Drizzle ORM:

- ✅ `searchQuotes()` - Search by text or speaker
- ✅ `getQuoteById()` - Get specific quote
- ✅ `getRecentQuotes()` - Get recent quotes
- ✅ `getTopRatedQuotes()` - Get top voted quotes
- ✅ `getFilteredQuotes()` - Filter by region/series/season/episode
- ✅ `getRandomQuote()` - Get random quotes
- ✅ `getQuizQuotes()` - Get quiz questions with options

## Benefits

- **Type Safety** - Full TypeScript support with inferred types
- **Better Performance** - More efficient queries
- **Cleaner Code** - No more long template strings for SELECT statements
- **Better DX** - Autocomplete and IntelliSense for all queries
- **Migrations** - Track schema changes with version control
