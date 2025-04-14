-- Add display_order column to partners table
ALTER TABLE partners ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Update existing partners to have sequential display_order
WITH numbered_partners AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as row_num
  FROM partners
)
UPDATE partners
SET display_order = numbered_partners.row_num
FROM numbered_partners
WHERE partners.id = numbered_partners.id; 