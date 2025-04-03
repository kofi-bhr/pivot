'use client';

import { supabase } from '@/lib/supabase';
import Layout from '@/components/layout/Layout';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface Author {
  id: string;
  first_name: string;
  last_name: string;
  image_url: string | null;
  description: string | null;
  tags: string[];
  article_count: { count: number }[];
  count?: number;
}

// Helper function to truncate text
function truncateText(text: string | null | undefined, maxLength: number = 150): string {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

async function getAuthors(): Promise<Author[]> {
  try {
    // Try to order by display_order first
    let query = supabase
      .from('authors')
      .select(`
        id,
        first_name,
        last_name,
        image_url,
        description,
        tags,
        article_count: articles(count)
      `)
      .eq('is_visible', true);
      
    try {
      const { data, error } = await query.order('display_order', { ascending: true });
      
      if (!error) {
        return data || [];
      }
    } catch (orderError) {
      console.error('Error ordering by display_order, falling back to first_name:', orderError);
    }
    
    // Fallback to ordering by first_name
    const { data, error } = await supabase
      .from('authors')
      .select(`
        id,
        first_name,
        last_name,
        image_url,
        description,
        tags,
        article_count: articles(count)
      `)
      .eq('is_visible', true)
      .order('first_name');

    if (error) {
      console.error('Error fetching authors:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching authors:', error);
    return [];
  }
}

export default function Authors() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAuthors() {
      try {
        const authorsData = await getAuthors();
        setAuthors(authorsData);
      } catch (error) {
        console.error('Error loading authors:', error);
      } finally {
        setLoading(false);
      }
    }

    loadAuthors();
  }, []);

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Our Authors</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            // Loading skeleton
            [...Array(6)].map((_, index) => (
              <div key={index} className="bg-white p-6 rounded shadow-sm border border-gray-100 animate-pulse">
                <div className="flex flex-col items-center mb-6">
                  <div className="w-24 h-24 rounded-full bg-gray-200 mb-4"></div>
                  <div className="text-center">
                    <div className="h-6 bg-gray-200 w-32 mb-2 mx-auto"></div>
                    <div className="h-4 bg-gray-100 w-12 mx-auto"></div>
                  </div>
                </div>
                <div className="h-16 bg-gray-100"></div>
              </div>
            ))
          ) : (
            authors.map((author) => (
              <Link 
                key={author.id} 
                href={`/authors/${author.id}`}
                className="block"
              >
                <div className="bg-white p-6 rounded shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                  <div className="flex flex-col items-center mb-6">
                    {author.image_url ? (
                      <div className="relative w-24 h-24 mb-4 overflow-hidden rounded-full">
                        <Image
                          src={author.image_url}
                          alt={`${author.first_name} ${author.last_name}`}
                          fill
                          sizes="96px"
                          className="object-cover"
                          style={{ borderRadius: '50%' }}
                        />
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gray-200 mb-4 flex items-center justify-center">
                        <span className="text-gray-500 text-xl font-medium">
                          {author.first_name.charAt(0)}{author.last_name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="text-center">
                      <h2 className="font-medium text-lg">
                        {author.first_name} {author.last_name}
                        <span className="ml-2 text-sm text-gray-500">
                          ({author.article_count[0]?.count || 0})
                        </span>
                      </h2>
                    </div>
                  </div>
                  
                  {author.description && (
                    <p className="text-gray-600 text-center">
                      {truncateText(author.description, 120)}
                    </p>
                  )}
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}