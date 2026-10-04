import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { MembersClient } from "./components/members-client";

export default async function MembersPage() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  // Get user's active organizations
  const { data: userMemberships } = await supabase
    .from("organization_members")
    .select("organization_id, role, organizations(id, name)")
    .eq("user_id", user.id)
    .eq("is_active", true);

  if (!userMemberships || userMemberships.length === 0) {
    redirect("/onboarding");
  }

  const orgIds = userMemberships.map((m: any) => m.organization_id);
  
  const organizations = userMemberships
    .map((m: any) => m.organizations)
    .filter((org: any): org is { id: string; name: string } => org !== null);

  // Fetch all members for these organizations
  const { data: members } = await supabase
    .from("organization_members")
    .select(`
      id,
      user_id,
      organization_id,
      role,
      is_active,
      profiles (
        id,
        first_name,
        last_name,
        email
      )
    `)
    .in("organization_id", orgIds)
    .order("created_at", { ascending: false });

  // Fetch active invites for these orgs
  const { data: invites } = await supabase
    .from("invitations")
    .select("*")
    .in("organization_id", orgIds)
    .order("created_at", { ascending: false });

  // PostgREST returns profiles as an array (or single object depending on schema). Normalize it:
  const formattedMembers = (members || []).map((m: any) => ({
    ...m,
    profiles: Array.isArray(m.profiles) ? m.profiles[0] : m.profiles
  }));

  return (
    <MembersClient 
      initialMembers={formattedMembers} 
      initialInvites={invites || []}
      organizations={organizations}
    />
  );
}
