"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

type Hours = Record<string, { closed: boolean; open: string; close: string }>;
type Cutoff = { carrier: string; time: string };

const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

function str(formData: FormData, key: string) {
  const v = (formData.get(key) as string | null)?.trim();
  return v ? v : null;
}

function num(formData: FormData, key: string) {
  const raw = str(formData, key);
  if (raw === null) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : NaN;
}

function parseJson<T>(formData: FormData, key: string): T | null {
  const raw = formData.get(key) as string | null;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/** Allow-listed, validated facility fields. Never reads organization_id for updates. */
function parseFacilityFields(formData: FormData) {
  const latitude = num(formData, "latitude");
  const longitude = num(formData, "longitude");
  if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
    return { error: "Latitude and longitude must be numbers." } as const;
  }
  if ((latitude !== null && (latitude < -90 || latitude > 90)) || (longitude !== null && (longitude < -180 || longitude > 180))) {
    return { error: "Latitude/longitude are out of range." } as const;
  }
  if ((latitude === null) !== (longitude === null)) {
    return { error: "Provide both latitude and longitude, or neither." } as const;
  }

  const hoursIn = parseJson<Hours>(formData, "operating_hours");
  let operating_hours: Hours | null = null;
  if (hoursIn) {
    operating_hours = {};
    for (const day of DAYS) {
      const d = hoursIn[day];
      if (!d) continue;
      if (!d.closed && (!TIME_RE.test(d.open) || !TIME_RE.test(d.close))) {
        return { error: `Invalid opening hours for ${day.toUpperCase()}.` } as const;
      }
      if (!d.closed && d.open >= d.close) {
        return { error: `${day.toUpperCase()}: closing time must be after opening time.` } as const;
      }
      operating_hours[day] = { closed: !!d.closed, open: d.open, close: d.close };
    }
  }

  const cutoffsIn = parseJson<Cutoff[]>(formData, "carrier_cutoffs") ?? [];
  const carrier_cutoffs: Cutoff[] = [];
  for (const c of cutoffsIn) {
    const carrier = (c.carrier || "").trim();
    if (!carrier && !c.time) continue; // blank row
    if (!carrier || !TIME_RE.test(c.time)) {
      return { error: "Each carrier cutoff needs a carrier name and a valid time." } as const;
    }
    carrier_cutoffs.push({ carrier, time: c.time });
  }

  const requestedStatus = str(formData, "geocode_status");
  const geocode_status =
    latitude === null
      ? "unverified"
      : requestedStatus === "verified" || requestedStatus === "manual"
      ? requestedStatus
      : "manual";

  return {
    fields: {
      name: str(formData, "name"),
      short_code: str(formData, "short_code"),
      timezone: str(formData, "timezone") || "UTC",
      address: str(formData, "address"),
      city: str(formData, "city"),
      state: str(formData, "state"),
      zip_code: str(formData, "zip_code"),
      county: str(formData, "county"),
      country: str(formData, "country"),
      latitude,
      longitude,
      geocode_status,
      geocoded_at: latitude === null ? null : new Date().toISOString(),
      operating_hours,
      carrier_cutoffs,
    },
  } as const;
}

export async function createFacility(formData: FormData) {
  const supabase = await createClient();
  const organization_id = formData.get("organization_id") as string;

  const parsed = parseFacilityFields(formData);
  if ("error" in parsed) return { error: parsed.error };

  if (!parsed.fields.name || !parsed.fields.short_code || !organization_id) {
    return { error: "Missing required fields" };
  }

  const { data, error } = await supabase
    .from("facilities")
    .insert({ organization_id, ...parsed.fields })
    .select()
    .single();

  if (error) return { error: error.message };

  revalidatePath("/dashboard/facilities");
  return { data };
}

export async function updateFacility(id: string, formData: FormData) {
  const supabase = await createClient();

  const parsed = parseFacilityFields(formData);
  if ("error" in parsed) return { error: parsed.error };
  if (!parsed.fields.name || !parsed.fields.short_code) {
    return { error: "Missing required fields" };
  }

  const { data, error } = await supabase
    .from("facilities")
    .update(parsed.fields)
    .eq("id", id)
    .select()
    .single();

  if (error) return { error: error.message };

  revalidatePath("/dashboard/facilities");
  return { data };
}

export async function deleteFacility(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("facilities").delete().eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/facilities");
  return { success: true };
}

export type GeocodeResult =
  | {
      ok: true;
      latitude: number;
      longitude: number;
      city: string | null;
      state: string | null;
      zip_code: string | null;
      county: string | null;
      country: string | null;
      display_name: string;
    }
  | { ok: false; error: string };

/**
 * Geocodes a free-text address via OpenStreetMap Nominatim (no API key, ~1 req/sec fair-use limit).
 * Swap the fetch for Google/Mapbox here later without touching the UI.
 */
export async function geocodeAddress(address: string): Promise<GeocodeResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not authenticated" };

  const q = address.trim();
  if (q.length < 5) return { ok: false, error: "Enter a fuller address first." };

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=1&q=${encodeURIComponent(q)}`,
      {
        headers: { "User-Agent": "VentoryPoint/1.0 (facility geocoding)", Accept: "application/json" },
        cache: "no-store",
      }
    );
    if (!res.ok) return { ok: false, error: "Geocoding service unavailable. Enter coordinates manually." };

    const results = (await res.json()) as any[];
    if (!results.length) {
      return { ok: false, error: "We couldn't verify this address. Check it, or enter coordinates manually." };
    }

    const r = results[0];
    const a = r.address || {};
    return {
      ok: true,
      latitude: Number(r.lat),
      longitude: Number(r.lon),
      city: a.city || a.town || a.village || a.hamlet || null,
      state: a.state || null,
      zip_code: a.postcode || null,
      county: a.county || null,
      country: a.country_code ? String(a.country_code).toUpperCase() : null,
      display_name: r.display_name,
    };
  } catch {
    return { ok: false, error: "Geocoding failed. Enter coordinates manually." };
  }
}
