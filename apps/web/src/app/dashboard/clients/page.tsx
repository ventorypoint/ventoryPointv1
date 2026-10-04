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
    .map((m: any) => m.organizations)
    .filter((org: any): org is { id: string; name: string } => org !== null);

  // Fetch client accounts for these organizations
  const { data: clients } = await supabase
    .from("client_accounts")
    .select("*")
    .in("organization_id", orgIds)
    .order("created_at", { ascending: false });

  return (
    <ClientsClient 
      initialClients={clients || []} 
      organizations={organizations}
    />
  );
}
