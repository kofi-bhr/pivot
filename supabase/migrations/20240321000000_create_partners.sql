-- Create partners table
CREATE TABLE partners (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    logo_url TEXT NOT NULL,
    website_url TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create RLS policies
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" ON partners
    FOR SELECT
    USING (true);

-- Allow admin write access
CREATE POLICY "Allow admin write access" ON partners
    FOR ALL
    USING (auth.role() = 'authenticated' AND auth.uid() IN (
        SELECT user_id FROM user_roles WHERE role = 'admin'
    ));

-- Create updated_at trigger
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON partners
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at(); 