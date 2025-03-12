import { supabase } from '@/lib/supabase';
import ArticleCard from '@/components/articles/ArticleCard';
import Layout from '@/components/layout/Layout';

// Define our own article type to avoid conflicts with imported types
interface ArticleData {
  id: string;
  title: string;
  cover_image_url: string | null;
  published_at: string | null;
  content?: string;
  author_id: string;
  created_at: string;
  updated_at: string;
  authors?: {
    id: string;
    first_name: string;
    last_name: string;
    image_url?: string;
  }[];
  tags: string[];
}

async function getArticles(): Promise<ArticleData[]> {
  console.log('Fetching articles for articles page');
  
  // Query the articles table with the correct structure - using the same structure as the homepage
  const { data, error } = await supabase
    .from('articles')
    .select(`
      id, title, cover_image_url, published_at, content, created_at, updated_at, author_id, tags,
      author:author_id (
        id, first_name, last_name, image_url
      )
    `)
    .eq('is_visible', true)
    .not('published_at', 'is', null)
    .order('published_at', { ascending: false })
    .limit(12);

  if (error) {
    console.error('Error fetching articles:', error);
    return [];
  }

  if (!data || data.length === 0) {
    console.log('No articles found');
    return [];
  }

  console.log('Found articles:', data);

  // Transform the data to match the structure expected by ArticleCard
  return data.map((article: any) => ({
    id: article.id,
    title: article.title,
    cover_image_url: article.cover_image_url,
    published_at: article.published_at,
    content: article.content,
    author_id: article.author_id,
    created_at: article.created_at,
    updated_at: article.updated_at,
    // The ArticleCard component expects authors as an array
    authors: article.author ? [article.author] : [],
    // Ensure tags is an array
    tags: Array.isArray(article.tags) ? article.tags : []
  }));
}

export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-900">All Articles</h1>
          <div className="flex items-center gap-4">
            <select className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Most Recent</option>
              <option>Most Popular</option>
            </select>
          </div>
        </div>

        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article as any} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">No articles found. Check back soon!</p>
          </div>
        )}

        {articles.length > 0 && (
          <div className="mt-12 flex items-center justify-center">
            <button className="rounded-md bg-blue-600 px-6 py-3 text-white hover:bg-blue-700">
              Load More Articles
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
} 