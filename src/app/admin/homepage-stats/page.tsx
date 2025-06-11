import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import AdminLayout from '@/components/admin/AdminLayout'; // Using AdminLayout

export const dynamic = 'force-dynamic';

async function getHomepageStats(supabase: any) {
  const { data, error } = await supabase
    .from('homepage_stats')
    .select('stat_key, stat_value');

  if (error) {
    console.error('Error fetching homepage stats:', error);
    return { countriesCount: 0, usStatesCount: 0, staffDisplayCount: 0 }; // Added staffDisplayCount
  }

  const countriesStat = data.find((stat: any) => stat.stat_key === 'countries_count');
  const usStatesStat = data.find((stat: any) => stat.stat_key === 'us_states_count');
  const staffStat = data.find((stat: any) => stat.stat_key === 'staff_display_count'); // Added staffStat

  return {
    countriesCount: countriesStat ? countriesStat.stat_value : 0,
    usStatesCount: usStatesStat ? usStatesStat.stat_value : 0,
    staffDisplayCount: staffStat ? staffStat.stat_value : 0, // Added staffDisplayCount
  };
}

export default async function AdminHomepageStatsPage() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  // const { data: { session } } = await supabase.auth.getSession();

  // if (!session) {
  //   redirect('/admin/login?message=Please log in to manage homepage statistics.');
  // }

  const { countriesCount, usStatesCount, staffDisplayCount } = await getHomepageStats(supabase); // Added staffDisplayCount

  async function updateHomepageStats(formData: FormData) {
    'use server';
    const cookieStore = cookies();
    const supabase = createServerComponentClient({ cookies: () => cookieStore });

    // Re-check session in server action for added security
    // const { data: { session: actionSession } } = await supabase.auth.getSession();
    // if (!actionSession) {
    //     console.error("User not authenticated to update stats.");
    //     // Optionally, could throw an error or return a specific response
    //     return;
    // }

    const countriesCountStr = formData.get('countriesCount') as string;
    const usStatesCountStr = formData.get('usStatesCount') as string;
    const staffDisplayCountStr = formData.get('staffDisplayCount') as string;

    const statsToUpsert = [];

    if (countriesCountStr && !isNaN(parseInt(countriesCountStr, 10))) {
      statsToUpsert.push({
        stat_key: 'countries_count',
        stat_value: parseInt(countriesCountStr, 10),
        updated_at: new Date().toISOString(),
      });
    }

    if (usStatesCountStr && !isNaN(parseInt(usStatesCountStr, 10))) {
      statsToUpsert.push({
        stat_key: 'us_states_count',
        stat_value: parseInt(usStatesCountStr, 10),
        updated_at: new Date().toISOString(),
      });
    }

    if (staffDisplayCountStr && !isNaN(parseInt(staffDisplayCountStr, 10))) {
      statsToUpsert.push({
        stat_key: 'staff_display_count',
        stat_value: parseInt(staffDisplayCountStr, 10),
        updated_at: new Date().toISOString(),
      });
    }

    if (statsToUpsert.length > 0) {
      const { error } = await supabase
        .from('homepage_stats')
        .upsert(statsToUpsert, { onConflict: 'stat_key' });

      if (error) {
        console.error('Error upserting homepage stats:', error);
        // Optionally, you could return an error message to the UI
      } else {
        console.log('Homepage stats updated successfully.');
      }
    } else {
      console.log('No valid stats to update.');
    }

    revalidatePath('/'); // Revalidate the home page
    revalidatePath('/admin/homepage-stats'); // Revalidate this admin page
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Manage Homepage Statistics</h1>
        
        <form action={updateHomepageStats} className="space-y-6 bg-white p-6 rounded-lg shadow max-w-lg">
          <div>
            <label htmlFor="countriesCount" className="block text-sm font-medium text-gray-700 mb-1">
              Number of Countries
            </label>
            <input
              type="number"
              name="countriesCount"
              id="countriesCount"
              defaultValue={countriesCount}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="usStatesCount" className="block text-sm font-medium text-gray-700 mb-1">
              Number of US States
            </label>
            <input
              type="number"
              name="usStatesCount"
              id="usStatesCount"
              defaultValue={usStatesCount}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <p className="mt-2 text-xs text-gray-500">The '+' sign will be automatically added on the homepage display.</p>
          </div>

          {/* Added Staff Display Count Input */}
          <div>
            <label htmlFor="staffDisplayCount" className="block text-sm font-medium text-gray-700 mb-1">
              Number of Staff (Display)
            </label>
            <input
              type="number"
              name="staffDisplayCount"
              id="staffDisplayCount"
              defaultValue={staffDisplayCount}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
             <p className="mt-2 text-xs text-gray-500">This number will be displayed on the homepage for staff count.</p>
          </div>

          <div>
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Update Statistics
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
