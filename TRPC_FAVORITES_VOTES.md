# Data Flow Architecture (tRPC + Drizzle)

## Overview
Your app now uses tRPC for all server communication and Drizzle ORM for database queries. The Zustand store manages client-side UI state only.

## Architecture Layers

```
Component → tRPC Hook → tRPC Router → Drizzle ORM → PostgreSQL
              ↓
         Zustand Store (UI state only)
```

## Answers to Your Questions

### 1. Are old fetch() calls valid?
**NO** - The old `fetch('/api/favorites')` calls don't work because:
- No API route handlers exist at those endpoints
- The Drizzle schema alone doesn't create endpoints
- You need tRPC routers to expose database operations

### 2. Should you create new routers and hooks?
**YES** - This is the correct approach:
- ✅ Created `favorites.ts` router
- ✅ Created `votes.ts` router  
- ✅ Created hooks: `useFavorites`, `useToggleFavorite`, `useVotes`, `useToggleVote`

### 3. When does vote calculation happen?
**On the server, when a vote is cast:**
1. User clicks vote button
2. Component calls `useToggleVote` hook
3. Hook calls `votes.toggleVote` mutation
4. Server counts all upvotes/downvotes for that quote
5. Server updates `quotes.vote_count` in database
6. Server returns new vote count
7. Hook dispatches `voteUpdated` event
8. All components showing that quote update automatically

## New Data Flow Examples

### Fetching Favorites
```tsx
// OLD (broken):
await fetch('/api/favorites')

// NEW:
import { useFavorites } from '@/lib/hooks';

function MyComponent() {
  const { data } = useFavorites();
  const favoriteIds = data?.favoriteIds || [];
}
```

### Toggling a Favorite
```tsx
// OLD (broken):
await fetch('/api/favorites', { method: 'POST', body: JSON.stringify({ quote_id }) })

// NEW:
import { useToggleFavorite } from '@/lib/hooks';

function MyComponent() {
  const toggleFavorite = useToggleFavorite();
  
  const handleFavorite = (quoteId: string) => {
    toggleFavorite.mutate({ quoteId });
  };
}
```

### Voting
```tsx
// OLD (broken):
await fetch('/api/votes', { method: 'POST', body: JSON.stringify({ quote_id, vote_type }) })

// NEW:
import { useToggleVote } from '@/lib/hooks';

function MyComponent() {
  const toggleVote = useToggleVote();
  
  const handleUpvote = (quoteId: string) => {
    toggleVote.mutate({ quoteId, voteType: 'upvote' });
  };
}
```

## Migration Status

### ✅ Migrated to tRPC
- Quotes (getRandom, getRecent, getTopRated, getFiltered, getQuiz, search, getById)
- Favorites (getUserFavorites, toggleFavorite)
- Votes (getUserVotes, toggleVote)

### ⚠️ Store Functions (Deprecated)
These functions in `backrollsStore` are kept for backwards compatibility but should no longer be used:
- `loadUserData()` - Use `useFavorites()` and `useVotes()` hooks instead
- `toggleFavorite()` - Use `useToggleFavorite()` hook instead
- `vote()` - Use `useToggleVote()` hook instead

### 🎯 Store Purpose Now
The Zustand store should only manage:
- UI state (filters, modals, loading states)
- Optimistic updates
- Derived/computed values
- Cross-component state synchronization

## Next Steps

### Update Components
Replace any direct store calls with tRPC hooks:

1. **Find components using store.toggleFavorite()** and replace with `useToggleFavorite()`
2. **Find components using store.vote()** and replace with `useToggleVote()`
3. **Find components using store.loadUserData()** and replace with `useFavorites()` and `useVotes()`

### Example Refactor
```tsx
// BEFORE:
const store = useBackrollsStore();
const handleVote = () => {
  store.vote(quoteId, 'upvote');
};

// AFTER:
const toggleVote = useToggleVote();
const handleVote = () => {
  toggleVote.mutate({ quoteId, voteType: 'upvote' });
};
```

## Benefits

1. **Type Safety**: Full TypeScript inference from database to UI
2. **Automatic Refetching**: TanStack Query handles cache invalidation
3. **Optimistic Updates**: Built into tRPC hooks
4. **Error Handling**: Proper error states from mutations
5. **Loading States**: Automatic loading indicators
6. **No Manual Fetch**: No more writing fetch() boilerplate

## Database Schema

Your tables are properly set up:
- `quotes` - stores all quotes with vote_count
- `favorites` - junction table (user_id, quote_id)
- `votes` - junction table (user_id, quote_id, vote_type)

The vote count is calculated by counting upvotes minus downvotes and stored in `quotes.vote_count` for performance.
