import { createClient } from "@supabase/supabase-js";

/**
 * Service-role client. Server-only: never import this in a client component.
 * Used solely for pre-auth operations (e.g. validating an invite code before the visitor has an account).
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}
