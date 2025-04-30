import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';
import Layout from '@/components/layout/Layout';

export default async function FellowshipPage() {
  const supabase = createClient();
  
  // Fetch fellows from the database
  const { data: fellows } = await supabase
    .from('fellows')
    .select('*')
    .order('name');

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Pivot Fellowship</h1>
          
          <div className="prose max-w-none mb-12">
            <p className="text-lg mb-6">
              The Pivot Fellowship program brings together talented individuals passionate about
              transforming healthcare through technology and innovation. Our fellows work on
              cutting-edge projects while receiving mentorship from industry leaders.
            </p>
            
            <a
              href="https://forms.gle/ZzQkTMbwRCWb54BE9"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Apply to Join the Fellowship
            </a>
          </div>

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
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
