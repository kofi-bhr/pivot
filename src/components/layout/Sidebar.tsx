'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface Article {
  id: string;
  title: string;
  cover_image_url: string | null;
  published_at: string | null;
}

export default function Sidebar() {
  const [recentArticles, setRecentArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecentArticles() {
      try {
        const { data, error } = await supabase
          .from('articles')
          .select('id, title, cover_image_url, published_at')
          .eq('is_visible', true)
          .order('published_at', { ascending: false })
          .limit(5);
          
        if (error) throw error;
        
        setRecentArticles(data || []);
      } catch (error) {
        console.error('Error fetching recent articles for sidebar:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchRecentArticles();
  }, []);

  if (loading) {
    return (
      <div className="cfr-sidebar">
        <h2 className="cfr-section-title">Recent Articles</h2>
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="cfr-sidebar-article">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-100 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="cfr-sidebar">
      <h2 className="cfr-section-title">Recent Articles</h2>
      {recentArticles.length === 0 ? (
        <p className="text-gray-500 text-sm">No recent articles to display.</p>
      ) : (
        <div className="space-y-4">
          {recentArticles.map(article => (
            <div key={article.id} className="cfr-sidebar-article">
              <Link href={`/articles/${article.id}`}>
                <h3 className="text-base font-medium hover:text-blue-600 transition-colors mb-1">
                  {article.title}
                </h3>
              </Link>
              {article.published_at && (
                <p className="text-xs text-gray-500">
                  {new Date(article.published_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
