'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { TrashIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface Comment {
  id: number;
  content: string;
  created_at: string;
  status: 'pending' | 'approved' | 'rejected';
  article_id: number;
  commenter_name: string;
  article: {
    id: number;
    title: string;
  };
}

export default function CommentsAdmin() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, []);

  async function fetchComments() {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          article:article_id (
            id,
            title
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error: any) {
      console.error('Error fetching comments:', error?.message || 'Unknown error');
      setComments([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(id: number, status: 'approved' | 'rejected') {
    try {
      const { error } = await supabase
        .from('comments')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      
      setComments(comments.map(comment => 
        comment.id === id ? { ...comment, status } : comment
      ));
    } catch (error: any) {
      console.error('Error updating comment:', error?.message || 'Unknown error');
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setComments(comments.filter(comment => comment.id !== id));
    } catch (error: any) {
      console.error('Error deleting comment:', error?.message || 'Unknown error');
    }
  }

  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Comments</h1>
            <p className="mt-2 text-sm text-gray-700">
              Manage and moderate comments from your readers
            </p>
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
                        Comment
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Article
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Commenter
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Date
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
                    ) : comments.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-4">No comments found</td>
                      </tr>
                    ) : (
                      comments.map((comment) => (
                        <tr key={comment.id}>
                          <td className="py-4 pl-4 pr-3 text-sm sm:pl-6">
                            <div className="max-w-xs overflow-hidden text-gray-900">
                              {comment.content}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                            <a href={`/articles/${comment.article.id}`} className="hover:underline">
                              {comment.article.title}
                            </a>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {comment.commenter_name}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm">
                            <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                              comment.status === 'approved' ? 'bg-green-100 text-green-800' :
                              comment.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {comment.status}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {format(new Date(comment.created_at), 'MMM d, yyyy')}
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <div className="flex justify-end gap-2">
                              {comment.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => handleStatusChange(comment.id, 'approved')}
                                    className="text-green-600 hover:text-green-900"
                                  >
                                    <CheckIcon className="h-5 w-5" />
                                  </button>
                                  <button
                                    onClick={() => handleStatusChange(comment.id, 'rejected')}
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    <XMarkIcon className="h-5 w-5" />
                                  </button>
                                </>
                              )}
                              <button
                                onClick={() => handleDelete(comment.id)}
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
