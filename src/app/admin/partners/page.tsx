'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AdminLayout from '@/components/admin/AdminLayout';
import { createClient } from '@/utils/supabase/client';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface Partner {
  id: string;
  name: string;
  logo_url: string;
  website_url: string;
  order: number;
}

interface EditPartnerModalProps {
  partner: Partner | null;
  onClose: () => void;
  onSave: (partner: Partner) => Promise<void>;
}

function EditPartnerModal({ partner, onClose, onSave }: EditPartnerModalProps) {
  const [name, setName] = useState(partner?.name || '');
  const [websiteUrl, setWebsiteUrl] = useState(partner?.website_url || '');
  const [logoUrl, setLogoUrl] = useState(partner?.logo_url || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partner) return;

    setIsLoading(true);
    setError(null);

    try {
      await onSave({
        ...partner,
        name,
        website_url: websiteUrl,
        logo_url: logoUrl,
      });
      onClose();
    } catch (err) {
      setError('Failed to update partner');
      console.error('Error updating partner:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!partner) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle">
          <div>
            <div className="mt-3 text-center sm:mt-5">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Edit Partner</h3>
              <div className="mt-2">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                      Website URL
                    </label>
                    <input
                      type="url"
                      name="website"
                      id="website"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="logo" className="block text-sm font-medium text-gray-700">
                      Logo URL
                    </label>
                    <input
                      type="url"
                      name="logo"
                      id="logo"
                      value={logoUrl}
                      onChange={(e) => setLogoUrl(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      required
                    />
                  </div>

                  {error && (
                    <div className="rounded-md bg-red-50 p-4">
                      <div className="text-sm text-red-700">{error}</div>
                    </div>
                  )}

                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm disabled:opacity-50"
                    >
                      {isLoading ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SortablePartnerRow({ partner, onDelete, onEdit }: { partner: Partner; onDelete: (id: string) => void; onEdit: (partner: Partner) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: partner.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const truncateUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch {
      return url.length > 30 ? `${url.substring(0, 30)}...` : url;
    }
  };

  return (
    <tr ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
        <div className="flex items-center">
          <div className="h-10 w-10 flex-shrink-0">
            <Image
              src={partner.logo_url}
              alt={partner.name}
              width={40}
              height={40}
              className="rounded-full"
            />
          </div>
          <div className="ml-4">
            <div className="font-medium text-gray-900">{partner.name}</div>
          </div>
        </div>
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        <a href={partner.website_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-900">
          {truncateUrl(partner.website_url)}
        </a>
      </td>
      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => onEdit(partner)}
            className="text-blue-600 hover:text-blue-900"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => onDelete(partner.id)}
            className="text-red-600 hover:text-red-900"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function PartnersAdmin() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const supabase = createClient();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const fetchPartners = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('partners')
        .select('*')
        .order('order', { ascending: true });

      if (fetchError) throw fetchError;
      setPartners(data || []);
    } catch (err) {
      console.error('Error fetching partners:', err);
      setError('Failed to load partners');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, [fetchPartners]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id && over) {
      setPartners((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex);
        
        const updatedItems = newItems.map((item, index) => ({
          ...item,
          order: index + 1
        }));

        void saveOrder(updatedItems);

        return updatedItems;
      });
    }
  };

  const saveOrder = async (updatedPartners: Partner[]) => {
    try {
      const updates = updatedPartners.map(partner => ({
        id: partner.id,
        order: partner.order
      }));

      const { error: updateError } = await supabase
        .from('partners')
        .upsert(updates);

      if (updateError) throw updateError;
    } catch (err) {
      console.error('Error saving order:', err);
      setError('Failed to save partner order');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this partner?')) return;

    try {
      const { error: deleteError } = await supabase
        .from('partners')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      setPartners(partners.filter(partner => partner.id !== id));
    } catch (err) {
      console.error('Error deleting partner:', err);
      setError('Failed to delete partner');
    }
  };

  const handleEdit = async (partner: Partner) => {
    try {
      const { error: updateError } = await supabase
        .from('partners')
        .update({
          name: partner.name,
          website_url: partner.website_url,
          logo_url: partner.logo_url,
        })
        .eq('id', partner.id);

      if (updateError) throw updateError;

      setPartners(partners.map(p => p.id === partner.id ? partner : p));
    } catch (err) {
      console.error('Error updating partner:', err);
      setError('Failed to update partner');
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Partners</h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all partners in your organization including their name and website.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <Link
              href="/admin/partners/new"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
            >
              Add partner
            </Link>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                          Partner
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Website
                        </th>
                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      <SortableContext
                        items={partners.map(partner => partner.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        {partners.map((partner) => (
                          <SortablePartnerRow
                            key={partner.id}
                            partner={partner}
                            onDelete={handleDelete}
                            onEdit={setEditingPartner}
                          />
                        ))}
                      </SortableContext>
                    </tbody>
                  </table>
                </DndContext>
              </div>
            </div>
          </div>
        </div>
      </div>

      {editingPartner && (
        <EditPartnerModal
          partner={editingPartner}
          onClose={() => setEditingPartner(null)}
          onSave={handleEdit}
        />
      )}
    </AdminLayout>
  );
} 