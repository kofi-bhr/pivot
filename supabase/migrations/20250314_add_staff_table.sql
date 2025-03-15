-- Add staff table
CREATE TABLE public.staff (
    id SERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    title TEXT NOT NULL,                -- Job title/position
    department TEXT,                    -- Flexible department field (admin, marketing, editing, etc.)
    image_url TEXT,                     -- Profile photo
    bio TEXT,                           -- Brief biography
    contact_email TEXT,                 -- Contact information
    linkedin_url TEXT,                  -- Optional LinkedIn profile
    personal_site_url TEXT,             -- Optional personal website
    is_visible BOOLEAN DEFAULT true,    -- Control visibility
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add index on department to make filtering faster if needed
CREATE INDEX idx_staff_department ON public.staff(department);
