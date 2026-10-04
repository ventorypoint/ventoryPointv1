import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { FacilitiesClient } from "./components/facilities-client";

export default async function FacilitiesPage() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  // Get user's organizations
  const { data: members } = await supabase
    .from("organization_members")
    .select("organization_id, role, organizations(id, name)")
    .eq("user_id", user.id)
    .eq("is_active", true);

  if (!members || members.length === 0) {
    redirect("/onboarding");
  }

  const orgIds = members.map((m: any) => m.organization_id);
  
  // Format organizations for the client
  const organizations = members
    .map((m: any) => m.organizations)
    .filter((org: any): org is { id: string; name: string } => org !== null);

  // Fetch facilities for these organizations
  // RLS will ensure we only get facilities we're allowed to see
  const { data: facilities } = await supabase
    .from("facilities")
    .select("*")
    .in("organization_id", orgIds)
    .order("created_at", { ascending: false });

  return (
    <FacilitiesClient 
      initialFacilities={facilities || []} 
      organizations={organizations}
    />
  );
}
