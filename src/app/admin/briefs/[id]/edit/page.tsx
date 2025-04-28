'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import AdminLayout from '@/components/admin/AdminLayout';
import { PageProps } from 'next';

interface FormData {
  title: string;
  content: string;
  summary: string;
  department: string;
  author_id: string;
  published: boolean;
  display_order: number;
}

export default function EditBriefPage({ params }: PageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    content: '',
    summary: '',
    department: 'civil_rights',
    author_id: '',
    published: false,
    display_order: 9999,
  });
  const [authors, setAuthors] = useState<Array<{ id: string; first_name: string; last_name: string }>>([]);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function fetchData() {
      try {
        const [briefRes, authorsRes] = await Promise.all([
          supabase
            .from('briefs')
            .select()
            .eq('id', params.id)
            .single(),
          supabase
            .from('authors')
            .select('id, first_name, last_name')
            .order('display_order'),
        ]);

        if (briefRes.error) throw briefRes.error;
        if (authorsRes.error) throw authorsRes.error;

        if (briefRes.data) {
          setFormData({
            title: briefRes.data.title,
            content: briefRes.data.content || '',
            summary: briefRes.data.summary || '',
            department: briefRes.data.department || 'civil_rights',
            author_id: briefRes.data.author_id || '',
            published: briefRes.data.published || false,
            display_order: briefRes.data.display_order || 9999,
          });
        }

        if (authorsRes.data) {
          setAuthors(authorsRes.data);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load brief');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [params.id, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const { error } = await supabase
        .from('briefs')
        .update(formData)
        .eq('id', params.id);

      if (error) throw error;

      router.push('/admin/briefs');
    } catch (err) {
      console.error('Error updating brief:', err);
      setError('Failed to update brief');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Edit Brief</h1>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="summary" className="block text-sm font-medium text-gray-700">
              Summary
            </label>
            <textarea
              id="summary"
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              rows={3}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              Content
            </label>
            <textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={10}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700">
              Department
            </label>
            <select
              id="department"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            >
              <option value="civil_rights">Civil Rights</option>
              <option value="economics">Economics</option>
              <option value="education">Education</option>
              <option value="environment">Environment</option>
              <option value="public_health">Public Health</option>
            </select>
          </div>

          <div>
            <label htmlFor="author_id" className="block text-sm font-medium text-gray-700">
              Author
            </label>
            <select
              id="author_id"
              value={formData.author_id}
              onChange={(e) => setFormData({ ...formData, author_id: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            >
              <option value="">Select an author</option>
              {authors.map((author) => (
                <option key={author.id} value={author.id}>
                  {author.first_name} {author.last_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Published</span>
            </label>
          </div>

          <div>
            <label htmlFor="display_order" className="block text-sm font-medium text-gray-700">
              Display Order
            </label>
            <input
              type="number"
              id="display_order"
              value={formData.display_order}
              onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <p className="mt-1 text-sm text-gray-500">
              Lower numbers will appear first. Use the briefs list page for drag-and-drop reordering.
            </p>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
