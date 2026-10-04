"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function createFloorWorkerAction(formData: FormData) {
  const supabase = await createClient();

  const organization_id = formData.get("organization_id") as string;
  const first_name = (formData.get("first_name") as string || "").trim();
  const last_name = (formData.get("last_name") as string || "").trim();
  const pin = (formData.get("pin") as string || "").trim();
  const scope = formData.get("facility_scope") as string;
  const all_facilities = scope !== "specific";
  const facility_ids = formData.getAll("facility_ids").map(String);

  if (!organization_id || !first_name || !pin) {
    return { error: "First name, PIN, and organization are required." };
  }

  if (pin.length < 4 || pin.length > 6 || !/^\d+$/.test(pin)) {
    return { error: "PIN must be between 4 and 6 numeric digits." };
  }

  const { data, error } = await supabase.rpc("create_floor_worker", {
    p_organization_id: organization_id,
    p_first_name: first_name,
    p_last_name: last_name,
    p_pin: pin,
    p_all_facilities: all_facilities,
    p_facility_ids: all_facilities ? [] : facility_ids,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/members");
  return { data };
}

export async function reissueFloorBadgeAction(memberId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("reissue_floor_badge", {
    p_member_id: memberId,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/members");
  return { data };
}

export async function updateFloorWorkerPinAction(memberId: string, newPin: string) {
  const supabase = await createClient();

  const cleanPin = (newPin || "").trim();
  if (cleanPin.length < 4 || cleanPin.length > 6 || !/^\d+$/.test(cleanPin)) {
    return { error: "PIN must be between 4 and 6 numeric digits." };
  }

  const { error } = await supabase.rpc("update_floor_worker_pin", {
    p_member_id: memberId,
    p_new_pin: cleanPin,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/members");
  return { success: true };
}
