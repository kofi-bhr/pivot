import { supabase } from '@/lib/supabase';
import Layout from '@/components/layout/Layout';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';

interface Author {
  id: string;
  first_name: string;
  last_name: string;
  image_url: string | null;
  description: string | null;
  tags: string[];
}

interface Article {
  id: string;
  title: string;
  cover_image_url: string | null;
  published_at: string | null;
  content?: string;
  tags: string[];
  author: Author;
}

interface AuthorRow {
  id: string;
  first_name: string;
  last_name: string;
  image_url: string | null;
  description: string | null;
  tags: string[] | null;
}

interface ArticleRow {
  id: string;
  title: string;
  cover_image_url: string | null;
  published_at: string | null;
  tags: string[] | null;
  author: {
    id: string;
    first_name: string;
    last_name: string;
    image_url: string | null;
    description: string | null;
    tags: string[] | null;
  };
}

async function getAuthor(id: string): Promise<Author | null> {
  console.log('Fetching author with ID:', id);
  const { data, error } = await supabase
    .from('authors')
    .select('id, first_name, last_name, image_url, description, tags')
    .eq('id', id)
    .single()
    .returns<AuthorRow>();

  if (error) {
    console.error('Error fetching author:', error);
    return null;
  }

  if (!data) {
    console.log('No author found with ID:', id);
    return null;
  }

  console.log('Found author:', data);
  return {
    ...data,
    tags: data.tags || []
  };
}

async function getAuthorArticles(authorId: string): Promise<Article[]> {
  console.log('Fetching articles for author ID:', authorId);
  const { data, error } = await supabase
    .from('articles')
    .select(`
      id, title, cover_image_url, published_at, tags,
      author:author_id (
        id, first_name, last_name, image_url, description, tags
      )
    `)
    .eq('author_id', authorId)
    .eq('is_visible', true)
    .not('published_at', 'is', null)
    .order('published_at', { ascending: false })
    .returns<ArticleRow[]>();

  if (error) {
    console.error('Error fetching author articles:', error);
    return [];
  }

  console.log('Found articles:', data);
  return (data || []).map(article => ({
    id: article.id,
    title: article.title,
    cover_image_url: article.cover_image_url,
    published_at: article.published_at,
    tags: article.tags || [],
    author: {
      id: article.author.id,
      first_name: article.author.first_name,
      last_name: article.author.last_name,
      image_url: article.author.image_url,
      description: article.author.description || null,
      tags: article.author.tags || []
    }
  }));
}

export default async function AuthorPage({ params }: { params: Promise<{ id: string }> }) {
  // Wait for params to be available, then use the ID directly as a string
  const { id } = await params;
  
  // No need to convert to number since we're using UUID strings
  const authorId = id;

  const [author, articles] = await Promise.all([
    getAuthor(authorId),
    getAuthorArticles(authorId)
  ]);

  if (!author) {
    notFound();
  }

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <div className="flex items-center gap-6">
            {author.image_url && (
              <div className="relative w-24 h-24">
                <Image
                  src={author.image_url}
                  alt={`${author.first_name} ${author.last_name}`}
                  width={96}
                  height={96}
                  className="rounded-full"
                />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {author.first_name} {author.last_name}
              </h1>
              {author.description && (
                <p className="mt-2 text-lg text-gray-600">{author.description}</p>
              )}
              {author.tags && author.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {author.tags.map(tag => (
                    <span key={tag} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-6">Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map(article => (
            <div key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {article.cover_image_url && (
                <div className="relative w-full h-48">
                  <Image 
                    src={article.cover_image_url} 
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <Link href={`/articles/${article.id}`} className="hover:text-blue-600 transition-colors">
                  <h3 className="text-xl font-semibold mb-2">{article.title}</h3>
                </Link>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map(tag => (
                    <span key={tag} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}