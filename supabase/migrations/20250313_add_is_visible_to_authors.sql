-- Add is_visible column to authors table
ALTER TABLE public.authors ADD COLUMN is_visible BOOLEAN DEFAULT true;

-- Update existing authors to be visible by default
UPDATE public.authors SET is_visible = true WHERE is_visible IS NULL;
