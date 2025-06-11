import { createClient } from '@supabase/supabase-js';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing environment variable NEXT_PUBLIC_SUPABASE_URL');
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing environment variable NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: false
    },
    db: {
      schema: 'public'
    }
  }
);

// Initialize database schema and views
export async function initializeDatabase() {
  // Commented out to simplify the application
  // const { error } = await supabase.rpc('create_tag_with_counts_view');
  // if (error) {
  //   console.error('Error creating view:', error);
  // }
  console.log('Database initialization skipped - keeping it simple');
}

// Call initialization
initializeDatabase().catch(console.error);

// Types based on your database schema
export type Author = {
  id: string;
  first_name: string;
  last_name: string;
  image_url?: string;
  description?: string;
  tags?: string[];
  created_at?: string;
  updated_at?: string;
  email?: string;
};

export type Tag = {
  id: number;
  name: string;
  created_at: string;
  article_count?: number;
};

export type Article = {
  id: string;
  title: string;
  content: string;
  cover_image_url?: string;
  is_visible?: boolean;
  author_id: string;
  published_at?: string;
  created_at?: string;
  updated_at?: string;
  author?: Author;
  tags?: string[];
};

export type Brief = {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  summary?: string | null;
  file_url: string;
  department?: string | null;
  author_id: string;
  published?: boolean;
  display_order?: number | null;
  author?: Author;
};

export type Comment = {
  id: string;
  content: string;
  article_id: string;
  commenter_name: string;
  is_visible?: boolean;
  created_at?: string;
  updated_at?: string;
};

// Function to create tag_with_counts view
export async function createTagWithCountsView() {
  // Commented out to simplify the application
  // const { error } = await supabase
  //   .rpc('create_tag_with_counts_view', {
  //     view_sql: `
  //       CREATE OR REPLACE VIEW tag_with_counts AS
  //       SELECT 
  //         t.id,
  //         t.name,
  //         t.created_at,
  //         COUNT(at.article_id) as article_count
  //       FROM tags t
  //       LEFT JOIN article_tags at ON t.id = at.tag_id
  //       LEFT JOIN articles a ON at.article_id = a.id AND a.status = 'published'
  //       GROUP BY t.id, t.name, t.created_at
  //     `
  //   });

  // if (error) {
  //   console.error('Error creating view:', error);
  //   throw error;
  // }
  console.log('Tag counts view creation skipped - keeping it simple');
}