'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Image from 'next/image';
import Layout from '@/components/layout/Layout';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function FellowshipPage() {
  const [fellows, setFellows] = useState<any[]>([]);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchFellows = async () => {
      const { data } = await supabase
        .from('fellows')
        .select('*')
        .order('name');
      setFellows(data || []);
    };

    fetchFellows();
  }, [supabase]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Pivot Fellowship</h1>
          
          <div className="prose max-w-none mb-12">
            <p className="text-lg mb-6">
              The PIVOT Global Fellowship empowers young leaders to design original, solutions-focused policy proposals and equips them with the skills needed to share their ideas with real-world changemakers. Focusing on 5 main sectors: Environment, Education, Civil Rights, Public Health, and Economic Policy, our teams are addressing complex challenges with fresh perspectives and bold ideas.
            </p>
            <p className="text-lg mb-6">
              We provide mentorship, training, and collaborative spaces for young policy innovators to:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>Conduct rigorous, data-driven research</li>
              <li>Draft policy briefs and recommendations</li>
              <li>Present their work to lawmakers, nonprofits, and advocacy groups</li>
              <li>Publish thought leadership pieces on issues affecting youth worldwide</li>
            </ul>
            <a
              href="https://forms.gle/ZzQkTMbwRCWb54BE9"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Apply to Join the Fellowship
            </a>
          </div>

          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Our Policy Areas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  id: "civil_rights",
                  name: "Civil Rights",
                  description: "Protecting fundamental rights and advocating for justice reform.",
                  color: "bg-purple-500"
                },
                {
                  id: "economics",
                  name: "Economics",
                  description: "Analyzing policies and promoting equitable economic growth.",
                  color: "bg-yellow-500"
                },
                {
                  id: "education",
                  name: "Education",
                  description: "Ensuring equal access to quality education for all.",
                  color: "bg-blue-500"
                },
                {
                  id: "environment",
                  name: "Environment",
                  description: "Addressing climate change and environmental sustainability.",
                  color: "bg-emerald-500"
                },
                {
                  id: "public_health",
                  name: "Public Health",
                  description: "Improving health outcomes and healthcare accessibility.",
                  color: "bg-red-500"
                }
              ].map((dept) => (
                <Link
                  key={dept.id}
                  href={`/departments/${dept.id}`}
                  className="group block"
                >
                  <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white">
                    <div className={`${dept.color} h-2`} />
                    <div className="p-6">
                      <h3 className="text-xl font-semibold font-montserrat mb-2 group-hover:text-blue-600 transition-colors">
                        {dept.name}
                      </h3>
                      <p className="text-gray-600">{dept.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <h2 className="text-3xl font-bold mb-8">Meet Our Fellows</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fellows?.map((fellow) => (
              <div key={fellow.id} className="rounded-lg border bg-white shadow-sm p-4">
                {fellow['profile-picture'] && (
                  <div className="relative w-full aspect-square mb-4 rounded-lg overflow-hidden">
                    <Image
                      src={fellow['profile-picture']}
                      alt={fellow.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <h3 className="text-xl font-semibold mb-2">{fellow.name}</h3>
                {(fellow.city || fellow.region) && (
                  <p className="text-gray-600">
                    {[fellow.city, fellow.region].filter(Boolean).join(", ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
