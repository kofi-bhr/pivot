import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation'; // Keep for potential future use (e.g. session check)
import { revalidatePath } from 'next/cache';
import AdminLayout from '@/components/admin/AdminLayout';

export const dynamic = 'force-dynamic';

interface HomepageStat {
  id: string;
  stat_key: string;
  stat_label: string;
  stat_value: string | null;
  display_order: number;
}

async function getHomepageStats(supabase: any): Promise<HomepageStat[]> {
  const { data, error } = await supabase
    .from('homepage_stats')
    .select('id, stat_key, stat_label, stat_value, display_order')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching homepage stats:', error);
    return []; // Return empty array on error, or handle more gracefully
  }
  return data || [];
}

export default async function AdminHomepageStatsPage() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  // const { data: { session } } = await supabase.auth.getSession();
  // if (!session) {
  //   redirect('/admin/login?message=Please log in to manage homepage statistics.');
  // }

  const stats: HomepageStat[] = await getHomepageStats(supabase);

  async function updateHomepageStats(formData: FormData) {
    'use server';
    const cookieStoreInner = cookies(); // Ensure cookies are accessed within the server action context
    const supabaseInner = createServerComponentClient({ cookies: () => cookieStoreInner });

    // Re-check session in server action for added security (optional)
    // const { data: { session: actionSession } } = await supabaseInner.auth.getSession();
    // if (!actionSession) {
    //     console.error("User not authenticated to update stats.");
    //     return; // Or throw an error
    // }

    const statsToUpsert: Array<{ stat_key: string; stat_value: string }> = [];

    for (const [key, value] of formData.entries()) {
      if (key.startsWith('stat_value_')) {
        const statKey = key.substring('stat_value_'.length);
        if (statKey) { // Ensure statKey is not empty
          statsToUpsert.push({
            stat_key: statKey,
            stat_value: value as string,
            // updated_at is handled by the database trigger
          });
        }
      }
    }

    if (statsToUpsert.length > 0) {
      const { error } = await supabaseInner
        .from('homepage_stats')
        .upsert(statsToUpsert, { onConflict: 'stat_key' });

      if (error) {
        console.error('Error upserting homepage stats:', error);
        // Optionally, return an error message to the UI or throw an error
      } else {
        console.log('Homepage stats updated successfully.');
      }
    } else {
      console.log('No stats to update or no valid stat keys found in form data.');
    }

    revalidatePath('/'); // Revalidate the public homepage
    revalidatePath('/admin/homepage-stats'); // Revalidate this admin page
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Manage Homepage Statistics</h1>
        
        {stats.length === 0 ? (
          <p className="text-gray-600">
            No statistics found. Please add statistics directly to the <code className="text-sm bg-gray-100 p-1 rounded">homepage_stats</code> table in Supabase.
            You can use the sample data provided in the SQL script to get started.
          </p>
        ) : (
          <form action={updateHomepageStats} className="space-y-6 bg-white p-6 rounded-lg shadow max-w-lg">
            {stats.map((stat) => (
              <div key={stat.id}> {/* Use stat.id for React key */}
                <label htmlFor={`stat_value_${stat.stat_key}`} className="block text-sm font-medium text-gray-700 mb-1">
                  {stat.stat_label}
                </label>
                <input
                  type="text" // Using text type for flexibility as stat_value is TEXT in DB
                  name={`stat_value_${stat.stat_key}`} // Name includes stat_key for server action parsing
                  id={`stat_value_${stat.stat_key}`}
                  defaultValue={stat.stat_value || ''} // Default to empty string if null
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder={`Enter value for ${stat.stat_label}`}
                />
                {/* Example of a helper text, if needed based on stat_key or label */}
                {/* {stat.stat_key === 'some_specific_key' && (
                  <p className="mt-2 text-xs text-gray-500">Specific instruction for this stat.</p>
                )} */}
              </div>
            ))}
            <div>
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Update Statistics
              </button>
            </div>
          </form>
        )}
      </div>
    </AdminLayout>
  );
}
