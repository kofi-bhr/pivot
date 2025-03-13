import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/admin/AdminLayout';
import Link from 'next/link';
import {
  DocumentTextIcon,
  UserGroupIcon,
  ChatBubbleLeftIcon,
} from '@heroicons/react/24/outline';

async function getDashboardStats() {
  try {
    const [
      { count: articlesCount, error: articlesError },
      { count: authorsCount, error: authorsError },
      { count: commentsCount, error: commentsError },
    ] = await Promise.all([
      supabase.from('articles').select('*', { count: 'exact', head: true }),
      supabase.from('authors').select('*', { count: 'exact', head: true }),
      supabase.from('comments').select('*', { count: 'exact', head: true }),
    ]);

    if (articlesError) console.error('Error fetching articles:', articlesError);
    if (authorsError) console.error('Error fetching authors:', authorsError);
    if (commentsError) console.error('Error fetching comments:', commentsError);

    return {
      articlesCount: articlesCount || 0,
      authorsCount: authorsCount || 0,
      commentsCount: commentsCount || 0,
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      articlesCount: 0,
      authorsCount: 0,
      commentsCount: 0,
    };
  }
}

export default async function AdminDashboard() {
  const { articlesCount, authorsCount, commentsCount } = await getDashboardStats();

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* Articles card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DocumentTextIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Articles</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">{articlesCount}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <Link href="/admin/articles" className="font-medium text-blue-700 hover:text-blue-900">
                  View all
                </Link>
              </div>
            </div>
          </div>

          {/* Authors card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UserGroupIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Authors</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">{authorsCount}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <Link href="/admin/authors" className="font-medium text-blue-700 hover:text-blue-900">
                  View all
                </Link>
              </div>
            </div>
          </div>

          {/* Comments card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ChatBubbleLeftIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Comments</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">{commentsCount}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <Link href="/admin/comments" className="font-medium text-blue-700 hover:text-blue-900">
                  View all
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}