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
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">About Us</h2>
              <p className="text-gray-600 mb-4">
                PIVOT is a dynamic platform where policy meets perspective. We bring together diverse voices to analyze, discuss, and shape the policies that affect our communities.
              </p>
              <p className="text-gray-600 mb-4">
                Through rigorous research and inclusive dialogue, we strive to make complex policy issues accessible and actionable for everyone.
              </p>
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
                  Our flagship platform for policy experts, researchers, and thought leaders to share their insights and perspectives on pressing issues facing our society.
                </p>
                <a
                  href="https://commoninja.site/7f9de57f-9efb-41d3-b0dc-3a6e4bc240c8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 font-semibold hover:text-blue-700"
                >
                  Become a Staff Writer →
                </a>
              </div>

              {/* PIVOT Fellowship */}
              <div className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-2xl font-bold mb-4 text-blue-600">PIVOT Fellowship</h3>
                <p className="text-gray-600 mb-4">
                  A transformative program that nurtures the next generation of policy leaders through mentorship, research opportunities, and hands-on policy analysis experience.
                </p>
                <a
                  href="https://commoninja.site/7f9de57f-9efb-41d3-b0dc-3a6e4bc240c8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 font-semibold hover:text-blue-700"
                >
                  Apply for Fellowship →
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