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
        <section className="relative py-64 bg-[url('/photos/bg-1.png')] bg-cover bg-center">
          <div className="absolute inset-0 bg-black opacity-50"></div> {/* Overlay */}
          <div className="container mx-auto px-4 relative z-10 text-white">
            <div className="text-center mb-16">
              <h1 style={{ color: 'white', fontSize: '3rem', fontWeight: 'bold' }} className="font-montserrat mb-6">
                Welcome to PIVOT
              </h1>
            </div>
          </div>
        </section>

        {/* New About Us / Stats Section */}
        <section>
          <div className="bg-slate-50 py-12">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row justify-around items-center text-center space-y-8 md:space-y-0 md:space-x-8">
                <div>
                  <p className="text-5xl font-bold text-slate-700">70+</p>
                  <p className="text-xl text-slate-600 mt-1">Global Members</p>
                </div>
                <div>
                  <p className="text-5xl font-bold text-slate-700">11</p>
                  <p className="text-xl text-slate-600 mt-1">Countries</p>
                </div>
                <div>
                  <p className="text-5xl font-bold text-slate-700">30+</p>
                  <p className="text-xl text-slate-600 mt-1">US States</p>
                </div>
              </div>
            </div>
          </div>
          <div className="py-16 text-center">
            <div className="container mx-auto px-4">
              <h3 className="text-3xl font-bold font-montserrat mb-6 text-slate-800">
                70+ members, 11 countries, 1 mission
              </h3>
              <p className="text-lg leading-relaxed text-slate-700 max-w-3xl mx-auto">
                Youth are directly impacted by policy but rarely have a seat at the table. PIVOT was created to address this disconnect by equipping young leaders with the tools to analyze, draft, and advocate for policy based on their lived experiences. We create nonpartisan solutions to our world's most pressing problems in a time of extreme polarization.
              </p>
            </div>
          </div>
        </section>

        {/* Wrapper for Programs and Founders sections to share background */}
        <div className="relative bg-[url('/photos/bg-2.png')] bg-cover bg-center py-16">
          <div className="absolute inset-0 bg-black opacity-25 z-0"></div> {/* Overlay */}

          {/* Programs Section */}
          <section className="mb-16">
            <div className="container mx-auto px-4 relative z-10">
              <h2 style={{ color: 'white', fontWeight: 'bold', fontSize: '2.25rem', marginBottom: '3rem' }} className="font-montserrat text-center">
                Our Programs
              </h2>
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* PIVOT Voices */}
                <div className="bg-[#7ED0E7] rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow">
                  <h3 className="text-2xl font-bold font-montserrat mb-4 text-white">PIVOT Voices</h3>
                  <p className="text-white mb-4">
                    A platform for youth to publish op-eds, articles, and research papers on issues they feel passionately about.
                  </p>
                  <a
                    href="/articles"
                    className="text-white font-semibold font-montserrat hover:text-[#E1FFFE]"
                  >
                    Read our articles →
                  </a>
                </div>

                {/* PIVOT Fellowship */}
                <div className="bg-[#E1FFFE] rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow">
                  <h3 className="text-2xl font-bold font-montserrat mb-4 text-[#7ED0E7]">PIVOT Fellowship</h3>
                  <p className="text-gray-600 mb-4">
                    A program empowering young leaders to design original, solutions-focused policy briefs and equipping them with the skills needed to share their ideas with real-world changemakers.
                  </p>
                  <a
                    href="/fellowship"
                    className="text-[#7ED0E7] font-semibold font-montserrat hover:text-[#6BB8CC]"
                  >
                    Learn more →
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Founders Section */}
          <section>
            <div className="container mx-auto px-4 relative z-10">
              <h2 style={{ color: 'white', fontWeight: 'bold', fontSize: '2.25rem', marginBottom: '3rem' }} className="font-montserrat text-center">
                Meet Our Founders
              </h2>
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
                    <h3 className="text-xl font-bold font-montserrat mb-2">{founder.first_name} {founder.last_name}</h3>
                    <p className="text-gray-600">{founder.title}</p>
                    <p className="text-gray-600 mt-2">{founder.bio}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Departments Preview */}
        <section className="bg-[#E1FFFE] py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold font-montserrat mb-8 text-center text-[#7ED0E7]">Our Policy Focus Areas</h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {[
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
          </div>
        </section>
      </div>
    </Layout>
  );
}