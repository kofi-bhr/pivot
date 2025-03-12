-- Begin transaction
BEGIN;

-- Add tags array column to authors table if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'authors' AND column_name = 'tags') THEN
        ALTER TABLE authors ADD COLUMN tags TEXT[] DEFAULT '{}';
    END IF;
END $$;

-- Add tags array column to articles table if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'articles' AND column_name = 'tags') THEN
        ALTER TABLE articles ADD COLUMN tags TEXT[] DEFAULT '{}';
    END IF;
END $$;

-- Create index for tags array columns for better performance
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_authors_tags') THEN
        CREATE INDEX idx_authors_tags ON authors USING GIN (tags);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_articles_tags') THEN
        CREATE INDEX idx_articles_tags ON articles USING GIN (tags);
    END IF;
END $$;

-- Update RLS policies
DO $$ 
BEGIN 
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Public can view tags" ON authors;
    DROP POLICY IF EXISTS "Authenticated can update tags" ON authors;
    DROP POLICY IF EXISTS "Public can view article tags" ON articles;
    DROP POLICY IF EXISTS "Authenticated can update article tags" ON articles;
    
    -- Create new policies
    CREATE POLICY "Public can view tags" ON authors FOR SELECT USING (true);
    CREATE POLICY "Authenticated can update tags" ON authors FOR UPDATE TO authenticated USING (true);
    CREATE POLICY "Public can view article tags" ON articles FOR SELECT USING (status = 'published');
    CREATE POLICY "Authenticated can update article tags" ON articles FOR UPDATE TO authenticated USING (true);
END $$;

-- Add NOT NULL constraint to article author relationship if it doesn't exist
DO $$ 
BEGIN 
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'articles' 
        AND column_name = 'author_id' 
        AND is_nullable = 'YES'
    ) THEN
        -- First ensure no NULL values exist
        UPDATE articles SET author_id = (
            SELECT id FROM authors ORDER BY created_at LIMIT 1
        ) WHERE author_id IS NULL;
        
        ALTER TABLE articles ALTER COLUMN author_id SET NOT NULL;
    END IF;
END $$;

-- Create function to validate at least one author if it doesn't exist
CREATE OR REPLACE FUNCTION check_article_author()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.author_id IS NULL THEN
        RAISE EXCEPTION 'Article must have at least one author';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to enforce author validation if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.triggers 
        WHERE trigger_name = 'enforce_article_author'
    ) THEN
        CREATE TRIGGER enforce_article_author
            BEFORE INSERT OR UPDATE ON articles
            FOR EACH ROW
            EXECUTE FUNCTION check_article_author();
    END IF;
END $$;

-- Create helper function for tag operations
CREATE OR REPLACE FUNCTION array_distinct(anyarray)
RETURNS anyarray AS $$
  SELECT array_agg(DISTINCT x) FROM unnest($1) t(x);
$$ LANGUAGE SQL IMMUTABLE;

-- Create trigger function to ensure tags are unique
CREATE OR REPLACE FUNCTION normalize_tags()
RETURNS TRIGGER AS $$
BEGIN
    -- Convert tags to lowercase and remove duplicates
    NEW.tags = array_distinct(ARRAY(
        SELECT LOWER(trim(tag))
        FROM unnest(NEW.tags) AS tag
        WHERE trim(tag) <> ''
    ));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for tag normalization if they don't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.triggers 
        WHERE trigger_name = 'normalize_article_tags'
    ) THEN
        CREATE TRIGGER normalize_article_tags
            BEFORE INSERT OR UPDATE ON articles
            FOR EACH ROW
            EXECUTE FUNCTION normalize_tags();
    END IF;

    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.triggers 
        WHERE trigger_name = 'normalize_author_tags'
    ) THEN
        CREATE TRIGGER normalize_author_tags
            BEFORE INSERT OR UPDATE ON authors
            FOR EACH ROW
            EXECUTE FUNCTION normalize_tags();
    END IF;
END $$;

COMMIT;
