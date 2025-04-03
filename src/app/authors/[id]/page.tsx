'use client';

import { supabase } from '@/lib/supabase';
import Layout from '@/components/layout/Layout';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

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
    .eq('is_visible', true)
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

export default function AuthorPage() {
  const params = useParams();
  const authorId = params.id as string;
  
  const [author, setAuthor] = useState<Author | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFoundError, setNotFoundError] = useState(false);

  useEffect(() => {
    async function loadAuthorData() {
      try {
        const [authorData, articlesData] = await Promise.all([
          getAuthor(authorId),
          getAuthorArticles(authorId)
        ]);

        if (!authorData) {
          setNotFoundError(true);
          return;
        }

        setAuthor(authorData);
        setArticles(articlesData);
      } catch (error) {
        console.error('Error loading author data:', error);
      } finally {
        setLoading(false);
      }
    }

    if (authorId) {
      loadAuthorData();
    }
  }, [authorId]);

  if (notFoundError) {
    notFound();
  }

  if (loading) {
    return (
      <Layout>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-12 animate-pulse">
            <div className="flex flex-col items-center text-center">
              <div className="mb-6">
                <div className="w-48 h-48 bg-gray-200 rounded-full"></div>
              </div>
              <div className="max-w-2xl">
                <div className="h-8 bg-gray-200 w-64 mx-auto mb-4"></div>
                <div className="h-4 bg-gray-100 w-full mx-auto mb-2"></div>
                <div className="h-4 bg-gray-100 w-full mx-auto mb-2"></div>
                <div className="h-4 bg-gray-100 w-3/4 mx-auto"></div>
              </div>
            </div>
          </div>

          <div className="h-8 bg-gray-200 w-48 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-200 w-3/4 mb-2"></div>
                  <div className="flex flex-wrap gap-2">
                    <div className="h-4 bg-gray-100 w-16 rounded"></div>
                    <div className="h-4 bg-gray-100 w-20 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (!author) {
    return null;
  }

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          {/* Author profile with image always on top */}
          <div className="flex flex-col items-center text-center">
            {author.image_url ? (
              <div className="mb-6">
                <div className="relative w-48 h-48 overflow-hidden rounded-full">
                  <Image
                    src={author.image_url}
                    alt={`${author.first_name} ${author.last_name}`}
                    width={192}
                    height={192}
                    className="object-cover"
                    style={{ borderRadius: '50%' }}
                  />
                </div>
              </div>
            ) : (
              <div className="mb-6">
                <div className="w-48 h-48 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-4xl text-gray-500 font-medium">
                    {author.first_name.charAt(0)}{author.last_name.charAt(0)}
                  </span>
                </div>
              </div>
            )}
            <div className="max-w-2xl">
              <h1 className="text-3xl font-bold text-gray-900">
                {author.first_name} {author.last_name}
              </h1>
              {author.description && (
                <p className="mt-4 text-lg text-gray-600">{author.description}</p>
              )}
              {author.tags && author.tags.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2 mt-6">
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
          {articles.length > 0 ? (
            articles.map(article => (
              <div key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden">
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
            ))
          ) : (
            <div className="col-span-3 text-center py-8">
              <p className="text-gray-500">No articles found for this author.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}