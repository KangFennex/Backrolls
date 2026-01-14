-- ============================================
-- COMMUNITIES FEATURE - SCHEMA MIGRATION
-- ============================================

-- 1. COMMUNITIES TABLE
CREATE TABLE IF NOT EXISTS communities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    info_content TEXT,
    icon_url TEXT,
    banner_url TEXT,
    creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
    privacy TEXT DEFAULT 'public' NOT NULL CHECK (privacy IN ('public', 'private', 'restricted')),
    allow_text_posts BOOLEAN DEFAULT TRUE NOT NULL,
    allow_link_posts BOOLEAN DEFAULT TRUE NOT NULL,
    allow_image_posts BOOLEAN DEFAULT TRUE NOT NULL,
    allow_video_posts BOOLEAN DEFAULT TRUE NOT NULL,
    require_post_approval BOOLEAN DEFAULT FALSE NOT NULL,
    member_count BIGINT DEFAULT 0 NOT NULL,
    post_count BIGINT DEFAULT 0 NOT NULL,
    is_archived BOOLEAN DEFAULT FALSE NOT NULL,
    archived_at TIMESTAMP
);

-- 2. COMMUNITY MEMBERS TABLE
CREATE TABLE IF NOT EXISTS community_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member' NOT NULL CHECK (role IN ('member', 'moderator', 'admin')),
    joined_at TIMESTAMP DEFAULT NOW() NOT NULL,
    notifications_enabled BOOLEAN DEFAULT TRUE NOT NULL,
    show_in_feed BOOLEAN DEFAULT TRUE NOT NULL,
    is_banned BOOLEAN DEFAULT FALSE NOT NULL,
    banned_at TIMESTAMP,
    banned_by UUID,
    ban_reason TEXT,
    UNIQUE(community_id, user_id)
);

-- 3. POSTS TABLE
CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    title VARCHAR(300) NOT NULL,
    body TEXT,
    post_type TEXT NOT NULL CHECK (post_type IN ('text', 'link', 'image', 'video')),
    url TEXT,
    thumbnail_url TEXT,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
    edited_at TIMESTAMP,
    vote_count BIGINT DEFAULT 0 NOT NULL,
    upvote_count BIGINT DEFAULT 0 NOT NULL,
    downvote_count BIGINT DEFAULT 0 NOT NULL,
    comment_count BIGINT DEFAULT 0 NOT NULL,
    view_count BIGINT DEFAULT 0 NOT NULL,
    hot_score BIGINT DEFAULT 0 NOT NULL,
    controversy_score BIGINT DEFAULT 0 NOT NULL,
    is_pinned BOOLEAN DEFAULT FALSE NOT NULL,
    is_locked BOOLEAN DEFAULT FALSE NOT NULL,
    is_archived BOOLEAN DEFAULT FALSE NOT NULL,
    is_removed BOOLEAN DEFAULT FALSE NOT NULL,
    removed_at TIMESTAMP,
    removed_by UUID,
    removal_reason TEXT,
    is_nsfw BOOLEAN DEFAULT FALSE NOT NULL,
    is_spoiler BOOLEAN DEFAULT FALSE NOT NULL,
    flair_id UUID,
    flair_text VARCHAR(64)
);

-- 4. POST VOTES TABLE
CREATE TABLE IF NOT EXISTS post_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    vote_type TEXT NOT NULL CHECK (vote_type IN ('up', 'down')),
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
    UNIQUE(user_id, post_id)
);

-- 5. POST COMMENTS TABLE
CREATE TABLE IF NOT EXISTS post_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    parent_comment_id UUID REFERENCES post_comments(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    comment_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
    edited_at TIMESTAMP,
    is_edited BOOLEAN DEFAULT FALSE NOT NULL,
    vote_count BIGINT DEFAULT 0 NOT NULL,
    upvote_count BIGINT DEFAULT 0 NOT NULL,
    downvote_count BIGINT DEFAULT 0 NOT NULL,
    reply_count BIGINT DEFAULT 0 NOT NULL,
    depth BIGINT DEFAULT 0 NOT NULL,
    is_removed BOOLEAN DEFAULT FALSE NOT NULL,
    removed_at TIMESTAMP,
    removed_by UUID,
    removal_reason TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'deleted', 'removed'))
);

-- 6. POST COMMENT VOTES TABLE
CREATE TABLE IF NOT EXISTS post_comment_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    comment_id UUID NOT NULL REFERENCES post_comments(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    vote_type TEXT NOT NULL CHECK (vote_type IN ('up', 'down')),
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
    UNIQUE(user_id, comment_id)
);

-- 7. COMMUNITY FLAIRS TABLE (OPTIONAL)
CREATE TABLE IF NOT EXISTS community_flairs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
    text VARCHAR(64) NOT NULL,
    background_color VARCHAR(7),
    text_color VARCHAR(7),
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    UNIQUE(community_id, text)
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Communities indexes
CREATE INDEX IF NOT EXISTS idx_communities_slug ON communities(slug);
CREATE INDEX IF NOT EXISTS idx_communities_creator_id ON communities(creator_id);
CREATE INDEX IF NOT EXISTS idx_communities_privacy ON communities(privacy);

-- Community members indexes
CREATE INDEX IF NOT EXISTS idx_community_members_community_id ON community_members(community_id);
CREATE INDEX IF NOT EXISTS idx_community_members_user_id ON community_members(user_id);
CREATE INDEX IF NOT EXISTS idx_community_members_role ON community_members(community_id, role);

-- Posts indexes
CREATE INDEX IF NOT EXISTS idx_posts_community_id ON posts(community_id);
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_hot_score ON posts(hot_score DESC);
CREATE INDEX IF NOT EXISTS idx_posts_vote_count ON posts(vote_count DESC);
CREATE INDEX IF NOT EXISTS idx_posts_community_hot ON posts(community_id, hot_score DESC);
CREATE INDEX IF NOT EXISTS idx_posts_community_new ON posts(community_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_type ON posts(post_type);

-- Post votes indexes
CREATE INDEX IF NOT EXISTS idx_post_votes_post_id ON post_votes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_votes_user_id ON post_votes(user_id);

-- Post comments indexes
CREATE INDEX IF NOT EXISTS idx_post_comments_post_id ON post_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_parent_id ON post_comments(parent_comment_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_user_id ON post_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_created_at ON post_comments(created_at DESC);

-- Post comment votes indexes
CREATE INDEX IF NOT EXISTS idx_post_comment_votes_comment_id ON post_comment_votes(comment_id);
CREATE INDEX IF NOT EXISTS idx_post_comment_votes_user_id ON post_comment_votes(user_id);

-- Community flairs indexes
CREATE INDEX IF NOT EXISTS idx_community_flairs_community_id ON community_flairs(community_id);

-- ============================================
-- DATABASE TRIGGERS FOR DENORMALIZED COUNTS
-- ============================================

-- Update community member_count
CREATE OR REPLACE FUNCTION update_community_member_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE communities 
        SET member_count = member_count + 1 
        WHERE id = NEW.community_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE communities 
        SET member_count = member_count - 1 
        WHERE id = OLD.community_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_community_member_count
AFTER INSERT OR DELETE ON community_members
FOR EACH ROW EXECUTE FUNCTION update_community_member_count();

-- Update community post_count
CREATE OR REPLACE FUNCTION update_community_post_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE communities 
        SET post_count = post_count + 1 
        WHERE id = NEW.community_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE communities 
        SET post_count = post_count - 1 
        WHERE id = OLD.community_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_community_post_count
AFTER INSERT OR DELETE ON posts
FOR EACH ROW EXECUTE FUNCTION update_community_post_count();

-- Update post vote_count and upvote/downvote counts
CREATE OR REPLACE FUNCTION update_post_vote_counts()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF NEW.vote_type = 'up' THEN
            UPDATE posts 
            SET vote_count = vote_count + 1, 
                upvote_count = upvote_count + 1 
            WHERE id = NEW.post_id;
        ELSE
            UPDATE posts 
            SET vote_count = vote_count - 1, 
                downvote_count = downvote_count + 1 
            WHERE id = NEW.post_id;
        END IF;
    ELSIF TG_OP = 'DELETE' THEN
        IF OLD.vote_type = 'up' THEN
            UPDATE posts 
            SET vote_count = vote_count - 1, 
                upvote_count = upvote_count - 1 
            WHERE id = OLD.post_id;
        ELSE
            UPDATE posts 
            SET vote_count = vote_count + 1, 
                downvote_count = downvote_count - 1 
            WHERE id = OLD.post_id;
        END IF;
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.vote_type = 'up' AND NEW.vote_type = 'down' THEN
            UPDATE posts 
            SET vote_count = vote_count - 2, 
                upvote_count = upvote_count - 1, 
                downvote_count = downvote_count + 1 
            WHERE id = NEW.post_id;
        ELSIF OLD.vote_type = 'down' AND NEW.vote_type = 'up' THEN
            UPDATE posts 
            SET vote_count = vote_count + 2, 
                upvote_count = upvote_count + 1, 
                downvote_count = downvote_count - 1 
            WHERE id = NEW.post_id;
        END IF;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_post_vote_counts
AFTER INSERT OR UPDATE OR DELETE ON post_votes
FOR EACH ROW EXECUTE FUNCTION update_post_vote_counts();

-- Update post comment_count
CREATE OR REPLACE FUNCTION update_post_comment_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE posts 
        SET comment_count = comment_count + 1 
        WHERE id = NEW.post_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE posts 
        SET comment_count = comment_count - 1 
        WHERE id = OLD.post_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_post_comment_count
AFTER INSERT OR DELETE ON post_comments
FOR EACH ROW EXECUTE FUNCTION update_post_comment_count();

-- Update comment vote_count
CREATE OR REPLACE FUNCTION update_comment_vote_counts()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF NEW.vote_type = 'up' THEN
            UPDATE post_comments 
            SET vote_count = vote_count + 1, 
                upvote_count = upvote_count + 1 
            WHERE id = NEW.comment_id;
        ELSE
            UPDATE post_comments 
            SET vote_count = vote_count - 1, 
                downvote_count = downvote_count + 1 
            WHERE id = NEW.comment_id;
        END IF;
    ELSIF TG_OP = 'DELETE' THEN
        IF OLD.vote_type = 'up' THEN
            UPDATE post_comments 
            SET vote_count = vote_count - 1, 
                upvote_count = upvote_count - 1 
            WHERE id = OLD.comment_id;
        ELSE
            UPDATE post_comments 
            SET vote_count = vote_count + 1, 
                downvote_count = downvote_count - 1 
            WHERE id = OLD.comment_id;
        END IF;
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.vote_type = 'up' AND NEW.vote_type = 'down' THEN
            UPDATE post_comments 
            SET vote_count = vote_count - 2, 
                upvote_count = upvote_count - 1, 
                downvote_count = downvote_count + 1 
            WHERE id = NEW.comment_id;
        ELSIF OLD.vote_type = 'down' AND NEW.vote_type = 'up' THEN
            UPDATE post_comments 
            SET vote_count = vote_count + 2, 
                upvote_count = upvote_count + 1, 
                downvote_count = downvote_count - 1 
            WHERE id = NEW.comment_id;
        END IF;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_comment_vote_counts
AFTER INSERT OR UPDATE OR DELETE ON post_comment_votes
FOR EACH ROW EXECUTE FUNCTION update_comment_vote_counts();

-- Update comment reply_count
CREATE OR REPLACE FUNCTION update_comment_reply_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.parent_comment_id IS NOT NULL THEN
        UPDATE post_comments 
        SET reply_count = reply_count + 1 
        WHERE id = NEW.parent_comment_id;
    ELSIF TG_OP = 'DELETE' AND OLD.parent_comment_id IS NOT NULL THEN
        UPDATE post_comments 
        SET reply_count = reply_count - 1 
        WHERE id = OLD.parent_comment_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_comment_reply_count
AFTER INSERT OR DELETE ON post_comments
FOR EACH ROW EXECUTE FUNCTION update_comment_reply_count();

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_communities_updated_at
BEFORE UPDATE ON communities
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_posts_updated_at
BEFORE UPDATE ON posts
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_post_comments_updated_at
BEFORE UPDATE ON post_comments
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
