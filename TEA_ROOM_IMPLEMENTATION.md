# Tea Room Community Feature - Implementation Summary

## Overview
The Tea Room is a Reddit-like community feature that allows users to create communities, post content, comment, and vote. This document provides a comprehensive overview of the implementation.

## Database Schema

### Tables Created
1. **communities** - Community information and settings
2. **community_members** - User memberships in communities
3. **posts** - User-created posts within communities
4. **post_votes** - Voting system for posts
5. **post_comments** - Comments on posts (supports nesting)
6. **post_comment_votes** - Voting system for comments
7. **community_flairs** - Custom flairs for community members

### Key Features
- Denormalized vote/comment/member counts with automatic triggers
- Soft delete pattern for comments
- Nested comments (up to 10 levels deep)
- Public/Private/Restricted community types
- Role-based permissions (admin, moderator, member)
- NSFW and spoiler flagging
- View count tracking

### Indexes
- Performance indexes on foreign keys
- Composite indexes for common queries (community_id + created_at)
- Unique constraints on memberships and votes

### Security
- Row Level Security (RLS) policies for all tables
- 40+ policies covering CRUD operations
- Community privacy enforcement
- Member-only posting requirements
- Moderator permission checks

## Backend API (tRPC Routers)

### Community Router (`app/server/routers/community.ts`)
- `createCommunity` - Create new community (auto-makes creator admin)
- `getCommunity` - Get community details with member count
- `listCommunities` - List all communities with pagination
- `joinCommunity` - Join a community (duplicate check)
- `leaveCommunity` - Leave a community (prevents last admin)
- `updateCommunity` - Update community settings (mod-only)
- `getCommunityMembers` - List community members
- `getCommunityPosts` - Get posts for a specific community

### Post Router (`app/server/routers/post.ts`)
- `createPost` - Create new post (verifies membership)
- `getPost` - Get single post with all details
- `updatePost` - Update post (author/mod only)
- `deletePost` - Delete post (author/mod only)
- `votePost` - Vote on post (toggle voting)
- `getUserVote` - Get current user's vote on post
- `listUserPosts` - Get all posts by user

### Feed Router (`app/server/routers/feed.ts`)
- `getHomeFeed` - Get posts from subscribed communities
- `getPopularFeed` - Get posts from all communities (r/all equivalent)
- `getTrendingCommunities` - Get trending communities by member count
- `searchPosts` - Full-text search for posts

### Post Comment Router (`app/server/routers/postComment.ts`)
- `createComment` - Create comment or reply (depth limit 10)
- `getPostComments` - Get top-level comments for post
- `updateComment` - Update comment (author only)
- `deleteComment` - Soft delete comment (author/mod)
- `voteComment` - Vote on comment (toggle voting)
- `getUserCommentVote` - Get current user's vote on comment
- `getCommentReplies` - Get replies to a comment (pagination)

## Frontend Components

### Main Pages

#### TeaRoomPageClient (`app/ui/tea-room/TeaRoomPageClient.tsx`)
- Main Tea Room page component
- State management for:
  - Selected community filter
  - Sort options (hot, new, top)
  - Create post modal visibility
  - Mobile sidebar toggle
- Responsive layout with sidebar (desktop) / toggle button (mobile)

#### PostDetailClient (`app/ui/tea-room/components/PostDetailClient.tsx`)
- Full post view with voting
- Post content display (text/image/link types)
- Breadcrumb navigation
- Stats (comments, views)
- Optimistic voting updates
- Comment section integration

#### Post Detail Page (`app/(pages)/tea-room/[id]/page.tsx`)
- Server component wrapper
- Fetches auth session
- Passes user ID to client component

### Feed Components

#### CommunityFeed (`app/ui/tea-room/components/CommunityFeed.tsx`)
- Displays list of posts
- Conditional queries:
  - Community-specific feed (when community selected)
  - Popular feed (when no community selected)
- Pagination with offset
- Loading skeletons
- Empty and error states

#### PostCard (`app/ui/tea-room/components/PostCard.tsx`)
- Individual post card display
- Voting with optimistic updates
- Post metadata (author, date, community)
- Badges (NSFW, spoiler, type)
- Preview text/thumbnail
- Links to post detail and community
- Comment count and view count

#### PostCardSkeleton (`app/ui/tea-room/components/PostCardSkeleton.tsx`)
- Loading skeleton matching PostCard layout
- Shimmer animation effect

### Sidebar Components

#### CommunitySidebar (`app/ui/tea-room/components/CommunitySidebar.tsx`)
- Trending communities list
- My communities list
- Create community button
- Community selection
- Mobile: slides in from right when toggled
- Desktop: fixed sidebar

#### CreateCommunityModal
- Integrated in CommunitySidebar
- Form fields:
  - Name (min 4 characters)
  - Description (min 20 characters)
  - Privacy (public/private/restricted)
- Form validation
- tRPC mutation with error handling

### Post Creation

#### CreatePostModal (`app/ui/tea-room/components/CreatePostModal.tsx`)
- Modal for creating new posts
- Post type selector (text/image/link)
- Conditional fields based on type:
  - Text: body textarea
  - Image: image URL input
  - Link: link URL input
- Community dropdown (if not pre-selected)
- NSFW and Spoiler checkboxes
- Character count (300 max for title)
- Form validation
- Invalidates relevant queries on success

### Comment Components

#### CommentSection (`app/ui/tea-room/components/CommentSection.tsx`)
- Wrapper for comment functionality
- Comment count heading
- Top-level comment form (if logged in)
- Login prompt (if not logged in)
- List of comments
- Empty state

#### CommentForm (`app/ui/tea-room/components/CommentForm.tsx`)
- Reusable comment/reply form
- Textarea with character count (10,000 max)
- Submit and cancel buttons
- Loading state
- Error handling
- Invalidates post comments query on success

#### CommentCard (`app/ui/tea-room/components/CommentCard.tsx`)
- Individual comment display
- Voting system (up/down votes)
- Author and timestamp
- Edit indicator for edited comments
- Actions:
  - Reply (if depth < 10)
  - Edit (if author)
  - Delete (if author/mod)
  - Show/Hide replies
- Inline reply form
- Nested replies with indentation
- Soft delete display ([This comment has been deleted])

## Styling (SCSS)

### Theme Variables
- Dark theme with gradient backgrounds
- Accent pink (#EE5BAC)
- Warm ivory text (#FFFFF0)
- Custom fonts: Atma-Regular, Tektur, Bitcount Prop Single

### Component Styles

#### TeaRoomPageClient.scss
- Main layout with flexbox
- Sidebar + content area
- Mobile responsive (stacks on mobile)
- Modal overlay and content styles
- Form styling (inputs, textareas, selects)
- Button styles (primary, secondary, sizes)
- Loading and error states

#### CommunityFeed.scss
- Feed container with gap
- Empty state styling
- Error message styling
- Pagination controls

#### CommunitySidebar.scss
- Fixed sidebar on desktop
- Slide-in sidebar on mobile
- Community list styles
- Community item hover effects
- Avatar circles with gradients
- Truncated text with ellipsis

#### PostCard.scss
- Card layout with voting sidebar
- Gradient background
- Hover effects
- Vote button states (active/inactive)
- Badge styles (NSFW, spoiler, type)
- Thumbnail display
- Skeleton shimmer animation

#### PostDetailPage.scss
- Breadcrumb navigation
- Post container layout
- Title and meta styling
- Content area (text/image/link)
- Stats display

#### CommentSection.scss
- Comment section container
- Login prompt styling
- Comment form styles
- Comment card layout
- Nested comment indentation (5 levels)
- Vote bar styling
- Action button styles
- Reply form integration

## Features Implemented

### User Features
- ✅ Browse all communities
- ✅ Create new communities
- ✅ Join/leave communities
- ✅ Create posts (text/image/link)
- ✅ View posts with filtering
- ✅ Vote on posts
- ✅ Comment on posts
- ✅ Reply to comments (nested)
- ✅ Vote on comments
- ✅ Edit own posts/comments
- ✅ Delete own posts/comments
- ✅ View trending communities
- ✅ Search posts
- ✅ Sort posts (hot/new/top)
- ✅ NSFW/Spoiler tagging
- ✅ View counts

### Moderator Features
- ✅ Update community settings
- ✅ Delete any post in community
- ✅ Delete any comment in community

### Admin Features
- ✅ All moderator features
- ✅ Promote/demote moderators (via DB)

### Technical Features
- ✅ Optimistic UI updates
- ✅ Loading skeletons
- ✅ Error handling
- ✅ Mobile responsive
- ✅ Dark theme styling
- ✅ Type-safe API (tRPC)
- ✅ Row Level Security
- ✅ Denormalized counts with triggers
- ✅ Pagination
- ✅ Soft deletes
- ✅ Nested comments (10 levels)

## Next Steps / Future Enhancements

### Not Yet Implemented
- Community flairs (table exists, UI needed)
- Moderator management UI
- User profiles with post history
- Image upload (currently URL-based)
- Rich text editor for posts
- Report functionality
- Notification system
- Community rules/guidelines
- Pinned posts
- Community sidebar info
- User karma/reputation
- Award system
- Post scheduling
- Community search
- User blocking

### Testing Required
1. Test all CRUD operations
2. Test voting toggle logic
3. Test nested comment depth limit
4. Test RLS policies
5. Test community privacy settings
6. Test moderator permissions
7. Test mobile responsiveness
8. Test pagination
9. Test search functionality
10. Test error states

### Performance Optimizations
- Implement infinite scroll for feeds
- Add React Query cache invalidation strategies
- Optimize image loading (use Next/Image)
- Add virtual scrolling for long comment threads
- Implement debounced search
- Add service worker for offline support

### Database Migrations
Two SQL migration files have been created:
1. `migrations/001_add_community_tables.sql` - Creates all tables, indexes, and triggers
2. `migrations/002_add_rls_policies.sql` - Creates Row Level Security policies

To apply migrations:
```bash
# Connect to your Supabase database
psql $POSTGRES_URL

# Run migrations
\i migrations/001_add_community_tables.sql
\i migrations/002_add_rls_policies.sql
```

## File Structure

```
app/
├── (pages)/
│   └── tea-room/
│       ├── page.tsx (redirects to main tea room)
│       └── [id]/
│           └── page.tsx (post detail page)
├── server/
│   ├── routers/
│   │   ├── community.ts
│   │   ├── post.ts
│   │   ├── feed.ts
│   │   └── postComment.ts
│   └── index.ts (exports all routers)
├── ui/
│   └── tea-room/
│       ├── TeaRoomPageClient.tsx
│       └── components/
│           ├── CommunityFeed.tsx
│           ├── CommunitySidebar.tsx
│           ├── CreatePostModal.tsx
│           ├── PostCard.tsx
│           ├── PostCardSkeleton.tsx
│           ├── PostDetailClient.tsx
│           ├── CommentSection.tsx
│           ├── CommentForm.tsx
│           └── CommentCard.tsx
└── scss/
    └── pages/
        └── tea-room/
            ├── TeaRoomPageClient.scss
            ├── CommunityFeed.scss
            ├── CommunitySidebar.scss
            ├── PostCard.scss
            ├── PostDetailPage.scss
            └── CommentSection.scss

migrations/
├── 001_add_community_tables.sql
└── 002_add_rls_policies.sql
```

## Usage Examples

### Creating a Community
```typescript
const createCommunity = trpc.community.createCommunity.useMutation();

createCommunity.mutate({
  name: 'gaming',
  description: 'A community for gamers',
  privacy: 'public'
});
```

### Creating a Post
```typescript
const createPost = trpc.post.createPost.useMutation();

createPost.mutate({
  communityId: 'abc123',
  title: 'Check out this cool game',
  body: 'I just found this amazing indie game...',
  postType: 'text',
  isNsfw: false,
  isSpoiler: false
});
```

### Voting on a Post
```typescript
const votePost = trpc.post.votePost.useMutation();

votePost.mutate({
  postId: 'post123',
  voteType: 'up'  // or 'down'
});
// Voting again with same type removes the vote
```

### Creating a Comment
```typescript
const createComment = trpc.postComment.createComment.useMutation();

createComment.mutate({
  postId: 'post123',
  body: 'Great post!',
  parentCommentId: undefined  // or 'comment123' for replies
});
```

## Known Issues

### Resolved
- ✅ Drizzle migration self-reference errors (switched to SQL)
- ✅ Environment variable mismatches (fixed drizzle.config.ts)
- ✅ Schema typos and syntax errors
- ✅ Router compilation errors

### Current
- ⚠️ Image components using `<img>` instead of Next.js `<Image />` (works but not optimized)
- ⚠️ No image upload functionality (URL-based only)
- ⚠️ No real-time updates (would need WebSockets or polling)

## Conclusion

The Tea Room community feature is a fully functional Reddit-like system with:
- Complete backend API (26 procedures across 4 routers)
- Comprehensive UI components (13 components)
- Full styling matching the app's dark theme
- Mobile-responsive design
- Type-safe with TypeScript and tRPC
- Secure with RLS policies
- Optimistic UI updates for better UX

The foundation is solid and ready for testing and deployment. Future enhancements can build on this base to add more advanced features.
