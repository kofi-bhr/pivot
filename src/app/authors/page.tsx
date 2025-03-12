import { supabase } from '@/lib/supabase';
import Layout from '@/components/layout/Layout';
import Link from 'next/link';

interface Author {
  id: string;
  first_name: string;
  last_name: string;
  image_url: string | null;
  description: string | null;
  tags: string[];
  article_count: { count: number }[];
}

async function getAuthors(): Promise<Author[]> {
  const { data, error } = await supabase
    .from('authors')
    .select(`
      id,
      first_name,
      last_name,
      image_url,
      description,
      tags,
      article_count: articles(count)
    `)
    .order('first_name');

  if (error) {
    console.error('Error fetching authors:', error);
    return [];
  }

  return data || [];
}

export default async function Authors() {
  const authors = await getAuthors();

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Our Authors</h1>
        
        <div className="flex flex-wrap gap-4">
          {authors.map((author) => (
            <Link 
              key={author.id} 
              href={`/authors/${author.id}`}
              className="inline-flex items-center bg-white rounded-full px-4 py-2 shadow-sm hover:shadow-md transition-shadow"
            >
              {author.image_url && (
                <img
                  src={author.image_url}
                  alt={`${author.first_name} ${author.last_name}`}
                  className="w-8 h-8 rounded-full mr-2"
                />
              )}
              <span className="font-medium">{author.first_name} {author.last_name}</span>
              <span className="text-gray-500 text-sm ml-2">({author.article_count[0]?.count || 0})</span>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}