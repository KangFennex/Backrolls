-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- For Supabase Security
-- ============================================

-- ENABLE RLS ON ALL TABLES
ALTER TABLE communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comment_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_flairs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- COMMUNITIES POLICIES
-- ============================================

-- Anyone can view public communities
CREATE POLICY "Public communities are viewable by everyone"
ON communities FOR SELECT
USING (privacy = 'public');

-- Members can view private/restricted communities they belong to
CREATE POLICY "Members can view their communities"
ON communities FOR SELECT
USING (
    auth.uid() IN (
        SELECT user_id FROM community_members 
        WHERE community_id = communities.id
    )
);

-- Authenticated users can create communities
CREATE POLICY "Authenticated users can create communities"
ON communities FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL AND creator_id = auth.uid());

-- Admins can update their communities
CREATE POLICY "Admins can update their communities"
ON communities FOR UPDATE
USING (
    auth.uid() IN (
        SELECT user_id FROM community_members 
        WHERE community_id = communities.id 
        AND role = 'admin'
    )
);

-- Only admins can delete communities
CREATE POLICY "Admins can delete communities"
ON communities FOR DELETE
USING (
    auth.uid() IN (
        SELECT user_id FROM community_members 
        WHERE community_id = communities.id 
        AND role = 'admin'
    )
);

-- ============================================
-- COMMUNITY MEMBERS POLICIES
-- ============================================

-- Members can view membership of communities they're in
CREATE POLICY "Members can view community membership"
ON community_members FOR SELECT
USING (
    community_id IN (
        SELECT id FROM communities WHERE privacy = 'public'
    ) OR
    auth.uid() IN (
        SELECT user_id FROM community_members cm
        WHERE cm.community_id = community_members.community_id
    )
);

-- Users can join public communities
CREATE POLICY "Users can join public communities"
ON community_members FOR INSERT
WITH CHECK (
    auth.uid() = user_id AND
    community_id IN (
        SELECT id FROM communities WHERE privacy = 'public'
    )
);

-- Moderators can add members to restricted communities
CREATE POLICY "Moderators can add members"
ON community_members FOR INSERT
WITH CHECK (
    auth.uid() IN (
        SELECT user_id FROM community_members
        WHERE community_id = community_members.community_id
        AND role IN ('moderator', 'admin')
    )
);

-- Users can leave communities (delete their own membership)
CREATE POLICY "Users can leave communities"
ON community_members FOR DELETE
USING (auth.uid() = user_id);

-- Moderators can remove members
CREATE POLICY "Moderators can remove members"
ON community_members FOR DELETE
USING (
    auth.uid() IN (
        SELECT user_id FROM community_members cm
        WHERE cm.community_id = community_members.community_id
        AND cm.role IN ('moderator', 'admin')
    )
);

-- Moderators can update member roles
CREATE POLICY "Moderators can update member roles"
ON community_members FOR UPDATE
USING (
    auth.uid() IN (
        SELECT user_id FROM community_members cm
        WHERE cm.community_id = community_members.community_id
        AND cm.role IN ('moderator', 'admin')
    )
);

-- ============================================
-- POSTS POLICIES
-- ============================================

-- Anyone can view posts in public communities
CREATE POLICY "Public posts are viewable by everyone"
ON posts FOR SELECT
USING (
    community_id IN (
        SELECT id FROM communities WHERE privacy = 'public'
    )
);

-- Members can view posts in their communities
CREATE POLICY "Members can view posts in their communities"
ON posts FOR SELECT
USING (
    auth.uid() IN (
        SELECT user_id FROM community_members
        WHERE community_id = posts.community_id
    )
);

-- Members can create posts in communities they belong to
CREATE POLICY "Members can create posts in joined communities"
ON posts FOR INSERT
WITH CHECK (
    auth.uid() = user_id AND
    community_id IN (
        SELECT community_id FROM community_members 
        WHERE user_id = auth.uid() AND is_banned = FALSE
    )
);

-- Users can update their own posts
CREATE POLICY "Users can update their own posts"
ON posts FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own posts
CREATE POLICY "Users can delete their own posts"
ON posts FOR DELETE
USING (auth.uid() = user_id);

-- Moderators can update any post in their community
CREATE POLICY "Moderators can update posts in their communities"
ON posts FOR UPDATE
USING (
    auth.uid() IN (
        SELECT user_id FROM community_members
        WHERE community_id = posts.community_id
        AND role IN ('moderator', 'admin')
    )
);

-- Moderators can delete posts in their community
CREATE POLICY "Moderators can delete posts in their communities"
ON posts FOR DELETE
USING (
    auth.uid() IN (
        SELECT user_id FROM community_members
        WHERE community_id = posts.community_id
        AND role IN ('moderator', 'admin')
    )
);

-- ============================================
-- POST VOTES POLICIES
-- ============================================

-- Users can view all votes (for checking if they voted)
CREATE POLICY "Users can view post votes"
ON post_votes FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Users can vote on posts in public communities or communities they're in
CREATE POLICY "Users can vote on accessible posts"
ON post_votes FOR INSERT
WITH CHECK (
    auth.uid() = user_id AND
    post_id IN (
        SELECT id FROM posts WHERE
        community_id IN (
            SELECT id FROM communities WHERE privacy = 'public'
        ) OR
        community_id IN (
            SELECT community_id FROM community_members WHERE user_id = auth.uid()
        )
    )
);

-- Users can update their own votes
CREATE POLICY "Users can update their own votes"
ON post_votes FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own votes
CREATE POLICY "Users can delete their own votes"
ON post_votes FOR DELETE
USING (auth.uid() = user_id);

-- ============================================
-- POST COMMENTS POLICIES
-- ============================================

-- Anyone can view comments on public posts
CREATE POLICY "Comments on public posts are viewable"
ON post_comments FOR SELECT
USING (
    post_id IN (
        SELECT id FROM posts WHERE
        community_id IN (
            SELECT id FROM communities WHERE privacy = 'public'
        )
    )
);

-- Members can view comments in their communities
CREATE POLICY "Members can view comments in their communities"
ON post_comments FOR SELECT
USING (
    auth.uid() IN (
        SELECT cm.user_id FROM community_members cm
        JOIN posts p ON p.community_id = cm.community_id
        WHERE p.id = post_comments.post_id
    )
);

-- Members can comment on posts in communities they belong to
CREATE POLICY "Members can comment on posts"
ON post_comments FOR INSERT
WITH CHECK (
    auth.uid() = user_id AND
    post_id IN (
        SELECT p.id FROM posts p
        JOIN community_members cm ON cm.community_id = p.community_id
        WHERE cm.user_id = auth.uid() AND cm.is_banned = FALSE
    )
);

-- Users can update their own comments
CREATE POLICY "Users can update their own comments"
ON post_comments FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own comments
CREATE POLICY "Users can delete their own comments"
ON post_comments FOR DELETE
USING (auth.uid() = user_id);

-- Moderators can update/delete comments in their communities
CREATE POLICY "Moderators can manage comments"
ON post_comments FOR UPDATE
USING (
    auth.uid() IN (
        SELECT cm.user_id FROM community_members cm
        JOIN posts p ON p.community_id = cm.community_id
        WHERE p.id = post_comments.post_id
        AND cm.role IN ('moderator', 'admin')
    )
);

CREATE POLICY "Moderators can delete comments"
ON post_comments FOR DELETE
USING (
    auth.uid() IN (
        SELECT cm.user_id FROM community_members cm
        JOIN posts p ON p.community_id = cm.community_id
        WHERE p.id = post_comments.post_id
        AND cm.role IN ('moderator', 'admin')
    )
);

-- ============================================
-- POST COMMENT VOTES POLICIES
-- ============================================

-- Users can view comment votes
CREATE POLICY "Users can view comment votes"
ON post_comment_votes FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Users can vote on accessible comments
CREATE POLICY "Users can vote on comments"
ON post_comment_votes FOR INSERT
WITH CHECK (
    auth.uid() = user_id AND
    comment_id IN (
        SELECT pc.id FROM post_comments pc
        JOIN posts p ON p.id = pc.post_id
        WHERE p.community_id IN (
            SELECT id FROM communities WHERE privacy = 'public'
        ) OR p.community_id IN (
            SELECT community_id FROM community_members WHERE user_id = auth.uid()
        )
    )
);

-- Users can update their own comment votes
CREATE POLICY "Users can update their comment votes"
ON post_comment_votes FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own comment votes
CREATE POLICY "Users can delete their comment votes"
ON post_comment_votes FOR DELETE
USING (auth.uid() = user_id);

-- ============================================
-- COMMUNITY FLAIRS POLICIES
-- ============================================

-- Anyone can view flairs for public communities
CREATE POLICY "Public community flairs are viewable"
ON community_flairs FOR SELECT
USING (
    community_id IN (
        SELECT id FROM communities WHERE privacy = 'public'
    ) OR
    auth.uid() IN (
        SELECT user_id FROM community_members WHERE community_id = community_flairs.community_id
    )
);

-- Moderators can create flairs
CREATE POLICY "Moderators can create flairs"
ON community_flairs FOR INSERT
WITH CHECK (
    auth.uid() IN (
        SELECT user_id FROM community_members
        WHERE community_id = community_flairs.community_id
        AND role IN ('moderator', 'admin')
    )
);

-- Moderators can update flairs
CREATE POLICY "Moderators can update flairs"
ON community_flairs FOR UPDATE
USING (
    auth.uid() IN (
        SELECT user_id FROM community_members
        WHERE community_id = community_flairs.community_id
        AND role IN ('moderator', 'admin')
    )
);

-- Moderators can delete flairs
CREATE POLICY "Moderators can delete flairs"
ON community_flairs FOR DELETE
USING (
    auth.uid() IN (
        SELECT user_id FROM community_members
        WHERE community_id = community_flairs.community_id
        AND role IN ('moderator', 'admin')
    )
);
