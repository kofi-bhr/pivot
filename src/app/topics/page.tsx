import { supabase } from '@/lib/supabase';
import Layout from '@/components/layout/Layout';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';

interface Article {
  id: number;
  title: string;
  cover_image_url: string;
  published_at: string;
}

interface Topic {
  id: number;
  name: string;
  description: string;
  article_count: number;
  latest_articles: Article[];
}

async function getTopics(): Promise<Topic[]> {
  const { data: topics, error } = await supabase
    .from('tags')
    .select(`
      *,
      article_count: article_tags(count),
      latest_articles: article_tags(
        articles(
          id,
          title,
          cover_image_url,
          published_at
        )
      )
    `)
    .order('name');

  if (error) {
    console.error('Error fetching topics:', error);
    return [];
  }

  return topics.map((topic: any) => ({
    ...topic,
    latest_articles: topic.latest_articles
      .map((at: { articles: Article }) => at.articles)
      .sort((a: Article, b: Article) => 
        new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
      )
      .slice(0, 3)
  }));
}

export default async function Topics() {
  const topics = await getTopics();

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Topics</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {topics.map((topic) => (
            <div key={topic.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  <Link href={`/topics/${topic.id}`} className="hover:text-blue-600">
                    {topic.name}
                  </Link>
                </h2>
                <p className="text-gray-600 text-sm mb-4">{topic.description}</p>
                <p className="text-sm text-gray-500">{topic.article_count} articles</p>
              </div>

              {topic.latest_articles.length > 0 && (
                <div className="border-t border-gray-100">
                  <div className="p-6">
                    <h3 className="text-sm font-medium text-gray-900 mb-4">Latest Articles</h3>
                    <div className="space-y-4">
                      {topic.latest_articles.map((article) => (
                        <Link
                          key={article.id}
                          href={`/articles/${article.id}`}
                          className="flex items-start gap-4 group"
                        >
                          <div className="relative aspect-[4/3] w-24 flex-shrink-0 overflow-hidden rounded">
                            <Image
                              src={article.cover_image_url || '/placeholder-image.jpg'}
                              alt={article.title}
                              fill
                              className="object-cover transition group-hover:scale-105"
                            />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                              {article.title}
                            </h4>
                            <p className="mt-1 text-xs text-gray-500">
                              {format(new Date(article.published_at), 'MMM d, yyyy')}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
