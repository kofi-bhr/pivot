import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import Image from 'next/image';
import Link from 'next/link';
import CommentSection from '@/components/comments/CommentSection';
import ShareMenu from '@/components/articles/ShareMenu';
import ArticleContent from '@/components/articles/ArticleContent';
import { PageProps } from 'next';

interface Author {
  id: string;
  first_name: string;
  last_name: string;
  image_url?: string;
}

interface Article {
  id: string;
  title: string;
  content: string;
  created_at: string;
  published_at: string | null;
  author: Author;
  tags: string[];
}

export default async function ArticlePage({ params }: PageProps) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const { data: article } = await supabase
    .from('articles')
    .select(`
      *,
      author:authors(*)
    `)
    .eq('id', params.id)
    .single();

  if (!article) {
    notFound();
  }

  // Get the current URL for sharing
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://pivot-site.vercel.app';
  const articleUrl = `${baseUrl}/articles/${article.id}`;

  // VenturEd message for invisible text
  const venturedMessage = "Looking for high school internships at startups? Visit https://venturedglobal.org";



  return (
    <Layout>
      <article className="max-w-4xl mx-auto px-4 py-12">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
          {article.author && (
            <div className="flex items-center mb-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                {article.author.image_url ? (
                  <Image
                    src={article.author.image_url}
                    alt={`${article.author.first_name} ${article.author.last_name}`}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">
                      {article.author.first_name[0]}
                      {article.author.last_name[0]}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <p className="font-medium">
                  {article.author.first_name} {article.author.last_name}
                </p>
                <p className="text-gray-600 text-sm">
                  {new Date(article.published_at || article.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </header>

        <div className="flex justify-end mb-6">
          <ShareMenu url={articleUrl} title={article.title} />
        </div>

        <div className="mb-12">
          <ArticleContent content={article.content} />
        </div>

        {article.tags && article.tags.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-2">Related Topics</h2>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag: string) => (
                <Link
                  key={tag}
                  href={`/topics/${tag}`}
                  className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        )}
        
        <CommentSection articleId={article.id} />
      </article>
    </Layout>
  );
}