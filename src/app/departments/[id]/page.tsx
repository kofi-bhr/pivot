'use server';

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { DepartmentBadge } from '@/components/DepartmentBadge';
import Image from 'next/image';
import Layout from '@/components/layout/Layout';

const departmentInfo = {
  civil_rights: {
    title: "Civil Rights",
    description: "Our civil rights department focuses on protecting and advancing fundamental human rights, ensuring equal treatment under the law, and advocating for justice reform.",
    dbValue: "civil rights"
  },
  economics: {
    title: "Economics",
    description: "The economics department analyzes fiscal policies, economic trends, and their impacts on communities, with a focus on promoting equitable economic growth.",
    dbValue: "economics"
  },
  education: {
    title: "Education",
    description: "Our education team works to ensure equal access to quality education, addressing systemic barriers and promoting innovative learning solutions.",
    dbValue: "education"
  },
  environment: {
    title: "Environment",
    description: "The environment department tackles climate change, sustainability, and environmental justice issues through research-backed policy recommendations.",
    dbValue: "environmental"
  },
  public_health: {
    title: "Public Health",
    description: "Our public health experts work on improving healthcare accessibility, addressing health disparities, and promoting evidence-based health policies.",
    dbValue: "public health"
  },
} as const;

type Department = keyof typeof departmentInfo;

export default async function DepartmentPage({
  params,
}: {
  params: { id: string };
}) {
  if (!(params.id in departmentInfo)) {
    notFound();
  }

  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const [briefsRes, staffRes] = await Promise.all([
    supabase
      .from('briefs')
      .select(`
        *,
        author:authors(first_name, last_name, image_url)
      `)
      .eq('department', params.id)
      .eq('published', true)
      .order('display_order'),
    
    supabase
      .from('staff')
      .select()
      .eq('department', departmentInfo[params.id as Department].dbValue)
      .eq('is_visible', true)
      .ilike('title', '%head%')
      .single()
  ]);

  const briefs = briefsRes.data || [];
  const departmentHead = staffRes.data;

  const info = departmentInfo[params.id as Department];

  return (
    <Layout>
      <div className="bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="mb-12">
              <DepartmentBadge department={params.id as Department} />
              <h1 className="text-4xl font-bold mt-4 mb-6">{info.title}</h1>
              <p className="text-xl text-gray-600">{info.description}</p>
            </div>

            {departmentHead && (
              <div className="mb-12 bg-white rounded-lg p-8 shadow-md">
                <h2 className="text-2xl font-semibold mb-6">Department Head</h2>
                <div className="flex items-center space-x-6">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden flex-shrink-0">
                    {departmentHead.image_url ? (
                      <Image
                        src={departmentHead.image_url}
                        alt={`${departmentHead.first_name} ${departmentHead.last_name}`}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-3xl text-gray-500">
                          {departmentHead.first_name[0]}{departmentHead.last_name[0]}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-2xl font-medium mb-2">
                      {departmentHead.first_name} {departmentHead.last_name}
                    </h3>
                    <p className="text-gray-600 text-lg mb-4">{departmentHead.title}</p>
                    <p className="text-gray-600">{departmentHead.bio}</p>
                    {(departmentHead.linkedin_url || departmentHead.personal_site_url) && (
                      <div className="mt-4 space-x-4">
                        {departmentHead.linkedin_url && (
                          <a
                            href={departmentHead.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700"
                          >
                            LinkedIn
                          </a>
                        )}
                        {departmentHead.personal_site_url && (
                          <a
                            href={departmentHead.personal_site_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700"
                          >
                            Personal Website
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-8">
              <h2 className="text-2xl font-semibold">Policy Briefs</h2>
              {briefs.length === 0 ? (
                <p className="text-gray-600 text-center py-8">No policy briefs available at this time.</p>
              ) : (
                <div className="grid gap-6">
                  {briefs.map((brief) => (
                    <div
                      key={brief.id}
                      className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
                    >
                      <h3 className="text-xl font-semibold mb-3">{brief.title}</h3>
                      <p className="text-gray-600 mb-4">{brief.summary}</p>
                      {brief.author && (
                        <div className="flex items-center mt-4">
                          <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
                            {brief.author.image_url ? (
                              <Image
                                src={brief.author.image_url}
                                alt={`${brief.author.first_name} ${brief.author.last_name}`}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <span className="text-sm text-gray-500">
                                  {brief.author.first_name[0]}{brief.author.last_name[0]}
                                </span>
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm text-gray-900 font-medium">
                              {brief.author.first_name} {brief.author.last_name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(brief.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
