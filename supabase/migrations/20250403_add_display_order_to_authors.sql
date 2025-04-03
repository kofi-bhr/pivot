-- Add display_order column to authors table
ALTER TABLE public.authors ADD COLUMN display_order INTEGER DEFAULT 9999;

-- Set initial display_order based on first_name for existing authors
UPDATE public.authors 
SET display_order = subquery.row_num 
FROM (
  SELECT id, ROW_NUMBER() OVER (ORDER BY first_name, last_name) as row_num 
  FROM public.authors
) as subquery
WHERE authors.id = subquery.id;

-- Create index on display_order to make sorting faster
CREATE INDEX idx_authors_display_order ON public.authors(display_order);
