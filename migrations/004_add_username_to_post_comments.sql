-- ============================================
-- ADD USERNAME TO POST_COMMENTS (if not exists)
-- ============================================

-- Add username column to post_comments for denormalized performance
ALTER TABLE post_comments 
ADD COLUMN IF NOT EXISTS username VARCHAR(100);

-- Update existing comments with username from profiles
UPDATE post_comments pc
SET username = p.username
FROM profiles p
WHERE pc.user_id = p.id
AND pc.username IS NULL;

-- Create index for faster username lookups
CREATE INDEX IF NOT EXISTS idx_post_comments_username ON post_comments(username);
