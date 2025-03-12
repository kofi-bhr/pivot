import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedDatabase() {
  // Create test authors
  const { data: authors, error: authorError } = await supabase
    .from('authors')
    .upsert([
      {
        first_name: 'John',
        last_name: 'Doe',
        image_url: 'https://api.dicebear.com/7.x/avatars/svg?seed=john',
        description: 'Senior Tech Writer specializing in web technologies',
        tags: ['Technology', 'Web Development', 'JavaScript']
      },
      {
        first_name: 'Jane',
        last_name: 'Smith',
        image_url: 'https://api.dicebear.com/7.x/avatars/svg?seed=jane',
        description: 'AI Researcher focusing on machine learning applications',
        tags: ['AI', 'Machine Learning', 'Python']
      },
      {
        first_name: 'Alex',
        last_name: 'Johnson',
        image_url: 'https://api.dicebear.com/7.x/avatars/svg?seed=alex',
        description: 'Full-stack Developer with expertise in modern web frameworks',
        tags: ['Full Stack', 'React', 'Node.js']
      }
    ])
    .select();

  if (authorError) {
    console.error('Error seeding authors:', authorError);
    return;
  }

  console.log('Authors seeded successfully:', authors);

  // Create test articles
  const { data: articles, error: articleError } = await supabase
    .from('articles')
    .upsert([
      {
        title: 'Getting Started with Next.js 13',
        content: '# Getting Started with Next.js 13\n\nNext.js has revolutionized the way we build React applications...',
        cover_image_url: 'https://picsum.photos/seed/next/800/600',
        is_visible: true,
        tags: ['Next.js', 'React', 'Web Development'],
        author_id: authors![0].id,
        published_at: new Date().toISOString()
      },
      {
        title: 'The Future of AI in 2025',
        content: '# The Future of AI in 2025\n\nArtificial Intelligence continues to evolve at an unprecedented pace...',
        cover_image_url: 'https://picsum.photos/seed/ai/800/600',
        is_visible: true,
        tags: ['AI', 'Technology', 'Future'],
        author_id: authors![1].id,
        published_at: new Date().toISOString()
      },
      {
        title: 'Modern CSS Techniques',
        content: '# Modern CSS Techniques\n\nCSS has evolved significantly over the years...',
        cover_image_url: 'https://picsum.photos/seed/css/800/600',
        is_visible: true,
        tags: ['CSS', 'Web Development', 'Design'],
        author_id: authors![2].id,
        published_at: new Date().toISOString()
      },
      {
        title: 'TypeScript Best Practices',
        content: '# TypeScript Best Practices\n\nTypeScript has become an essential tool for modern web development...',
        cover_image_url: 'https://picsum.photos/seed/typescript/800/600',
        is_visible: true,
        tags: ['TypeScript', 'JavaScript', 'Programming'],
        author_id: authors![0].id,
        published_at: new Date().toISOString()
      },
      {
        title: 'Building Scalable APIs',
        content: '# Building Scalable APIs\n\nWhen building APIs that need to handle millions of requests...',
        cover_image_url: 'https://picsum.photos/seed/api/800/600',
        is_visible: true,
        tags: ['API', 'Backend', 'Architecture'],
        author_id: authors![1].id,
        published_at: new Date().toISOString()
      }
    ])
    .select();

  if (articleError) {
    console.error('Error seeding articles:', articleError);
    return;
  }

  console.log('Articles seeded successfully:', articles);

  // Create test comments
  const { error: commentError } = await supabase
    .from('comments')
    .upsert([
      {
        article_id: articles![0].id,
        commenter_name: 'Reader1',
        content: 'Great article! Very informative.',
        is_visible: true
      },
      {
        article_id: articles![1].id,
        commenter_name: 'Reader2',
        content: 'Thanks for sharing these insights!',
        is_visible: true
      },
      {
        article_id: articles![2].id,
        commenter_name: 'Reader3',
        content: 'Looking forward to more content like this.',
        is_visible: false
      }
    ]);

  if (commentError) {
    console.error('Error seeding comments:', commentError);
    return;
  }

  console.log('Comments seeded successfully');
  console.log('Database seeded successfully!');
}

seedDatabase().catch(console.error);