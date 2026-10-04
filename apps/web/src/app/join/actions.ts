"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { getClientIp, setPendingInvite } from "@/lib/invite";

/** Step 1 of redeeming a typed workspace code: validate (rate-limited), then remember it. */
export async function submitInviteCode(formData: FormData) {
  const code = ((formData.get("code") as string) || "").trim();
  if (!code) {
    return redirect("/join?message=" + encodeURIComponent("Please enter an invite code."));
  }

  let redirectTo: string | null = null;
  try {
    const admin = createAdminClient();
    const { data, error } = await admin.rpc("validate_invitation", {
      p_code: code,
      p_token: null,
      p_ip: await getClientIp(),
    });

    if (error || !data?.ok) {
      const message = data?.error || error?.message || "Invalid or expired invite code.";
      return redirect("/join?message=" + encodeURIComponent(message));
    }

    await setPendingInvite({ code });

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Signed in => redeem straight away. Otherwise create an account first.
    redirectTo = user ? "/join/complete" : "/register?invite=1";
  } catch (err: any) {
    // Next.js redirect throws a NEXT_REDIRECT digest error which must be rethrown
    if (err?.digest?.startsWith("NEXT_REDIRECT")) {
      throw err;
    }
    return redirect("/join?message=" + encodeURIComponent(err?.message || "Unable to validate invitation."));
  }

  if (redirectTo) {
    redirect(redirectTo);
  }
}

/** Used by the /invite?token= landing page buttons. */
export async function acceptInviteLink(formData: FormData) {
  const token = formData.get("token") as string;
  const next = formData.get("next") as string; // "complete" | "register" | "login"
  if (!token) return redirect("/join?message=" + encodeURIComponent("Invalid invitation link."));

  await setPendingInvite({ token });
  if (next === "complete") redirect("/join/complete");
  if (next === "login") redirect("/login?invite=1");
  redirect("/register?invite=1");
}
