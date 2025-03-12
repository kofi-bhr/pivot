-- Drop existing view if it exists
DROP VIEW IF EXISTS tag_with_counts;

-- Create the tag_with_counts view
CREATE OR REPLACE VIEW tag_with_counts AS
SELECT 
    t.id,
    t.name,
    t.created_at,
    COUNT(DISTINCT CASE WHEN a.status = 'published' THEN at.article_id END) as article_count
FROM tags t
LEFT JOIN article_tags at ON t.id = at.tag_id
LEFT JOIN articles a ON at.article_id = a.id
GROUP BY t.id, t.name, t.created_at;

-- Enable RLS for the view
ALTER VIEW tag_with_counts SECURITY DEFINER;
GRANT SELECT ON tag_with_counts TO anon, authenticated;
