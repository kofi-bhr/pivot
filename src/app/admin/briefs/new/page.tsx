import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import BriefForm from "../_components/BriefForm";

export default async function NewBriefPage() {
  const supabase = createServerComponentClient({ cookies });
  
  const { data: authors } = await supabase
    .from("authors")
    .select("id, first_name, last_name")
    .order("display_order");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">New Policy Brief</h1>
      <BriefForm authors={authors || []} />
    </div>
  );
}
