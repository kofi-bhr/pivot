'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface StaffMember {
  id: string;
  first_name: string;
  last_name: string;
  title: string;
  department: string | null;
  image_url: string | null;
  bio: string | null;
  contact_email: string | null;
  linkedin_url: string | null;
  personal_site_url: string | null;
  is_visible: boolean;
  display_order: number;
}

export default function EditStaffMember({ params }: { params: Promise<{ id: string }> & { id: string } }) {
  const router = useRouter();
  const { id } = params;
  
  const [formData, setFormData] = useState<Partial<StaffMember>>({
    first_name: '',
    last_name: '',
    title: '',
    department: '',
    image_url: '',
    bio: '',
    contact_email: '',
    linkedin_url: '',
    personal_site_url: '',
    is_visible: true,
    display_order: 9999
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStaffMember() {
      try {
        const { data, error } = await supabase
          .from('staff')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        
        if (data) {
          setFormData(data);
        } else {
          setError('Staff member not found');
        }
      } catch (err) {
        console.error('Error fetching staff member:', err);
        setError('Failed to load staff member');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchStaffMember();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/staff?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update staff member');
      }

      router.push('/admin/staff');
    } catch (err) {
      console.error('Error updating staff member:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error && !isSubmitting) {
    return (
      <AdminLayout>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <button
          onClick={() => router.push('/admin/staff')}
          className="text-blue-600 hover:text-blue-800"
        >
          Back to Staff List
        </button>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Edit Staff Member</h1>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  name="first_name"
                  id="first_name"
                  required
                  value={formData.first_name || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  name="last_name"
                  id="last_name"
                  required
                  value={formData.last_name || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                required
                value={formData.title || ''}
                onChange={handleChange}
                placeholder="e.g. Senior Editor, Marketing Manager"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                Department
              </label>
              <select
                name="department"
                id="department"
                value={formData.department || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="">Select a department</option>
                <option value="admin">Admin</option>
                <option value="marketing">Marketing</option>
                <option value="editing">Editing</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="contact_email"
                id="contact_email"
                value={formData.contact_email || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                Biography
              </label>
              <textarea
                name="bio"
                id="bio"
                rows={4}
                value={formData.bio || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="image_url" className="block text-sm font-medium text-gray-700">
                Profile Image URL
              </label>
              <input
                type="url"
                name="image_url"
                id="image_url"
                value={formData.image_url || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-700">External Links</h3>
              
              <div>
                <label htmlFor="linkedin_url" className="block text-sm font-medium text-gray-700">
                  LinkedIn
                </label>
                <input
                  type="url"
                  name="linkedin_url"
                  id="linkedin_url"
                  value={formData.linkedin_url || ''}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/username"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="personal_site_url" className="block text-sm font-medium text-gray-700">
                  Personal Website
                </label>
                <input
                  type="url"
                  name="personal_site_url"
                  id="personal_site_url"
                  value={formData.personal_site_url || ''}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="is_visible"
                name="is_visible"
                type="checkbox"
                checked={formData.is_visible || false}
                onChange={handleCheckboxChange}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="is_visible" className="ml-2 block text-sm text-gray-900">
                Visible on public staff page
              </label>
            </div>

            <div>
              <label htmlFor="display_order" className="block text-sm font-medium text-gray-700">
                Display Order
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="number"
                  name="display_order"
                  id="display_order"
                  value={formData.display_order || 9999}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  min="1"
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Lower numbers will appear first on the staff page. Use the staff list page for drag-and-drop reordering.
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
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
