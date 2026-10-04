"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function createClientAccount(formData: FormData) {
  const supabase = await createClient();
  
  const name = formData.get("name") as string;
  const short_code = formData.get("short_code") as string;
  const primary_contact_email = formData.get("primary_contact_email") as string;
  const primary_contact_name = formData.get("primary_contact_name") as string;
  const primary_contact_phone = formData.get("primary_contact_phone") as string;
  const organization_id = formData.get("organization_id") as string;

  if (!name || !short_code || !organization_id) {
    return { error: "Missing required fields" };
  }

  const { data, error } = await supabase
    .from("client_accounts")
    .insert({
      organization_id,
      name,
      short_code,
      primary_contact_email: primary_contact_email || null,
      primary_contact_name: primary_contact_name || null,
      primary_contact_phone: primary_contact_phone || null,
      status: 'active'
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/clients");
  return { data };
}

export async function updateClientAccount(id: string, formData: FormData) {
  const supabase = await createClient();
  
  const name = formData.get("name") as string;
  const short_code = formData.get("short_code") as string;
  const primary_contact_email = formData.get("primary_contact_email") as string;
  const primary_contact_name = formData.get("primary_contact_name") as string;
  const primary_contact_phone = formData.get("primary_contact_phone") as string;

  const { data, error } = await supabase
    .from("client_accounts")
    .update({
      name,
      short_code,
      primary_contact_email: primary_contact_email || null,
      primary_contact_name: primary_contact_name || null,
      primary_contact_phone: primary_contact_phone || null,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/clients");
  return { data };
}

export async function deleteClientAccount(id: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from("client_accounts")
    .delete()
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/clients");
  return { success: true };
}
