import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch the user's organizations
  const { data: members } = await supabase
    .from("organization_members")
    .select("*, organizations(*)")
    .eq("user_id", user.id)
    .eq("is_active", true);

  const orgs = members?.map(m => m.organizations) || [];

  if (orgs.length === 0) {
    redirect("/onboarding");
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Welcome, {user.user_metadata?.first_name || 'User'} 👋</h1>
          <p className="text-muted-foreground mt-1">Here's what needs your attention today across your organizations.</p>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {orgs.length === 0 ? (
          <div className="col-span-full p-8 text-center bg-background border border-border rounded-xl">
            <p className="text-muted-foreground">You don't belong to any organizations yet.</p>
          </div>
        ) : (
          orgs.map((org: any, index: number) => {
            const role = members?.find(m => m.organization_id === org.id)?.role;
            // Generate some background gradients based on index to match the reference design vibe
            const gradients = [
              "bg-gradient-to-br from-emerald-400 to-emerald-600",
              "bg-gradient-to-br from-blue-400 to-blue-600",
              "bg-gradient-to-br from-orange-400 to-orange-500",
              "bg-gradient-to-br from-purple-400 to-brand"
            ];
            const bgClass = gradients[index % gradients.length];
            
            return (
              <div key={org.id} className={`relative overflow-hidden rounded-2xl ${bgClass} p-6 text-white shadow-md`}>
                {/* Decorative background circles */}
                <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-white/10 blur-2xl"></div>
                <div className="absolute -bottom-8 -right-8 w-40 h-40 rounded-full bg-black/10 blur-xl"></div>
                
                <div className="relative z-10 flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/10">
                    <span className="text-2xl font-bold">{org.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <div className="text-3xl font-bold leading-none">{role === 'owner' ? 'Owner' : 'Member'}</div>
                    <div className="text-white/80 text-sm font-medium mt-1">{org.name}</div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
