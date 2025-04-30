import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '@/components/layout/Layout';

export default async function Home() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  
  // Fetch founders from staff table
  const { data: founders } = await supabase
    .from('staff')
    .select()
    .ilike('title', '%Founder%')
    .order('display_order');

  return (
    <Layout>
      <div>
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-white to-blue-50 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                Welcome to PIVOT
              </h1>
            </div>
          </div>
        </section>

        {/* About Us Section */}
        <section className="bg-white py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold mb-6">About Us</h2>
              <p className="text-lg leading-8 text-gray-600 mb-12">
                PIVOT is a youth-led think tank, focusing on amplifying young voices in the policymaking process in two main ways. Through PIVOT Voices, youth are given a platform to publish op-eds, articles, and research papers on issues they feel passionately about. Through the PIVOT Fellowship, we empower young leaders to design original, solutions-focused policy briefs and equip them with the skills needed to share their ideas with real-world changemakers.
              </p>
            </div>

            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
                <div className="flex flex-col">
                  <dt className="text-xl font-semibold leading-7 text-gray-900">
                    PIVOT Voices
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">
                      A platform for youth to publish op-eds, articles, and research papers on issues they feel passionately about.
                    </p>
                    <p className="mt-6">
                      <Link href="/articles" className="text-sm font-semibold leading-6 text-gray-900">
                        Read our articles <span aria-hidden="true">→</span>
                      </Link>
                    </p>
                  </dd>
                </div>

                <div className="flex flex-col">
                  <dt className="text-xl font-semibold leading-7 text-gray-900">
                    PIVOT Fellowship
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">
                      A program empowering young leaders to design original, solutions-focused policy briefs and equipping them with the skills needed to share their ideas with real-world changemakers.
                    </p>
                    <p className="mt-6">
                      <Link href="/fellowship" className="text-sm font-semibold leading-6 text-gray-900">
                        Learn more <span aria-hidden="true">→</span>
                      </Link>
                    </p>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        {/* Programs Section */}
        <section className="bg-blue-50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Our Programs</h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* PIVOT Voices */}
              <div className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-2xl font-bold mb-4 text-blue-600">PIVOT Voices</h3>
                <p className="text-gray-600 mb-4">
                  A platform for youth to publish op-eds, articles, and research papers on issues they feel passionately about.
                </p>
                <a
                  href="/articles"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 font-semibold hover:text-blue-700"
                >
                  Read our articles →
                </a>
              </div>

              {/* PIVOT Fellowship */}
              <div className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-2xl font-bold mb-4 text-blue-600">PIVOT Fellowship</h3>
                <p className="text-gray-600 mb-4">
                  A program empowering young leaders to design original, solutions-focused policy briefs and equipping them with the skills needed to share their ideas with real-world changemakers.
                </p>
                <a
                  href="/fellowship"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 font-semibold hover:text-blue-700"
                >
                  Learn more →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Founders Section */}
        <section className="bg-white py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Meet Our Founders</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {founders?.map((founder) => (
                <div key={founder.id} className="text-center bg-white rounded-lg p-6 shadow-md">
                  <div className="relative w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden">
                    {founder.image_url ? (
                      <Image
                        src={founder.image_url}
                        alt={`${founder.first_name} ${founder.last_name}`}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-2xl text-gray-500">
                          {founder.first_name[0]}{founder.last_name[0]}
                        </span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{founder.first_name} {founder.last_name}</h3>
                  <p className="text-gray-600">{founder.title}</p>
                  <p className="text-gray-600 mt-2">{founder.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Departments Preview */}
        <section className="bg-blue-50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Our Policy Focus Areas</h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {departments.map((dept) => (
                <Link
                  key={dept.id}
                  href={`/departments/${dept.id}`}
                  className="group block"
                >
                  <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white">
                    <div className={`${dept.color} h-2`} />
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                        {dept.name}
                      </h3>
                      <p className="text-gray-600">{dept.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}

const departments = [
  {
    id: "civil_rights",
    name: "Civil Rights",
    description: "Advocating for equality, justice, and fundamental human rights for all.",
    color: "bg-purple-500"
  },
  {
    id: "economics",
    name: "Economics",
    description: "Analyzing economic policies and their impact on communities.",
    color: "bg-blue-500"
  },
  {
    id: "education",
    name: "Education",
    description: "Promoting equitable access to quality education.",
    color: "bg-green-500"
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
];