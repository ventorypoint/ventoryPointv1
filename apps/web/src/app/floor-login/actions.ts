"use server";

import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export interface FloorWorkerSession {
  member_id: string;
  worker_code: string;
  first_name: string;
  last_name: string;
  organization_id: string;
  organization_name: string;
  all_facilities: boolean;
  login_at: string;
}

export interface FloorLoginResult {
  ok: boolean;
  error?: string;
  locked?: boolean;
  session?: FloorWorkerSession;
}

export async function loginFloorWorker(
  badgeToken: string,
  pin: string,
  deviceToken?: string
): Promise<FloorLoginResult> {
  const cleanBadge = (badgeToken || "").trim();
  const cleanPin = (pin || "").trim();

  if (!cleanBadge) {
    return { ok: false, error: "Please scan your badge or enter your badge token." };
  }
  if (!cleanPin || cleanPin.length < 4 || cleanPin.length > 6 || !/^\d+$/.test(cleanPin)) {
    return { ok: false, error: "Please enter a 4 to 6 digit numeric PIN." };
  }

  const supabase = await createClient();

  // Call security definer RPC
  const { data, error } = await supabase.rpc("floor_worker_login", {
    p_badge_token: cleanBadge,
    p_pin: cleanPin,
    p_device_token: deviceToken || null,
  });

  if (error) {
    return { ok: false, error: error.message || "Authentication failed. Please try again." };
  }

  const res = data as {
    ok: boolean;
    error?: string;
    locked?: boolean;
    worker_code?: string;
    first_name?: string;
    last_name?: string;
    organization_id?: string;
    organization_name?: string;
    member_id?: string;
    all_facilities?: boolean;
  };

  if (!res || !res.ok) {
    return {
      ok: false,
      error: res?.error || "Invalid credentials.",
      locked: res?.locked || false,
    };
  }

  const session: FloorWorkerSession = {
    member_id: res.member_id!,
    worker_code: res.worker_code!,
    first_name: res.first_name || "Floor",
    last_name: res.last_name || "Worker",
    organization_id: res.organization_id!,
    organization_name: res.organization_name || "Organization",
    all_facilities: res.all_facilities ?? true,
    login_at: new Date().toISOString(),
  };

  // Set 12-hour shift cookie
  const cookieStore = await cookies();
  cookieStore.set("vp_floor_session", JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 12 * 60 * 60, // 12 hours shift duration
  });

  return { ok: true, session };
}

export async function getFloorWorkerSession(): Promise<FloorWorkerSession | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("vp_floor_session");
  if (!sessionCookie?.value) return null;

  try {
    const parsed = JSON.parse(sessionCookie.value) as FloorWorkerSession;
    return parsed;
  } catch {
    return null;
  }
}

export async function logoutFloorWorker() {
  const cookieStore = await cookies();
  cookieStore.delete("vp_floor_session");
}
