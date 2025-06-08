import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Layout from '@/components/layout/Layout';
import PolicyBriefCard, { PolicyBrief } from '@/components/ui/PolicyBriefCard'; // Import the new card and its type

export const revalidate = 0; // Or a specific time in seconds, e.g., 3600 for 1 hour

export default async function PolicyBriefsPage() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  // Fetch policy briefs, ordered by display_order, then by published_date descending
  const { data: briefs, error } = await supabase
    .from('policy_briefs')
    .select('*')
    .order('display_order', { ascending: true, nullsFirst: false }) // Optional: if you use display_order
    .order('published_date', { ascending: false });

  if (error) {
    console.error('Error fetching policy briefs:', error);
    // Optionally, render an error message to the user
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold font-montserrat mb-10 text-center text-slate-800">
          Policy Briefs
        </h1>
        {error && (
          <div className="text-center text-red-600 mb-8">
            <p>Could not fetch policy briefs at this time. Please try again later.</p>
          </div>
        )}
        {briefs && briefs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {briefs.map((brief) => (
              <PolicyBriefCard key={brief.id} brief={brief as PolicyBrief} />
            ))}
          </div>
        ) : (
          !error && (
            <div className="text-center text-slate-600">
              <p>No policy briefs available at the moment. Please check back soon!</p>
            </div>
          )
        )}
      </div>
    </Layout>
  );
}
