"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

function parseAssignment(formData: FormData) {
  const facility_ids = Array.from(new Set(formData.getAll("facility_ids").map(String).filter(Boolean)));
  const default_facility_id = ((formData.get("default_facility_id") as string) || "").trim() || null;
  // The default facility must also be one of the serving facilities
  if (default_facility_id && !facility_ids.includes(default_facility_id)) {
    facility_ids.push(default_facility_id);
  }
  return { facility_ids, default_facility_id };
}

/** Makes client_facilities match `facilityIds` exactly. RLS enforces same-org + admin rights. */
async function syncClientFacilities(
  supabase: Awaited<ReturnType<typeof createClient>>,
  clientId: string,
  organizationId: string,
  facilityIds: string[]
) {
  if (facilityIds.length > 0) {
    const { data: valid, error } = await supabase
      .from("facilities")
      .select("id")
      .eq("organization_id", organizationId)
      .in("id", facilityIds);
    if (error) return error.message;
    if ((valid ?? []).length !== facilityIds.length) {
      return "One or more selected facilities are not in this organization.";
    }
  }

  const { data: existing, error: readError } = await supabase
    .from("client_facilities")
    .select("facility_id")
    .eq("client_id", clientId);
  if (readError) return readError.message;

  const have = new Set((existing ?? []).map((r) => r.facility_id as string));
  const want = new Set(facilityIds);

  const toRemove = [...have].filter((id) => !want.has(id));
  const toAdd = [...want].filter((id) => !have.has(id));

  if (toRemove.length > 0) {
    const { error } = await supabase
      .from("client_facilities")
      .delete()
      .eq("client_id", clientId)
      .in("facility_id", toRemove);
    if (error) return error.message;
  }
  if (toAdd.length > 0) {
    const { error } = await supabase
      .from("client_facilities")
      .insert(toAdd.map((facility_id) => ({ client_id: clientId, facility_id })));
    if (error) return error.message;
  }
  return null;
}

export async function createClientAccount(formData: FormData) {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const short_code = formData.get("short_code") as string;
  const primary_contact_email = formData.get("primary_contact_email") as string;
  const primary_contact_name = formData.get("primary_contact_name") as string;
  const primary_contact_phone = formData.get("primary_contact_phone") as string;
  const organization_id = formData.get("organization_id") as string;
  const { facility_ids, default_facility_id } = parseAssignment(formData);

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
      default_facility_id,
      status: "active",
    })
    .select()
    .single();

  if (error) return { error: error.message };

  const syncError = await syncClientFacilities(supabase, data.id, organization_id, facility_ids);
  if (syncError) {
    // Don't leave a half-configured client behind
    await supabase.from("client_accounts").delete().eq("id", data.id);
    return { error: syncError };
  }

  revalidatePath("/dashboard/clients");
  return { data: { ...data, facility_ids } };
}

export async function updateClientAccount(id: string, formData: FormData) {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const short_code = formData.get("short_code") as string;
  const primary_contact_email = formData.get("primary_contact_email") as string;
  const primary_contact_name = formData.get("primary_contact_name") as string;
  const primary_contact_phone = formData.get("primary_contact_phone") as string;
  const { facility_ids, default_facility_id } = parseAssignment(formData);

  const { data: current, error: currentError } = await supabase
    .from("client_accounts")
    .select("organization_id")
    .eq("id", id)
    .single();
  if (currentError || !current) return { error: currentError?.message ?? "Client not found" };

  const syncError = await syncClientFacilities(supabase, id, current.organization_id, facility_ids);
  if (syncError) return { error: syncError };

  const { data, error } = await supabase
    .from("client_accounts")
    .update({
      name,
      short_code,
      primary_contact_email: primary_contact_email || null,
      primary_contact_name: primary_contact_name || null,
      primary_contact_phone: primary_contact_phone || null,
      default_facility_id,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) return { error: error.message };

  revalidatePath("/dashboard/clients");
  return { data: { ...data, facility_ids } };
}

export async function setClientStatus(id: string, status: "active" | "suspended") {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("client_accounts")
    .update({ status })
    .eq("id", id)
    .select("id, status")
    .single();

  if (error) return { error: error.message };

  revalidatePath("/dashboard/clients");
  return { data };
}

export async function deleteClientAccount(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("client_accounts").delete().eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/clients");
  return { success: true };
}
