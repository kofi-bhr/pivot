'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import ArticleCard from '@/components/articles/ArticleCard';
import Layout from '@/components/layout/Layout';
import type { Article, Author } from '@/lib/supabase';

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const ITEMS_PER_PAGE = 12;

  // Function to fetch articles
  async function fetchArticles(isLoadMore = false) {

      console.log('Fetching articles for articles page');
      setLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('articles')
          .select(`
            id, title, cover_image_url, published_at, content, created_at, updated_at, author_id, tags,
            author:author_id (
              id, first_name, last_name, image_url, is_visible
            )
          `)
          .eq('is_visible', true)
          .not('published_at', 'is', null)
          .order('published_at', { ascending: false })
          .range((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE - 1);

        if (error) {
          console.error('Error fetching articles:', error);
          return;
        }

        if (!data || data.length === 0) {
          console.log('No articles found');
          if (!isLoadMore) {
            setArticles([]);
          }
          setHasMore(false);
          return;
        }

        console.log('Found articles:', data);

        // Transform the data to ensure proper typing
        const formattedArticles: Article[] = [];
        
        for (const article of data) {
          // Ensure author is properly structured as a single object, not an array
          const authorData = Array.isArray(article.author) ? article.author[0] : article.author;
          
          // Skip articles with non-visible authors
          if (authorData && authorData.is_visible === false) {
            continue;
          }
          
          formattedArticles.push({
            id: article.id,
            title: article.title,
            cover_image_url: article.cover_image_url || undefined,
            published_at: article.published_at,
            content: article.content || '',
            author_id: article.author_id,
            created_at: article.created_at,
            updated_at: article.updated_at,
            author: authorData as Author,
            tags: Array.isArray(article.tags) ? article.tags : []
          });
        }
        
        setArticles(prev => isLoadMore ? [...prev, ...formattedArticles] : formattedArticles);
        setHasMore(formattedArticles.length === ITEMS_PER_PAGE);
      } catch (error) {
        console.error('Error in articles fetch:', error);
      } finally {
        setLoading(false);
      }
    }

  useEffect(() => {
    fetchArticles(false);

    // Set up real-time subscription
    const subscription = supabase
      .channel('articles-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'articles' 
        }, 
        () => {
          console.log('Articles table changed, refetching data');
          setPage(1); // Reset pagination
          fetchArticles(false);
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

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

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="h-[225px] w-full bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-100 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-100 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">No articles found. Check back soon!</p>
          </div>
        )}

        {articles.length > 0 && hasMore && (
          <div className="mt-12 flex items-center justify-center">
            <button 
              onClick={() => {
                setPage(prev => prev + 1);
                fetchArticles(true);
              }}
              disabled={loading}
              className="rounded-md bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Load More Articles'}
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}