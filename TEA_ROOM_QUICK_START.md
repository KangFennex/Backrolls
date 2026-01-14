# Tea Room Quick Start Guide

## For Developers

### Running the Application

1. **Apply Database Migrations**
```bash
# Connect to Supabase database
psql $POSTGRES_URL

# Apply migrations (in order)
\i migrations/001_add_community_tables.sql
\i migrations/002_add_rls_policies.sql
```

2. **Start Development Server**
```bash
pnpm dev
```

3. **Navigate to Tea Room**
- URL: `http://localhost:3000/tea-room`

### Testing Checklist

#### Basic Functionality
- [ ] View Tea Room page
- [ ] See trending communities
- [ ] Click "Create Community" button
- [ ] Fill out community form and submit
- [ ] Join a community
- [ ] Click "Create Post" button
- [ ] Create a text post
- [ ] Create an image post (with URL)
- [ ] Create a link post
- [ ] Vote on posts (up/down)
- [ ] Click on post to view details
- [ ] Add a comment
- [ ] Reply to a comment
- [ ] Vote on comments
- [ ] Edit your own comment
- [ ] Delete your own comment
- [ ] Sort posts (hot/new/top)
- [ ] Test mobile view (sidebar toggle)

#### Advanced Features
- [ ] Create nested comments (test depth limit)
- [ ] Try to leave community as last admin (should fail)
- [ ] Mark post as NSFW/Spoiler
- [ ] Search posts
- [ ] Test pagination
- [ ] Update community settings (as moderator)
- [ ] View community member list
- [ ] Test private community (requires join approval)
- [ ] Test restricted community (read-only for non-members)

### Common Issues & Solutions

#### "Cannot find module '@/app/lib/trpc'"
- Ensure tRPC is properly configured
- Check `app/lib/trpc.ts` exists
- Verify imports in `app/server/index.ts`

#### "Relation does not exist" errors
- Database migrations not applied
- Run migration SQL files
- Check connection string in `.env.local`

#### "Unauthorized" errors
- RLS policies not applied
- Check if user is authenticated
- Verify RLS policies match user session

#### Voting not working
- Check user authentication
- Verify vote toggle logic in mutation
- Check optimistic update implementation

#### Comments not nesting properly
- Verify `parent_comment_id` is being passed
- Check depth limit (max 10 levels)
- Ensure `getCommentReplies` query works

### Environment Variables Required

```env
# .env.local
POSTGRES_URL="postgresql://..."  # Supabase connection string
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="..."
# ... other auth variables
```

### API Routes Structure

All Tea Room endpoints are under the `trpc` router:

```typescript
// Community operations
trpc.community.createCommunity
trpc.community.getCommunity
trpc.community.listCommunities
trpc.community.joinCommunity
trpc.community.leaveCommunity
trpc.community.updateCommunity
trpc.community.getCommunityMembers
trpc.community.getCommunityPosts

// Post operations
trpc.post.createPost
trpc.post.getPost
trpc.post.updatePost
trpc.post.deletePost
trpc.post.votePost
trpc.post.getUserVote
trpc.post.listUserPosts

// Feed operations
trpc.feed.getHomeFeed
trpc.feed.getPopularFeed
trpc.feed.getTrendingCommunities
trpc.feed.searchPosts

// Comment operations
trpc.postComment.createComment
trpc.postComment.getPostComments
trpc.postComment.updateComment
trpc.postComment.deleteComment
trpc.postComment.voteComment
trpc.postComment.getUserCommentVote
trpc.postComment.getCommentReplies
```

## For Users

### Creating a Community

1. Click the sidebar or menu to access Tea Room
2. Click "Create Community" button in sidebar
3. Fill in:
   - **Name**: 4+ characters, unique
   - **Description**: 20+ characters
   - **Privacy**: 
     - Public: Anyone can view and join
     - Private: Invite-only, hidden from non-members
     - Restricted: Anyone can view, only members can post
4. Click "Create Community"
5. You become the admin automatically

### Creating a Post

1. Select a community (or stay on "All Posts")
2. Click "Create Post" button
3. Choose post type:
   - **Text**: Write a text post with title and body
   - **Image**: Share an image via URL
   - **Link**: Share a link with title
4. Optional: Mark as NSFW or Spoiler
5. Click "Post"

### Interacting with Posts

- **Upvote/Downvote**: Click ▲ or ▼ arrows
- **Comment**: Click post title, scroll to comment section
- **Reply**: Click "Reply" under any comment
- **Edit**: Click "Edit" on your own posts/comments
- **Delete**: Click "Delete" on your own posts/comments

### Community Roles

- **Member**: Can post, comment, vote
- **Moderator**: Member + can delete any post/comment, update community settings
- **Admin**: Moderator + can manage roles, last admin can't leave

### Sorting Posts

- **Hot**: Popular posts with recent activity
- **New**: Newest posts first
- **Top**: Highest voted posts

### Mobile Usage

- Tap menu icon (☰) to open sidebar
- Sidebar slides in from right
- All features work the same as desktop
- Swipe or tap X to close sidebar

## Troubleshooting

### Can't create community
- **Error: Name already exists** - Try a different name
- **Error: Description too short** - Needs 20+ characters
- **Not logged in** - Sign in first

### Can't create post
- **Error: Select a community** - Choose a community from dropdown
- **Error: Not a member** - Join the community first
- **Title too long** - Max 300 characters

### Can't comment
- **Not logged in** - Sign in to comment
- **Comment empty** - Write something first
- **Max depth reached** - Can't reply more than 10 levels deep

### Voting not working
- **Not logged in** - Sign in to vote
- **Vote not saving** - Check internet connection
- **Vote count not updating** - Refresh page

## Features at a Glance

### ✅ Working Features
- Community creation and management
- Text, image, and link posts
- Nested comments (10 levels)
- Voting on posts and comments
- Trending communities
- Post sorting (hot/new/top)
- NSFW/Spoiler tags
- Mobile responsive design
- Search functionality
- Pagination
- Optimistic UI updates

### 🚧 Coming Soon
- Community flairs
- User profiles
- Rich text editor
- Image uploads (currently URL-based)
- Notifications
- Pinned posts
- Awards/badges
- User reputation
- Advanced moderation tools

## Support

For issues or questions:
1. Check `TEA_ROOM_IMPLEMENTATION.md` for technical details
2. Review database schema in `app/db/schema.ts`
3. Check API router files in `app/server/routers/`
4. Verify SQL migrations were applied

## Best Practices

### For Community Creators
- Write clear, descriptive community descriptions
- Set appropriate privacy levels
- Be active and engage with members
- Appoint trusted moderators

### For Users
- Follow community guidelines
- Vote quality content up
- Write meaningful comments
- Use NSFW/Spoiler tags appropriately
- Be respectful

### For Developers
- Always validate user input
- Use optimistic updates for better UX
- Handle errors gracefully
- Keep RLS policies up to date
- Test on mobile devices
- Monitor database performance
- Use proper TypeScript types
- Follow existing code patterns
