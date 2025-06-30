import { cookies } from 'next/headers';
import Layout from '@/components/layout/Layout';
import BriefCard, { Brief } from '@/components/ui/BriefCard'; // Import the new card and its type
import { createClient } from '@/utils/supabase/server';

export const revalidate = 0; // Or a specific time in seconds, e.g., 3600 for 1 hour

export default async function BriefsPage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // Fetch briefs, ordered by display_order, then by created_at descending
  let briefs: any[] = [];
  let fetchError = false;
  
  try {
    console.log('Attempting to fetch briefs...');
    
    // Check if Supabase client is properly initialized
    if (!supabase) {
      console.error('Error: Supabase client is not initialized');
      fetchError = true;
      return;
    }
    
    const { data, error } = await supabase
      .from('briefs')
      .select('*, author:authors(*)')
      .order('display_order', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching policy briefs:', error.message || JSON.stringify(error));
      console.error('Error details:', JSON.stringify(error, null, 2));
      fetchError = true;
    } else {
      console.log(`Successfully fetched ${data?.length || 0} briefs`);
      briefs = data || [];
    }
  } catch (err) {
    console.error('Exception when fetching policy briefs:', err);
    // Try to get more details about the error
    if (err instanceof Error) {
      console.error('Error name:', err.name);
      console.error('Error message:', err.message);
      console.error('Error stack:', err.stack);
    } else {
      console.error('Unknown error type:', typeof err);
    }
    fetchError = true;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold font-montserrat mb-10 text-center text-slate-800">
          Briefs
        </h1>
        {fetchError && (
          <div className="text-center text-red-600 mb-8">
            <p>Could not fetch briefs at this time. Please try again later.</p>
          </div>
        )}
        {briefs && briefs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {briefs.map((brief) => (
              <BriefCard key={brief.id} brief={brief as unknown as Brief} />
            ))}
          </div>
        ) : (
          !fetchError && (
            <div className="text-center text-slate-600">
              <p>No briefs available at the moment. Please check back soon!</p>
            </div>
          )
        )}
      </div>
    </Layout>
  );
}
