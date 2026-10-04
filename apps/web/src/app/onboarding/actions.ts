"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export async function createOrganization(formData: FormData) {
  const name = formData.get("name") as string;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Create an admin client to bypass RLS for initial org setup
  const supabaseAdmin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 1. Create the organization
  const { data: org, error: orgError } = await supabaseAdmin
    .from("organizations")
    .insert([{ name }])
    .select()
    .single();

  if (orgError) {
    return redirect(`/onboarding?message=${encodeURIComponent(orgError.message)}`);
  }

  // 2. Add the user as the owner of the organization
  const { error: memberError } = await supabaseAdmin
    .from("organization_members")
    .insert([{
      organization_id: org.id,
      user_id: user.id,
      role: "owner",
      is_active: true,
      can_manage_all_members: true,
      all_facilities: true
    }]);

  if (memberError) {
    return redirect(`/onboarding?message=${encodeURIComponent(memberError.message)}`);
  }

  // 3. Redirect to the dashboard for this new org
  revalidatePath("/", "layout");
  redirect("/dashboard");
}
