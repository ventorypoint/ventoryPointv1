import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { getClientIp, getPendingInvite, PENDING_INVITE_COOKIE } from "@/lib/invite";

/**
 * Redeems the invite stored in the pending_invite cookie for the signed-in user.
 * A route handler (not a page) because it needs to clear the cookie.
 */
export async function GET(request: Request) {
  const { origin } = new URL(request.url);
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(`${origin}/login?invite=1`);
  }

  const pending = await getPendingInvite();
  if (!pending) {
    return NextResponse.redirect(`${origin}/dashboard`);
  }

  const { data, error } = await supabase.rpc("redeem_invitation", {
    p_code: pending.code ?? null,
    p_token: pending.token ?? null,
    p_ip: await getClientIp(),
  });

  const store = await cookies();

  if (error || !data?.ok) {
    // Rate-limited: keep the cookie so they can retry after the cooldown. Anything else is final.
    if (!data?.rate_limited) store.delete(PENDING_INVITE_COOKIE);
    const message = data?.error || error?.message || "Could not join the workspace.";
    return NextResponse.redirect(`${origin}/join?message=${encodeURIComponent(message)}`);
  }

  store.delete(PENDING_INVITE_COOKIE);

  if (data.pending) {
    return NextResponse.redirect(`${origin}/revoked?reason=pending`);
  }
  return NextResponse.redirect(`${origin}/dashboard`);
}
