-- Add community_slug column to posts table
ALTER TABLE posts ADD COLUMN community_slug VARCHAR(100);

-- Populate existing posts with their community's slug
UPDATE posts 
SET community_slug = communities.slug
FROM communities 
WHERE posts.community_id = communities.id;

-- Make the column NOT NULL after populating
ALTER TABLE posts ALTER COLUMN community_slug SET NOT NULL;

-- Add index for better query performance
CREATE INDEX posts_community_slug_idx ON posts(community_slug);
