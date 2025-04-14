'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/client';
import Layout from '@/components/layout/Layout';

interface Partner {
  id: string;
  name: string;
  logo_url: string;
  website_url: string;
  order: number;
}

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const { data } = await supabase
          .from('partners')
          .select('*')
          .order('order', { ascending: true });
        
        setPartners(data || []);
      } catch (error) {
        console.error('Error fetching partners:', error);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchPartners();
  }, [supabase]);

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto py-12">
          <div className="text-center">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-12">
        <h1 className="text-4xl font-bold mb-8 text-center">Our Partners</h1>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          We are proud to collaborate with these organizations that share our commitment to excellence and innovation.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {partners.map((partner) => (
            <a
              key={partner.id}
              href={partner.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center p-6"
            >
              <div className="relative w-full h-48 mb-4">
                <Image
                  src={partner.logo_url}
                  alt={partner.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <h3 className="text-lg font-medium text-gray-900 hover:underline">
                {partner.name}
              </h3>
            </a>
          ))}
        </div>

        {partners.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            No partners to display at this time.
          </div>
        )}
      </div>
    </Layout>
  );
} 