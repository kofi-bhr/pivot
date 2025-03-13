import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '@/components/layout/Layout';
import React from 'react';

interface Author {
  id: number;
  first_name: string;
  last_name: string;
  image_url: string | null;
  name?: string;
}

interface Article {
  id: number;
  title: string;
  cover_image_url: string | null;
  published_at: string | null;
  content?: string | null;
  tags: string[];
  author: Author;
}

interface ArticleRow {
  id: number;
  title: string;
  cover_image_url: string | null;
  published_at: string | null;
  content: string | null;
  tags: string[] | null;
  author: {
    id: number;
    first_name: string;
    last_name: string;
    image_url: string | null;
  };
}

async function getFeaturedArticles(): Promise<Article[]> {
  console.log('Fetching featured articles');
  const { data, error } = await supabase
    .from('articles')
    .select(`
      id, title, cover_image_url, published_at, content, tags,
      author:author_id (
        id, first_name, last_name, image_url
      )
    `)
    .eq('is_visible', true)
    .not('published_at', 'is', null)
    .order('published_at', { ascending: false })
    .limit(5)
    .returns<ArticleRow[]>();

  if (error) {
    console.error('Error fetching featured articles:', error);
    return [];
  }

  console.log('Found featured articles:', data);
  return (data || []).map(article => ({
    id: article.id,
    title: article.title,
    cover_image_url: article.cover_image_url,
    published_at: article.published_at,
    content: article.content,
    tags: article.tags || [],
    author: {
      id: article.author.id,
      first_name: article.author.first_name,
      last_name: article.author.last_name,
      image_url: article.author.image_url,
      name: `${article.author.first_name} ${article.author.last_name}`
    }
  }));
}

async function getRecentArticles(): Promise<Article[]> {
  console.log('Fetching recent articles');
  const { data, error } = await supabase
    .from('articles')
    .select(`
      id, title, cover_image_url, published_at, content, tags,
      author:author_id (
        id, first_name, last_name, image_url
      )
    `)
    .eq('is_visible', true)
    .not('published_at', 'is', null)
    .order('published_at', { ascending: false })
    .limit(10)
    .returns<ArticleRow[]>();

  if (error) {
    console.error('Error fetching recent articles:', error);
    return [];
  }

  console.log('Found recent articles:', data);
  return (data || []).map(article => ({
    id: article.id,
    title: article.title,
    cover_image_url: article.cover_image_url,
    published_at: article.published_at,
    content: article.content,
    tags: article.tags || [],
    author: {
      id: article.author.id,
      first_name: article.author.first_name,
      last_name: article.author.last_name,
      image_url: article.author.image_url,
      name: `${article.author.first_name} ${article.author.last_name}`
    }
  }));
}

// Helper function to truncate text
function truncateText(text: string | null | undefined, maxLength: number = 150): string {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

// Helper function to get unique authors from articles
function getUniqueAuthors(articles: Article[]): Author[] {
  const uniqueAuthors = new Map<number, Author>();
  
  articles.forEach(article => {
    if (!uniqueAuthors.has(article.author.id)) {
      uniqueAuthors.set(article.author.id, article.author);
    }
  });
  
  return Array.from(uniqueAuthors.values());
}

export default async function Home() {
  const [articles, recentArticles] = await Promise.all([
    getFeaturedArticles(),
    getRecentArticles()
  ]);

  const featuredArticle = articles[0];
  const secondaryArticles = articles.slice(1, 3);
  // const moreArticles = recentArticles.slice(3, 6);

  // Get unique tags from all articles for topic sections
  // const allTags = [...new Set(recentArticles.flatMap(article => article.tags))];
  // const featuredTags = allTags.slice(0, 3);
  
  // Get unique authors for contributors section
  const contributors = getUniqueAuthors([...articles, ...recentArticles]);

  return (
    <Layout>
      <div className="cfr-container py-8">
        <div className="cfr-main-content">
          {/* Main Content Column */}
          <div>
            {/* Featured Articles Section */}
            <section>
              {featuredArticle && (
                <div className="cfr-featured-article">
                  <div className="relative mb-6">
                    {featuredArticle.cover_image_url && (
                      <div className="relative w-full h-[400px]">
                        <Image 
                          src={featuredArticle.cover_image_url} 
                          alt={featuredArticle.title}
                          fill
                          className="object-cover cfr-article-image cfr-featured-image"
                        />
                      </div>
                    )}
                    {featuredArticle.tags && featuredArticle.tags.length > 0 && (
                      <span className="cfr-topic-label absolute top-0 left-0 z-10">{featuredArticle.tags[0]}</span>
                    )}
                  </div>
                  <div className="mb-8">
                    <Link href={`/articles/${featuredArticle.id}`}>
                      <h2 className="cfr-article-title text-2xl mb-3">{featuredArticle.title}</h2>
                    </Link>
                    <p className="text-gray-600 mb-3">
                      {truncateText(featuredArticle.content, 250)}
                      {featuredArticle.content && featuredArticle.content.length > 250 && (
                        <Link href={`/articles/${featuredArticle.id}`}>
                          <span className="font-bold" style={{ color: '#293A4A' }}> READ MORE</span>
                        </Link>
                      )}
                    </p>
                    <div className="cfr-article-meta">
                      <span>Article by </span>
                      <Link 
                        href={`/authors/${featuredArticle.author.id}`}
                        className="cfr-author-link"
                      >
                        {featuredArticle.author.name}
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Secondary Articles Grid */}
              <div className="grid grid-cols-2 gap-8 mb-12">
                {secondaryArticles.map(article => (
                  <div key={article.id} className="cfr-article-card">
                    <div className="relative mb-4">
                      {article.cover_image_url && (
                        <div className="relative w-full h-[200px]">
                          <Image 
                            src={article.cover_image_url} 
                            alt={article.title}
                            fill
                            className="object-cover cfr-article-image cfr-secondary-image"
                          />
                        </div>
                      )}
                      {article.tags && article.tags.length > 0 && (
                        <span className="cfr-topic-label absolute top-0 left-0 z-10">{article.tags[0]}</span>
                      )}
                    </div>
                    <Link href={`/articles/${article.id}`}>
                      <h3 className="cfr-article-title text-xl mb-2">{article.title}</h3>
                    </Link>
                    <p className="text-gray-600 text-sm mb-2">
                      {truncateText(article.content, 120)}
                      {article.content && article.content.length > 120 && (
                        <Link href={`/articles/${article.id}`}>
                          <span className="font-bold" style={{ color: '#293A4A' }}> READ MORE</span>
                        </Link>
                      )}
                    </p>
                    <div className="cfr-article-meta">
                      <span>Article by </span>
                      <Link 
                        href={`/authors/${article.author.id}`}
                        className="cfr-author-link"
                      >
                        {article.author.name}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="cfr-sidebar">
            {/* Recent Articles */}
            <div className="mb-8">
              <h2 className="cfr-section-title mb-4">Recent Articles</h2>
              <div className="space-y-4">
                {recentArticles.slice(0, 3).map(article => (
                  <div key={article.id} className="cfr-sidebar-article pb-4 border-b border-gray-100">
                    <Link href={`/articles/${article.id}`}>
                      <h3 className="cfr-article-title text-base mb-1">{article.title}</h3>
                    </Link>
                    <p className="text-gray-600 text-sm mb-1">
                      {truncateText(article.content, 100)}
                      {article.content && article.content.length > 100 && (
                        <Link href={`/articles/${article.id}`}>
                          <span className="font-bold" style={{ color: '#293A4A' }}> READ MORE</span>
                        </Link>
                      )}
                    </p>
                    <div className="cfr-article-meta text-sm">
                      <span>By </span>
                      <Link 
                        href={`/authors/${article.author.id}`}
                        className="cfr-author-link"
                      >
                        {article.author.name}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contributors Section */}
            <div>
              <h2 className="cfr-section-title mb-4">Contributors</h2>
              <div className="space-y-4">
                {contributors.slice(0, 4).map(author => (
                  <div key={author.id} className="cfr-contributor flex items-center gap-3 pb-3 border-b border-gray-100">
                    <div className="relative flex-shrink-0" style={{ width: '50px', height: '50px' }}>
                      {author.image_url ? (
                        <Image 
                          src={author.image_url} 
                          alt={author.name || `${author.first_name} ${author.last_name}`}
                          width={50}
                          height={50}
                          className="object-cover rounded-full"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-gray-500 text-xl font-medium">
                            {author.first_name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div>
                      <Link href={`/authors/${author.id}`}>
                        <h3 className="cfr-author-name text-base font-medium mb-1">
                          {author.name || `${author.first_name} ${author.last_name}`}
                        </h3>
                      </Link>
                      <p className="text-gray-600 text-sm">
                        Contributor
                      </p>
                    </div>
                  </div>
                ))}
                <div className="pt-2">
                  <Link href="/authors" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                    View all contributors →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}