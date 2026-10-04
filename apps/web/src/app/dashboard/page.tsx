import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { getActiveWorkspaceContext } from "@/lib/org-context";
import {
  Building2,
  Users,
  ShieldCheck,
  Plus,
  ArrowRight,
  Warehouse,
  CheckCircle2,
  Clock,
  ChevronRight,
} from "lucide-react";

export default async function DashboardPage() {
  const context = await getActiveWorkspaceContext();
  if (!context || !context.activeOrg) {
    redirect("/onboarding");
  }

  const supabase = await createClient();
  const orgId = context.activeOrg.id;

  // Fetch counts for the active organization
  const [
    { count: facilitiesCount },
    { count: clientsCount },
    { count: membersCount },
    { count: floorWorkersCount },
  ] = await Promise.all([
    supabase.from("facilities").select("*", { count: "exact", head: true }).eq("organization_id", orgId),
    supabase.from("client_accounts").select("*", { count: "exact", head: true }).eq("organization_id", orgId),
    supabase.from("organization_members").select("*", { count: "exact", head: true }).eq("organization_id", orgId).eq("is_active", true),
    supabase.from("floor_worker_credentials").select("*", { count: "exact", head: true }).eq("organization_id", orgId).eq("is_active", true),
  ]);

  const canManage = ["owner", "admin", "ops_manager"].includes(context.role);

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {context.activeOrg.name} &bull; Timezone: {context.activeOrg.timezone || "UTC"} &bull; Role:{" "}
            <span className="capitalize font-medium text-foreground">
              {context.role.replace("_", " ")}
            </span>
          </p>
        </div>

        {canManage && (
          <div className="flex items-center gap-2.5">
            <Link
              href="/dashboard/facilities"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold shadow-sm transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Facility</span>
            </Link>
            <Link
              href="/dashboard/members"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-border bg-background hover:bg-surface text-foreground text-xs font-semibold transition-colors"
            >
              <span>Invite Member</span>
            </Link>
          </div>
        )}
      </div>

      {/* KPI Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Facilities KPI */}
        <Link
          href="/dashboard/facilities"
          className="group bg-card border border-border hover:border-border/80 rounded-xl p-5 shadow-sm transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Warehouses
            </span>
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-card-foreground">
              {facilitiesCount ?? 0}
            </span>
            <span className="text-xs text-muted-foreground">Active Facilities</span>
          </div>
          <div className="mt-3 text-xs text-muted-foreground group-hover:text-foreground font-medium flex items-center gap-1 transition-colors">
            <span>Manage facilities</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        {/* Client Accounts KPI */}
        <Link
          href="/dashboard/clients"
          className="group bg-card border border-border hover:border-border/80 rounded-xl p-5 shadow-sm transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Client Accounts
            </span>
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-card-foreground">
              {clientsCount ?? 0}
            </span>
            <span className="text-xs text-muted-foreground">Brands</span>
          </div>
          <div className="mt-3 text-xs text-muted-foreground group-hover:text-foreground font-medium flex items-center gap-1 transition-colors">
            <span>View client accounts</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        {/* Members & Staff KPI */}
        <Link
          href="/dashboard/members"
          className="group bg-card border border-border hover:border-border/80 rounded-xl p-5 shadow-sm transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Team Members
            </span>
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-card-foreground">
              {membersCount ?? 0}
            </span>
            <span className="text-xs text-muted-foreground">Active Staff</span>
          </div>
          <div className="mt-3 text-xs text-muted-foreground group-hover:text-foreground font-medium flex items-center gap-1 transition-colors">
            <span>Manage permissions</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        {/* Floor Workers KPI */}
        <Link
          href="/dashboard/members"
          className="group bg-card border border-border hover:border-border/80 rounded-xl p-5 shadow-sm transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Floor Workers
            </span>
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
              <Warehouse className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-card-foreground">
              {floorWorkersCount ?? 0}
            </span>
            <span className="text-xs text-muted-foreground">Badge Accounts</span>
          </div>
          <div className="mt-3 text-xs text-muted-foreground group-hover:text-foreground font-medium flex items-center gap-1 transition-colors">
            <span>Manage badges & PINs</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </Link>
      </div>

      {/* Main Content Split */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Facilities List */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2.5">
              <Building2 className="w-4 h-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold text-card-foreground">Warehouse Facilities</h2>
            </div>
            {canManage && (
              <Link
                href="/dashboard/facilities"
                className="text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                View all &rarr;
              </Link>
            )}
          </div>

          {context.facilities.length === 0 ? (
            <div className="py-8 text-center border border-dashed border-border rounded-lg">
              <p className="text-xs text-muted-foreground">No facilities registered yet.</p>
              {canManage && (
                <Link
                  href="/dashboard/facilities"
                  className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  <Plus className="w-3 h-3" /> Add first facility
                </Link>
              )}
            </div>
          ) : (
            <div className="divide-y divide-border">
              {context.facilities.slice(0, 5).map((f) => (
                <div key={f.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-medium text-card-foreground">{f.name}</div>
                    <div className="text-muted-foreground text-[11px] font-mono">
                      Code: {f.code} {f.city ? `• ${f.city}` : ""}
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground">
                    Active
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Links & Information */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 border-b border-border pb-3">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold text-card-foreground">Quick Actions</h2>
          </div>

          <div className="grid grid-cols-1 gap-2 text-xs">
            <Link
              href="/dashboard/facilities"
              className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
            >
              <div>
                <div className="font-medium text-card-foreground">Manage Facilities & Geocoding</div>
                <div className="text-muted-foreground text-[11px]">
                  Configure operating hours, carrier cutoffs, and addresses
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
            </Link>

            <Link
              href="/dashboard/clients"
              className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
            >
              <div>
                <div className="font-medium text-card-foreground">Client Account Assignments</div>
                <div className="text-muted-foreground text-[11px]">
                  Assign brand clients to serving facilities
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
            </Link>

            <Link
              href="/dashboard/members"
              className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
            >
              <div>
                <div className="font-medium text-card-foreground">Staff & Floor Workers</div>
                <div className="text-muted-foreground text-[11px]">
                  Invite teammates, create floor worker badges, and manage roles
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
