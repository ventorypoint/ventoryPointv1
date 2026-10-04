import { cookies, headers } from "next/headers";

export const PENDING_INVITE_COOKIE = "pending_invite";

export type PendingInvite = { code?: string; token?: string };

export async function setPendingInvite(invite: PendingInvite) {
  const store = await cookies();
  store.set(PENDING_INVITE_COOKIE, JSON.stringify(invite), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 30, // 30 minutes to finish signing up / signing in
  });
}

export async function getPendingInvite(): Promise<PendingInvite | null> {
  const store = await cookies();
  const raw = store.get(PENDING_INVITE_COOKIE)?.value;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return parsed && (parsed.code || parsed.token) ? parsed : null;
  } catch {
    return null;
  }
}

export async function hasPendingInvite() {
  return (await getPendingInvite()) !== null;
}

export async function getClientIp() {
  const h = await headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown"
  );
}
