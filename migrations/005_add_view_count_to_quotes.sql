-- Add view_count column to quotes table
ALTER TABLE quotes ADD COLUMN view_count BIGINT DEFAULT 0 NOT NULL;

-- Add index for sorting by views (optional but recommended)
CREATE INDEX quotes_view_count_idx ON quotes(view_count DESC);
