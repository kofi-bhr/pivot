-- Add display_order column to staff table
ALTER TABLE public.staff ADD COLUMN display_order INTEGER DEFAULT 9999;

-- Set initial display_order based on last_name for existing staff members
UPDATE public.staff 
SET display_order = subquery.row_num 
FROM (
  SELECT id, ROW_NUMBER() OVER (ORDER BY last_name, first_name) as row_num 
  FROM public.staff
) as subquery
WHERE staff.id = subquery.id;

-- Create index on display_order to make sorting faster
CREATE INDEX idx_staff_display_order ON public.staff(display_order);
