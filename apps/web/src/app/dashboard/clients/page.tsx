import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ClientsClient } from "./components/clients-client";

export default async function ClientsPage() {
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
    .map((m: any) => (Array.isArray(m.organizations) ? m.organizations[0] : m.organizations))
    .filter((org: any): org is { id: string; name: string } => org !== null && org !== undefined);

  // Fetch client accounts for these organizations
  const { data: clients } = await supabase
    .from("client_accounts")
    .select("*, client_facilities(facility_id)")
    .in("organization_id", orgIds)
    .order("created_at", { ascending: false });

  const { data: facilities } = await supabase
    .from("facilities")
    .select("id, name, organization_id")
    .in("organization_id", orgIds)
    .order("name");

  const formattedClients = (clients || []).map((c: any) => ({
    ...c,
    facility_ids: (c.client_facilities || []).map((cf: any) => cf.facility_id),
  }));

  return (
    <ClientsClient 
      initialClients={formattedClients} 
      organizations={organizations}
      facilities={facilities || []}
    />
  );
}
