"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function removeMember(memberId: string) {
  const supabase = await createClient();
  
  // RLS will enforce whether the caller is allowed to delete this member
  // (Owner can delete anyone, Admin can delete those they invited, etc.)
  const { error } = await supabase
    .from("organization_members")
    .delete()
    .eq("id", memberId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/members");
  return { success: true };
}

export async function toggleMemberStatus(memberId: string, isActive: boolean) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from("organization_members")
    .update({ is_active: isActive })
    .eq("id", memberId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/members");
  return { success: true };
}

export async function generateInviteCode(formData: FormData) {
  const supabase = await createClient();
  
  const organization_id = formData.get("organization_id") as string;
  const role = formData.get("role") as string;
  const max_uses = parseInt(formData.get("max_uses") as string) || 1;
  const days_valid = parseInt(formData.get("days_valid") as string) || 7;
  
  // Generate a random 8-char code (unambiguous characters)
  const charset = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  // Format as XXXX-XXXX
  const formattedCode = `${code.slice(0, 4)}-${code.slice(4)}`;
  
  // Note: in a real prod app we'd hash the code and store the hash.
  // For MVP we'll just store it to easily retrieve it for the UI.
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + days_valid);

  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("invitations")
    .insert({
      organization_id,
      code: formattedCode,
      code_hash: formattedCode, // MVP simplification
      role,
      max_uses,
      expires_at: expiresAt.toISOString(),
      created_by: user?.id
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/members");
  return { data };
}
