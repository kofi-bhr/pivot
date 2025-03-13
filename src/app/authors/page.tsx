import { supabase } from '@/lib/supabase';
import Layout from '@/components/layout/Layout';
import Link from 'next/link';
import Image from 'next/image';

interface Author {
  id: string;
  first_name: string;
  last_name: string;
  image_url: string | null;
  description: string | null;
  tags: string[];
  article_count: { count: number }[];
}

// Helper function to truncate text
function truncateText(text: string | null | undefined, maxLength: number = 150): string {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {authors.map((author) => (
            <Link 
              key={author.id} 
              href={`/authors/${author.id}`}
              className="block"
            >
              <div className="bg-white p-6 rounded shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <div className="flex items-center mb-4">
                  {author.image_url ? (
                    <div className="relative w-12 h-12 mr-4">
                      <Image
                        src={author.image_url}
                        alt={`${author.first_name} ${author.last_name}`}
                        width={48}
                        height={48}
                        className="rounded-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-200 mr-4 flex items-center justify-center">
                      <span className="text-gray-500 font-medium">
                        {author.first_name.charAt(0)}{author.last_name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <h2 className="font-medium text-lg">
                      {author.first_name} {author.last_name}
                      <span className="ml-2 text-sm text-gray-500">
                        ({author.article_count[0]?.count || 0})
                      </span>
                    </h2>
                  </div>
                </div>
                
                {author.description && (
                  <p className="text-gray-600">
                    {truncateText(author.description, 120)}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}