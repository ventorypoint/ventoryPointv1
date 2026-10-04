import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { hasPendingInvite } from "@/lib/invite";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const nextParam = searchParams.get("next");
  // Only allow same-site relative redirects
  const next = nextParam && nextParam.startsWith("/") && !nextParam.startsWith("//") ? nextParam : null;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Explicit destinations (e.g. /reset-password) win over the membership routing below.
      if (next) {
        return NextResponse.redirect(`${origin}${next}`);
      }

      // Social sign-in during an invite flow: redeem the invite instead of onboarding.
      if (await hasPendingInvite()) {
        return NextResponse.redirect(`${origin}/join/complete`);
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: members } = await supabase
          .from("organization_members")
          .select("id")
          .eq("user_id", user.id)
          .limit(1);

        if (!members || members.length === 0) {
          return NextResponse.redirect(`${origin}/onboarding`);
        }
      }
      return NextResponse.redirect(`${origin}/dashboard`);
    }
  }

  return NextResponse.redirect(`${origin}/login?message=Could not authenticate`);
}
