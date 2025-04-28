import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import BriefForm from '../../_components/BriefForm';

export default async function EditBriefPage({
  params,
}: {
  params: { id: string };
}) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const [{ data: brief }, { data: authors }] = await Promise.all([
    supabase
      .from('briefs')
      .select()
      .eq('id', params.id)
      .single(),
    supabase
      .from('authors')
      .select('id, first_name, last_name')
      .order('display_order')
  ]);

  if (!brief) {
    throw new Error('Brief not found');
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Brief</h1>
      <BriefForm brief={brief} authors={authors || []} />
    </div>
  );
}
