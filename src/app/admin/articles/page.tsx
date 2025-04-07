'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface Author {
  id: string;
  first_name: string;
  last_name: string;
  image_url: string | null;
}

interface Article {
  id: string;
  title: string;
  published_at: string | null;
  is_visible: boolean;
  tags: string[] | null;
  author: Author;
}

interface ArticleResponse {
  id: string;
  title: string;
  published_at: string | null;
  is_visible: boolean;
  tags: string[] | null;
  author: Author;
}

export default function ArticlesAdmin() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  async function fetchArticles() {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select(`
          id,
          title,
          published_at,
          is_visible,
          tags,
          author:author_id (
            id, first_name, last_name, image_url
          )
        `)
        .order('published_at', { ascending: false })
        .returns<ArticleResponse[]>();

      if (error) throw error;
      
      setArticles(data || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
      alert('Error fetching articles');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this article?')) return;

    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setArticles(articles.filter(article => article.id !== id));
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('Error deleting article');
    }
  }

  function getArticleStatus(article: Article) {
    if (!article.is_visible) return 'hidden';
    if (!article.published_at) return 'draft';
    return 'published';
  }

  function getAuthorName(author: Author) {
    return `${author.first_name} ${author.last_name}`;
  }

  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Articles</h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all articles in your publication
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <Link
              href="/admin/articles/new"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
              New Article
            </Link>
          </div>
        </div>
        
        <div className="mt-8 flex flex-col">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                        Title
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Author
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Published
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Tags
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="text-center py-4">Loading...</td>
                      </tr>
                    ) : articles.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-4">No articles found</td>
                      </tr>
                    ) : (
                      articles.map((article) => (
                        <tr key={article.id}>
                          <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            <Link 
                              href={`/articles/${article.id}`}
                              className="hover:text-blue-600 transition-colors"
                            >
                              <div className="max-w-xs truncate">
                                {article.title}
                              </div>
                            </Link>
                          </td>
                          <td className="px-3 py-4 text-sm text-gray-500">
                            {article.author ? getAuthorName(article.author) : 'Unknown'}
                          </td>
                          <td className="px-3 py-4 text-sm text-gray-500">
                            <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                              getArticleStatus(article) === 'published' ? 'bg-green-100 text-green-800' : 
                              getArticleStatus(article) === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {getArticleStatus(article)}
                            </span>
                          </td>
                          <td className="px-3 py-4 text-sm text-gray-500">
                            {article.published_at ? format(new Date(article.published_at), 'MMM d, yyyy') : 'Not published'}
                          </td>
                          <td className="px-3 py-4 text-sm text-gray-500">
                            <div className="flex flex-wrap gap-1">
                              {article.tags && article.tags.map(tag => (
                                <span key={tag} className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="relative py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <div className="flex justify-end gap-2">
                              <Link
                                href={`/admin/articles/${article.id}/edit`}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <PencilIcon className="h-5 w-5" />
                              </Link>
                              <button
                                onClick={() => handleDelete(article.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <TrashIcon className="h-5 w-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
