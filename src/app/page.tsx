'use client';

import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '@/components/layout/Layout';
import Sidebar from '@/components/layout/Sidebar';
import React, { useState, useEffect } from 'react';

interface Author {
  id: number;
  first_name: string;
  last_name: string;
  image_url: string | null;
  name?: string;
  is_visible: boolean;
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
    is_visible: boolean;
  };
}

async function getFeaturedArticles(): Promise<Article[]> {
  console.log('Fetching featured articles');
  const { data, error } = await supabase
    .from('articles')
    .select(`
      id, title, cover_image_url, published_at, content, tags,
      author:author_id (
        id, first_name, last_name, image_url, is_visible
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
  
  // Filter out articles with non-visible authors
  const filteredArticles = (data || []).filter(article => article.author.is_visible);
  
  return filteredArticles.map(article => ({
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
      is_visible: article.author.is_visible,
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
        id, first_name, last_name, image_url, is_visible
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
  
  // Filter out articles with non-visible authors
  const filteredArticles = (data || []).filter(article => article.author.is_visible);
  
  return filteredArticles.map(article => ({
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
      is_visible: article.author.is_visible,
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

export default function Home() {
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([]);
  const [recentArticles, setRecentArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function loadArticles() {
      try {
        const [featured, recent] = await Promise.all([
          getFeaturedArticles(),
          getRecentArticles()
        ]);
        
        setFeaturedArticles(featured);
        setRecentArticles(recent);
      } catch (error) {
        console.error('Error loading articles:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadArticles();
  }, []);
  
  // Get unique contributors from all articles
  const allArticles = [...featuredArticles, ...recentArticles];
  const contributors = getUniqueAuthors(allArticles);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content Column */}
          <div className="lg:w-3/4">
            {/* Hero Section */}
            <section>
              {loading ? (
                <div className="animate-pulse">
                  <div className="h-64 bg-gray-200 mb-4"></div>
                  <div className="h-8 bg-gray-200 w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-100 w-1/2"></div>
                </div>
              ) : featuredArticles.length > 0 ? (
                <div className="cfr-featured-article">
                  <div className="relative mb-6">
                    {featuredArticles[0].cover_image_url && (
                      <div className="relative w-full cfr-featured-image-container">
                        <Image 
                          src={featuredArticles[0].cover_image_url} 
                          alt={featuredArticles[0].title}
                          fill
                          className="cfr-article-image"
                        />
                      </div>
                    )}
                    {featuredArticles[0].tags && featuredArticles[0].tags.length > 0 && (
                      <span className="cfr-topic-label absolute top-0 left-0 z-10">{featuredArticles[0].tags[0]}</span>
                    )}
                  </div>
                  <div className="mb-8">
                    <Link href={`/articles/${featuredArticles[0].id}`}>
                      <h2 className="cfr-article-title text-2xl mb-3">{featuredArticles[0].title}</h2>
                    </Link>
                    <p className="text-gray-600 mb-3">
                      {truncateText(featuredArticles[0].content, 250)}
                      {featuredArticles[0].content && featuredArticles[0].content.length > 250 && (
                        <Link href={`/articles/${featuredArticles[0].id}`}>
                          <span className="font-bold" style={{ color: '#293A4A' }}> READ MORE</span>
                        </Link>
                      )}
                    </p>
                    <div className="cfr-article-meta">
                      <span>Article by </span>
                      <Link 
                        href={`/authors/${featuredArticles[0].author.id}`}
                        className="cfr-author-link"
                      >
                        {featuredArticles[0].author.name}
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center p-8 bg-gray-50">
                  <p className="text-xl text-gray-500">No featured articles available</p>
                </div>
              )}

              {/* Secondary Articles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {loading ? (
                  [...Array(2)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-40 bg-gray-200 mb-3"></div>
                      <div className="h-6 bg-gray-200 w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-100 w-1/2"></div>
                    </div>
                  ))
                ) : (
                  featuredArticles.slice(1, 3).map(article => (
                    <div key={article.id} className="cfr-article-card">
                      <div className="relative mb-4">
                        {article.cover_image_url && (
                          <div className="relative w-full cfr-secondary-image-container">
                            <Image 
                              src={article.cover_image_url} 
                              alt={article.title}
                              fill
                              className="cfr-article-image"
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
                      <p className="text-gray-600 mb-2">
                        {truncateText(article.content, 120)}
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
                  ))
                )}
              </div>
            </section>

            {/* Recent Articles Section */}
            <section className="mb-12">
              <h2 className="cfr-section-title mb-6">Recent Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                  [...Array(6)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-32 bg-gray-200 mb-3"></div>
                      <div className="h-5 bg-gray-200 w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-100 w-1/2"></div>
                    </div>
                  ))
                ) : (
                  recentArticles.slice(0, 6).map(article => (
                    <div key={article.id} className="cfr-article-card">
                      <div className="relative mb-4">
                        {article.cover_image_url && (
                          <div className="relative w-full cfr-recent-image-container">
                            <Image 
                              src={article.cover_image_url} 
                              alt={article.title}
                              fill
                              className="cfr-article-image"
                            />
                          </div>
                        )}
                      </div>
                      <Link href={`/articles/${article.id}`}>
                        <h3 className="cfr-article-title text-lg mb-2">{article.title}</h3>
                      </Link>
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
                  ))
                )}
              </div>
            </section>

            {/* Contributors Section */}
            <section className="mb-12">
              <h2 className="cfr-section-title mb-6">Our Contributors</h2>
              {loading ? (
                <div className="flex flex-wrap gap-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse flex items-center bg-white p-2">
                      <div className="w-10 h-10 bg-gray-200 mr-2"></div>
                      <div className="h-4 bg-gray-200 w-24"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-4">
                  {contributors.map(author => (
                    <Link 
                      key={author.id}
                      href={`/authors/${author.id}`}
                      className="flex items-center bg-white p-2 hover:shadow-md transition-shadow"
                    >
                      <div className="relative w-10 h-10 mr-2">
                        {author.image_url ? (
                          <Image 
                            src={author.image_url} 
                            alt={author.name || `${author.first_name} ${author.last_name}`}
                            width={40}
                            height={40}
                            className="cfr-author-image"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500 font-medium">
                              {author.first_name.charAt(0)}{author.last_name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      <span className="font-medium">{author.name || `${author.first_name} ${author.last_name}`}</span>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </div>
          
          {/* Sidebar Column */}
          <div className="lg:w-1/4">
            <Sidebar />
          </div>
        </div>
      </div>
    </Layout>
  );
}