import { supabase } from '@/lib/supabase';
import Layout from '@/components/layout/Layout';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import CommentSection from '@/components/comments/CommentSection';

interface Author {
  id: string;
  first_name: string;
  last_name: string;
  image_url: string | null;
  name?: string;
}

interface Article {
  id: string;
  title: string;
  content: string;
  cover_image_url: string | null;
  published_at: string | null;
  tags: string[];
  author: Author;
}

interface Comment {
  id: string;
  article_id: string;
  commenter_name: string;
  content: string;
  created_at: string;
}

async function getArticle(id: string): Promise<Article | null> {
  console.log('Fetching article with ID:', id);
  const { data, error } = await supabase
    .from('articles')
    .select(`
      id, title, content, cover_image_url, published_at, tags,
      author:author_id (
        id, first_name, last_name, image_url
      )
    `)
    .eq('id', id)
    .eq('is_visible', true)
    .single();

  if (error) {
    console.error('Error fetching article:', error);
    return null;
  }

  if (!data) {
    console.log('No article found with ID:', id);
    return null;
  }

  console.log('Found article:', data);
  return {
    ...data,
    tags: data.tags || [],
    author: {
      ...data.author,
      name: `${data.author.first_name} ${data.author.last_name}`
    }
  };
}

async function getArticleComments(articleId: string): Promise<Comment[]> {
  console.log('Fetching comments for article ID:', articleId);
  const { data, error } = await supabase
    .from('public_comments')
    .select('*')
    .eq('article_id', articleId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching comments:', error);
    return [];
  }

  console.log('Found comments:', data);
  return data || [];
}

export default async function ArticlePage({ params }: { params: { id: string } }) {
  // Wait for params to be available, then use the ID directly as a string
  const { id } = await params;
  
  // No need to convert to number since we're using UUID strings
  const articleId = id;

  const [article, comments] = await Promise.all([
    getArticle(articleId),
    getArticleComments(articleId)
  ]);

  if (!article) {
    notFound();
  }

  return (
    <Layout>
      <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        {article.cover_image_url && (
          <img 
            src={article.cover_image_url} 
            alt={article.title}
            className="w-full h-96 object-cover rounded-lg mb-8"
          />
        )}
        
        <h1 className="text-4xl font-bold text-gray-900 mb-6">{article.title}</h1>
        
        <div className="flex items-center mb-8">
          {article.author.image_url && (
            <img 
              src={article.author.image_url}
              alt={article.author.name}
              className="w-12 h-12 rounded-full mr-4"
            />
          )}
          <div>
            <Link 
              href={`/authors/${article.author.id}`}
              className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors"
            >
              {article.author.name}
            </Link>
            {article.published_at && (
              <p className="text-sm text-gray-500">
                {new Date(article.published_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            )}
          </div>
        </div>

        <div className="prose prose-lg max-w-none mb-12">
          {article.content}
        </div>

        <div className="flex flex-wrap gap-2 mb-12">
          {article.tags.map(tag => (
            <span key={tag} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
              {tag}
            </span>
          ))}
        </div>

        <CommentSection articleId={article.id} initialComments={comments} />
      </article>
    </Layout>
  );
}