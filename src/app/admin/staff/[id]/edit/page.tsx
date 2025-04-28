'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import AdminLayout from '@/components/admin/AdminLayout';
import { PageProps } from 'next';

interface FormData {
  first_name: string;
  last_name: string;
  title: string;
  bio: string;
  image_url: string;
  linkedin_url: string;
  personal_site_url: string;
  department: string;
  is_visible: boolean;
  display_order: number;
  contact_email: string;
}

export default function EditStaffPage({ params }: PageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    first_name: '',
    last_name: '',
    title: '',
    bio: '',
    image_url: '',
    linkedin_url: '',
    personal_site_url: '',
    department: 'civil_rights',
    is_visible: true,
    display_order: 9999,
    contact_email: '',
  });
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function fetchStaff() {
      try {
        const { data, error } = await supabase
          .from('staff')
          .select()
          .eq('id', params.id)
          .single();

        if (error) throw error;

        if (data) {
          setFormData({
            first_name: data.first_name,
            last_name: data.last_name,
            title: data.title || '',
            bio: data.bio || '',
            image_url: data.image_url || '',
            linkedin_url: data.linkedin_url || '',
            personal_site_url: data.personal_site_url || '',
            department: data.department || 'civil_rights',
            is_visible: data.is_visible !== undefined ? data.is_visible : true,
            display_order: data.display_order || 9999,
            contact_email: data.contact_email || '',
          });
        }
      } catch (err) {
        console.error('Error fetching staff:', err);
        setError('Failed to load staff member');
      } finally {
        setLoading(false);
      }
    }

    fetchStaff();
  }, [params.id, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const { error } = await supabase
        .from('staff')
        .update(formData)
        .eq('id', params.id);

      if (error) throw error;

      router.push('/admin/staff');
    } catch (err) {
      console.error('Error updating staff:', err);
      setError('Failed to update staff member');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Edit Staff Member</h1>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              id="first_name"
              value={formData.first_name}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              id="last_name"
              value={formData.last_name}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

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
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
              Bio
            </label>
            <textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={4}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="image_url" className="block text-sm font-medium text-gray-700">
              Image URL
            </label>
            <input
              type="url"
              id="image_url"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="linkedin_url" className="block text-sm font-medium text-gray-700">
              LinkedIn URL
            </label>
            <input
              type="url"
              id="linkedin_url"
              value={formData.linkedin_url}
              onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="personal_site_url" className="block text-sm font-medium text-gray-700">
              Personal Website URL
            </label>
            <input
              type="url"
              id="personal_site_url"
              value={formData.personal_site_url}
              onChange={(e) => setFormData({ ...formData, personal_site_url: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="contact_email"
              value={formData.contact_email}
              onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_visible}
                onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Visible to public</span>
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
              Lower numbers will appear first. Use the staff list page for drag-and-drop reordering.
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
