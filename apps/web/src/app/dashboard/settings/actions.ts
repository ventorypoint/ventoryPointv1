"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export interface SettingsResult {
  ok: boolean;
  error?: string;
  message?: string;
}

export async function updateOrganizationSettings(
  orgId: string,
  formData: FormData
): Promise<SettingsResult> {
  const name = (formData.get("name") as string || "").trim();
  const country = (formData.get("country") as string || "").trim();
  const timezone = (formData.get("timezone") as string || "").trim();
  const currency = (formData.get("currency") as string || "").trim();

  if (!name) {
    return { ok: false, error: "Organization name is required." };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("organizations")
    .update({
      name,
      country: country || "US",
      timezone: timezone || "America/New_York",
      default_currency: currency || "USD",
      updated_at: new Date().toISOString(),
    })
    .eq("id", orgId);

  if (error) {
    return { ok: false, error: error.message || "Failed to update organization settings." };
  }

  revalidatePath("/", "layout");
  return { ok: true, message: "Organization settings updated successfully." };
}
