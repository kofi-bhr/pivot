import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import BriefForm from "../../_components/BriefForm";

interface EditBriefPageProps {
  params: {
    id: string;
  };
}

export default async function EditBriefPage({ params }: EditBriefPageProps) {
  const supabase = createServerComponentClient({ cookies });

  const [{ data: brief }, { data: authors }] = await Promise.all([
    supabase
      .from("briefs")
      .select()
      .eq("id", params.id)
      .single(),
    supabase
      .from("authors")
      .select("id, first_name, last_name")
      .order("display_order"),
  ]);

  if (!brief) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit Policy Brief</h1>
      <BriefForm brief={brief} authors={authors || []} />
    </div>
  );
}
