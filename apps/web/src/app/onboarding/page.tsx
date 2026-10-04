import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { ToastError } from "@/components/ui/toast-error";
import { createOrganization } from "@/app/onboarding/actions";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Check if user already has an organization
  const { data: members } = await supabase
    .from("organization_members")
    .select("id")
    .eq("user_id", user.id)
    .limit(1);

  if (members && members.length > 0) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <ToastError />
      <div className="w-full max-w-md space-y-8 rounded-xl border border-border bg-card p-8 shadow-sm">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Welcome aboard!</h1>
          <p className="text-muted-foreground">
            Let's set up your first organization. You can invite team members later.
          </p>
        </div>

        <form action={createOrganization} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Organization Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Acme Logistics Inc."
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            className="inline-flex h-10 w-full items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
          >
            Create Organization
          </button>
        </form>
      </div>
    </div>
  );
}
