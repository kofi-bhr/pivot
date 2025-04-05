'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import { PlusIcon, PencilIcon, EyeIcon, EyeSlashIcon, TrashIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Author {
  id: string;
  first_name: string;
  last_name: string;
  image_url: string | null;
  article_count: number;
  is_visible: boolean;
  display_order?: number;
}

interface SupabaseError {
  message: string;
  details?: string;
  hint?: string;
  code?: string;
}

function SortableAuthorRow({ 
  author, 
  onToggleVisibility, 
  onDeleteClick 
}: { 
  author: Author; 
  onToggleVisibility: (id: string, isVisible: boolean) => void;
  onDeleteClick: (author: Author) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: author.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  return (
    <tr ref={setNodeRef} style={style} {...attributes} className="hover:bg-gray-50">
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
        <div className="flex items-center">
          <div {...listeners} className="cursor-move mr-2 text-gray-400 hover:text-gray-600">
            <ArrowsUpDownIcon className="h-5 w-5" />
          </div>
          <div className="h-10 w-10 flex-shrink-0">
            <div className="relative h-10 w-10 rounded-full overflow-hidden">
              <Image
                src={author.image_url || '/placeholder-avatar.jpg'}
                alt={`${author.first_name} ${author.last_name}`}
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div className="ml-4">
            <div className="font-medium text-gray-900">{author.first_name} {author.last_name}</div>
          </div>
        </div>
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {author.article_count}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm">
        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
          author.is_visible 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {author.is_visible ? 'Visible' : 'Hidden'}
        </span>
      </td>
      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
        <div className="flex justify-end gap-2">
          <Link
            href={`/admin/authors/${author.id}/edit`}
            className="text-blue-600 hover:text-blue-900"
            title="Edit author"
          >
            <PencilIcon className="h-5 w-5" />
          </Link>
          <button
            onClick={() => onToggleVisibility(author.id, author.is_visible)}
            className={`${
              author.is_visible 
                ? 'text-gray-600 hover:text-gray-900' 
                : 'text-green-600 hover:text-green-900'
            }`}
            title={author.is_visible ? 'Hide author' : 'Show author'}
          >
            {author.is_visible ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
          <button
            onClick={() => onDeleteClick(author)}
            className="text-red-600 hover:text-red-900"
            title="Delete author"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function AuthorsAdmin() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorToDelete, setAuthorToDelete] = useState<Author | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const [orderChanged, setOrderChanged] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchAuthors();
  }, []);

  async function fetchAuthors() {
    try {
      // Try to order by display_order first
      const authorsQuery = supabase
        .from('authors')
        .select(`
          id,
          first_name,
          last_name,
          image_url,
          is_visible,
          display_order
        `);
        
      try {
        // Try to order by display_order
        const { data: authorsData, error: orderError } = await authorsQuery
          .order('display_order', { ascending: true });
        
        if (!orderError) {
          // Then, for each author, count their articles
          const authorsWithCounts = await Promise.all(
            (authorsData || []).map(async (author) => {
              const { count, error: countError } = await supabase
                .from('articles')
                .select('*', { count: 'exact', head: true })
                .eq('author_id', author.id);
                
              if (countError) {
                console.error('Error counting articles:', countError);
                return {
                  ...author,
                  article_count: 0
                };
              }
              
              return {
                ...author,
                article_count: count || 0
              };
            })
          );
          
          setAuthors(authorsWithCounts);
          setLoading(false);
          return;
        }
      } catch (orderError) {
        console.error('Error ordering by display_order, falling back to first_name:', orderError);
      }
      
      // Fallback to ordering by first_name if display_order doesn't exist
      const { data: authorsData, error: authorsError } = await supabase
        .from('authors')
        .select(`
          id,
          first_name,
          last_name,
          image_url,
          is_visible
        `)
        .order('first_name');

      if (authorsError) throw authorsError;
      
      // Then, for each author, count their articles
      const authorsWithCounts = await Promise.all(
        (authorsData || []).map(async (author, index) => {
          const { count, error: countError } = await supabase
            .from('articles')
            .select('*', { count: 'exact', head: true })
            .eq('author_id', author.id);
            
          if (countError) {
            console.error('Error counting articles:', countError);
            return {
              ...author,
              article_count: 0,
              display_order: index + 1
            };
          }
          
          return {
            ...author,
            article_count: count || 0,
            display_order: index + 1
          };
        })
      );
      
      setAuthors(authorsWithCounts);
    } catch (error: unknown) {
      const supabaseError = error as SupabaseError;
      console.error('Error fetching authors:', supabaseError?.message || 'Unknown error');
      setAuthors([]);
    } finally {
      setLoading(false);
    }
  }

  async function toggleVisibility(id: string, currentVisibility: boolean) {
    try {
      const { error } = await supabase
        .from('authors')
        .update({ is_visible: !currentVisibility })
        .eq('id', id);

      if (error) throw error;
      
      // Update local state
      setAuthors(authors.map(author => 
        author.id === id 
          ? { ...author, is_visible: !currentVisibility } 
          : author
      ));
    } catch (error: unknown) {
      const supabaseError = error as SupabaseError;
      console.error('Error updating author visibility:', supabaseError?.message || 'Unknown error');
    }
  }

  async function deleteAuthor(author: Author) {
    if (author.article_count > 0) {
      setDeleteError(`Cannot delete ${getAuthorName(author)} because they have ${author.article_count} article${author.article_count > 1 ? 's' : ''}.`);
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);
    
    try {
      const response = await fetch(`/api/admin/authors?id=${author.id}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete author');
      }
      
      // Remove author from local state
      setAuthors(authors.filter(a => a.id !== author.id));
      setAuthorToDelete(null);
    } catch (error) {
      console.error('Error deleting author:', error);
      setDeleteError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsDeleting(false);
    }
  }

  function getAuthorName(author: Author) {
    return `${author.first_name} ${author.last_name}`;
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setAuthors((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        const newOrder = arrayMove(items, oldIndex, newIndex);
        setOrderChanged(true);
        return newOrder;
      });
    }
  }

  async function saveOrder() {
    if (!orderChanged) return;
    
    setIsSavingOrder(true);
    try {
      const authorIds = authors.map(author => author.id);
      
      const response = await fetch('/api/admin/authors', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ authorIds }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        // Check if this is a migration error
        if (result.details && result.details.includes('Migration file:')) {
          alert(`${result.error}\n\nPlease ask your database administrator to run the migration: ${result.details}`);
        } else {
          throw new Error(result.error || 'Failed to update order');
        }
      }
      
      setOrderChanged(false);
    } catch (error) {
      console.error('Error saving order:', error);
      alert('Failed to save order. Please try again.');
    } finally {
      setIsSavingOrder(false);
    }
  }

  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Authors</h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all authors in your publication
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <Link
              href="/admin/authors/new"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
              Add Author
            </Link>
          </div>
        </div>
        
        {orderChanged && (
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Order has been changed</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>You&apos;ve changed the order of authors. Click Save Order to apply these changes.</p>
                </div>
                <div className="mt-4">
                  <div className="-mx-2 -my-1.5 flex">
                    <button
                      type="button"
                      onClick={saveOrder}
                      disabled={isSavingOrder}
                      className="bg-yellow-50 px-2 py-1.5 rounded-md text-sm font-medium text-yellow-800 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-yellow-50 focus:ring-yellow-600"
                    >
                      {isSavingOrder ? 'Saving...' : 'Save Order'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                        Author
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Articles
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {loading ? (
                      <tr>
                        <td colSpan={4} className="py-10 text-center text-gray-500">
                          Loading...
                        </td>
                      </tr>
                    ) : authors.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-10 text-center text-gray-500">
                          No authors found
                        </td>
                      </tr>
                    ) : (
                      <DndContext 
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                      >
                        <SortableContext 
                          items={authors.map(author => author.id)}
                          strategy={verticalListSortingStrategy}
                        >
                          {authors.map((author) => (
                            <SortableAuthorRow 
                              key={author.id} 
                              author={author} 
                              onToggleVisibility={toggleVisibility}
                              onDeleteClick={setAuthorToDelete}
                            />
                          ))}
                        </SortableContext>
                      </DndContext>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {authorToDelete && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Author</h3>
            
            {deleteError ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {deleteError}
              </div>
            ) : (
              <p className="text-gray-500 mb-4">
                Are you sure you want to delete {getAuthorName(authorToDelete)}? 
                {authorToDelete.article_count > 0 && (
                  <span className="block mt-2 text-red-600">
                    Warning: This author has {authorToDelete.article_count} article{authorToDelete.article_count > 1 ? 's' : ''}.
                    You must reassign or delete these articles before deleting this author.
                  </span>
                )}
              </p>
            )}
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  setAuthorToDelete(null);
                  setDeleteError(null);
                }}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => deleteAuthor(authorToDelete)}
                disabled={isDeleting || authorToDelete.article_count > 0}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
