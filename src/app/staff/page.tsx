'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import { FaLinkedin } from 'react-icons/fa';
import { HiOutlineGlobeAlt } from 'react-icons/hi';
import Layout from '@/components/layout/Layout';

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
  display_order: number;
}

export default function StaffPage() {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStaffMembers() {
      try {
        // Try to order by display_order first
        let query = supabase
          .from('staff')
          .select('*')
          .eq('is_visible', true);
          
        try {
          const { data, error } = await query.order('display_order', { ascending: true });
          
          if (!error) {
            setStaffMembers(data || []);
            setLoading(false);
            return;
          }
        } catch (orderError) {
          console.error('Error ordering by display_order, falling back to last_name:', orderError);
        }
        
        // Fallback to ordering by last_name
        const { data, error } = await supabase
          .from('staff')
          .select('*')
          .eq('is_visible', true)
          .order('last_name');
          
        if (error) throw error;
        
        setStaffMembers(data || []);
      } catch (error) {
        console.error('Error fetching staff:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchStaffMembers();
  }, []);

  function getFullName(staff: StaffMember) {
    return `${staff.first_name} ${staff.last_name}`;
  }

  return (
    <Layout>
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our Team</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Meet the talented individuals who make our organization thrive.
            </p>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-500">Loading...</p>
            </div>
          ) : staffMembers.length === 0 ? (
            <div className="mt-16 text-center">
              <p className="text-gray-500">No staff members to display.</p>
            </div>
          ) : (
            <ul
              role="list"
              className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3"
            >
              {staffMembers.map((person) => (
                <li key={person.id}>
                  <div className="flex items-center gap-x-6">
                    <div className="h-16 w-16 relative rounded-full overflow-hidden">
                      <Image
                        src={person.image_url || '/placeholder-avatar.jpg'}
                        alt={getFullName(person)}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold leading-7 tracking-tight text-gray-900">
                        {getFullName(person)}
                      </h3>
                      <p className="text-sm font-semibold leading-6 text-blue-600">{person.title}</p>
                      {person.department && (
                        <p className="text-sm text-gray-600">{person.department}</p>
                      )}
                      <div className="mt-2 flex space-x-3">
                        {person.linkedin_url && (
                          <a 
                            href={person.linkedin_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-gray-500"
                          >
                            <FaLinkedin className="h-5 w-5" />
                          </a>
                        )}
                        {person.personal_site_url && (
                          <a 
                            href={person.personal_site_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-gray-500"
                          >
                            <HiOutlineGlobeAlt className="h-5 w-5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  {person.bio && (
                    <div className="mt-4 text-sm text-gray-600">
                      <p>{person.bio}</p>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Layout>
  );
}
