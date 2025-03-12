-- Drop existing schema if it exists
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;

-- Create tables
CREATE TABLE public.authors (
    id SERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    image_url TEXT,
    description TEXT,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.articles (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    cover_image_url TEXT,
    content TEXT,
    published_at TIMESTAMP WITH TIME ZONE,
    is_visible BOOLEAN DEFAULT false,
    tags TEXT[] DEFAULT '{}',
    author_id INTEGER REFERENCES public.authors(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.comments (
    id SERIAL PRIMARY KEY,
    article_id INTEGER REFERENCES public.articles(id),
    commenter_name TEXT NOT NULL,
    content TEXT NOT NULL,
    is_visible BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create view for public comments
CREATE VIEW public.public_comments AS
SELECT 
    id,
    article_id,
    commenter_name,
    content,
    created_at
FROM public.comments
WHERE is_visible = true;
