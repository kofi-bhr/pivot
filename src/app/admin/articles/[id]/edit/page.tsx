'use client';

import { useState, useEffect, use } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { Author } from '@/lib/supabase';
import RichTextEditor from '@/components/admin/RichTextEditor';

interface PageProps {
  params: Promise<{ id: string }> & { id: string };
}

// In Next.js 15, params is a Promise, but we can still access it synchronously in client components
// for backwards compatibility (this will be deprecated in future versions)
export default function EditArticle({ params }: PageProps) {
  const router = useRouter();
  const [authors, setAuthors] = useState<Author[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    coverImage: '',
    tags: '',
    author_id: '',
    is_visible: true,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { id } = use(params as Promise<{ id: string }>);

  useEffect(() => {
    async function fetchArticleAndAuthors() {
      setLoading(true);
      try {
        // Fetch article
        const { data: article, error: articleError } = await supabase
          .from('articles')
          .select('*')
          .eq('id', id)
          .single();

        if (articleError) {
          console.error('Error fetching article:', articleError);
          setError('Failed to load article');
          return;
        }

        // Fetch authors
        const { data: authorsData, error: authorsError } = await supabase
          .from('authors')
          .select('id, first_name, last_name')
          .order('first_name');
        
        if (authorsError) {
          console.error('Error fetching authors:', authorsError);
          setError('Failed to load authors');
          return;
        }
        
        setAuthors(authorsData || []);
        
        // Set form data from article
        setFormData({
          title: article.title || '',
          content: article.content || '',
          coverImage: article.cover_image_url || '',
          tags: article.tags ? article.tags.join(', ') : '',
          author_id: article.author_id || '',
          is_visible: article.is_visible !== null ? article.is_visible : true,
        });
      } catch (err) {
        console.error('Error in fetchArticleAndAuthors:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchArticleAndAuthors();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (!formData.author_id) {
      setError('Please select an author');
      setIsSubmitting(false);
      return;
    }

    try {
      // Process tags from comma-separated string to array
      const tagsArray = formData.tags
        ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        : [];

      const { error: updateError } = await supabase
        .from('articles')
        .update({
          title: formData.title,
          content: formData.content,
          cover_image_url: formData.coverImage || null,
          tags: tagsArray,
          author_id: formData.author_id,
          is_visible: formData.is_visible,
          updated_at: new Date().toISOString(),
          // If article is being made visible and wasn't before, set published_at
          published_at: formData.is_visible ? (await getExistingPublishedDate() || new Date().toISOString()) : null,
        })
        .eq('id', id);

      if (updateError) {
        throw updateError;
      }

      router.push('/admin/articles');
    } catch (error) {
      console.error('Error updating article:', error);
      setError('Failed to update article. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getExistingPublishedDate = async () => {
    const { data } = await supabase
      .from('articles')
      .select('published_at')
      .eq('id', id)
      .single();
    
    return data?.published_at;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: target.checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading article...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow">
          <h1 className="text-2xl font-semibold mb-6">Edit Article</h1>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium">
                Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="mt-1 block w-full rounded border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="author_id" className="block text-sm font-medium">
                Author
              </label>
              <select
                name="author_id"
                id="author_id"
                required
                value={formData.author_id}
                onChange={handleChange}
                className="mt-1 block w-full rounded border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select an author</option>
                {authors.map(author => (
                  <option key={author.id} value={author.id}>
                    {`${author.first_name} ${author.last_name}`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium">
                Content
              </label>
              <div className="mt-1">
                <RichTextEditor
                  value={formData.content}
                  onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
                  placeholder="Write your article content here..."
                />
              </div>
            </div>

            <div>
              <label htmlFor="coverImage" className="block text-sm font-medium">
                Cover Image URL
              </label>
              <input
                type="url"
                name="coverImage"
                id="coverImage"
                value={formData.coverImage}
                onChange={handleChange}
                className="mt-1 block w-full rounded border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                name="tags"
                id="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="news, feature, opinion"
                className="mt-1 block w-full rounded border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="is_visible"
                id="is_visible"
                checked={formData.is_visible}
                onChange={(e) => setFormData(prev => ({ ...prev, is_visible: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="is_visible" className="ml-2 block text-sm font-medium">
                Visible to public
              </label>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 text-sm border rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
