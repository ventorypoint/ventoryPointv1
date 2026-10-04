"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function createFacility(formData: FormData) {
  const supabase = await createClient();
  
  const name = formData.get("name") as string;
  const short_code = formData.get("short_code") as string;
  const timezone = formData.get("timezone") as string;
  const address = formData.get("address") as string;
  const organization_id = formData.get("organization_id") as string;

  if (!name || !short_code || !organization_id) {
    return { error: "Missing required fields" };
  }

  const { data, error } = await supabase
    .from("facilities")
    .insert({
      organization_id,
      name,
      short_code,
      timezone: timezone || "UTC",
      address,
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/facilities");
  return { data };
}

export async function updateFacility(id: string, formData: FormData) {
  const supabase = await createClient();
  
  const name = formData.get("name") as string;
  const short_code = formData.get("short_code") as string;
  const timezone = formData.get("timezone") as string;
  const address = formData.get("address") as string;

  const { data, error } = await supabase
    .from("facilities")
    .update({
      name,
      short_code,
      timezone,
      address,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/facilities");
  return { data };
}

export async function deleteFacility(id: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from("facilities")
    .delete()
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/facilities");
  return { success: true };
}
