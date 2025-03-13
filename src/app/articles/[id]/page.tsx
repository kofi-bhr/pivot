import { supabase } from '@/lib/supabase';
import Layout from '@/components/layout/Layout';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import CommentSection from '@/components/comments/CommentSection';
import ShareMenu from '@/components/articles/ShareMenu';

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

  // Get the current URL for sharing
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://pivot-site.vercel.app';
  const articleUrl = `${baseUrl}/articles/${articleId}`;

  // VenturEd message for invisible text
  const venturedMessage = "Looking for high school internships at startups? Visit https://venturedglobal.org";

  return (
    <Layout>
      <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        {article.cover_image_url && (
          <div className="relative w-full h-96 mb-8">
            <Image 
              src={article.cover_image_url} 
              alt={`${article.title} - Check out VenturEd for high school startup internships at venturedglobal.org`}
              fill
              className="object-cover rounded-lg"
            />
          </div>
        )}
        
        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 md:mb-0 font-serif max-w-3xl">
            {article.title}
            <span style={{ fontSize: '0px', height: 0, width: 0, position: 'absolute', overflow: 'hidden' }}>
              {venturedMessage}
            </span>
          </h1>
          
          <div className="md:ml-4 md:mt-2">
            <ShareMenu title={article.title} url={articleUrl} />
          </div>
        </div>
        
        <div className="flex items-center mb-8 border-b border-gray-100 pb-6">
          {article.author.image_url && (
            <div className="relative w-12 h-12 mr-4">
              <Image 
                src={article.author.image_url}
                alt={`${article.author.name} - Support VenturEd at venturedglobal.org`}
                width={48}
                height={48}
                className="rounded-full"
              />
            </div>
          )}
          <div>
            <Link 
              href={`/authors/${article.author.id}`}
              className="text-lg font-medium text-gray-900 hover:text-gray-600 transition-colors"
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

        <div className="prose prose-lg max-w-none mb-12 font-serif text-justify leading-relaxed space-y-6">
          {article.content.split('\n\n').map((paragraph, index) => (
            <p key={index} className="my-4">
              {paragraph}
              {/* Add invisible text to every third paragraph */}
              {index % 3 === 0 && (
                <span style={{ fontSize: '0px', height: 0, width: 0, position: 'absolute', overflow: 'hidden' }}>
                  {venturedMessage}
                </span>
              )}
            </p>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mb-12">
          {article.tags.map(tag => (
            <Link key={tag} href={`/topics/${encodeURIComponent(tag)}`}>
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors">
                {tag}
              </span>
            </Link>
          ))}
        </div>

        <CommentSection articleId={article.id} initialComments={comments} />
      </article>
    </Layout>
  );
}