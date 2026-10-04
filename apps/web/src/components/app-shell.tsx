"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Building,
  Settings,
  Menu,
  Bell,
  Search,
  Hexagon,
  ChevronLeft,
  ChevronRight,
  X,
  LogOut,
  Shield,
  Smartphone,
} from "lucide-react";
import { ThemeToggle } from "./ui/theme-toggle";
import { WorkspaceSwitcher } from "./workspace-switcher";
import type { WorkspaceContext } from "@/lib/org-context-types";
import { createClient } from "@/utils/supabase/client";

interface AppShellProps {
  children: React.ReactNode;
  context?: WorkspaceContext | null;
}

export function AppShell({ children, context }: AppShellProps) {
  const pathname = usePathname();
  const [isPinned, setIsPinned] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const isCollapsed = !isPinned && !isHovered;
  const userRole = context?.role || "member";

  // Role-Aware Navigation
  const allNavigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["owner", "admin", "ops_manager", "supervisor", "floor_worker", "billing", "client_user"] },
    { name: "Facilities", href: "/dashboard/facilities", icon: Building, roles: ["owner", "admin", "ops_manager", "supervisor"] },
    { name: "Clients", href: "/dashboard/clients", icon: Users, roles: ["owner", "admin", "ops_manager", "supervisor", "billing"] },
    { name: "Members", href: "/dashboard/members", icon: Shield, roles: ["owner", "admin", "ops_manager"] },
  ];

  const filteredNavigation = allNavigation.filter((item) =>
    item.roles.includes(userRole)
  );

  const canAccessSettings = ["owner", "admin", "billing"].includes(userRole);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const userInitials =
    context?.user?.firstName && context?.user?.lastName
      ? `${context.user.firstName[0]}${context.user.lastName[0]}`.toUpperCase()
      : context?.user?.email?.slice(0, 2).toUpperCase() || "VP";

  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`relative fixed inset-y-0 left-0 z-50 flex flex-col bg-background border-r border-border transition-all duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isCollapsed ? "w-20" : "w-64"
        } ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Floating Desktop Collapse Toggle */}
        <button
          onClick={() => setIsPinned(!isPinned)}
          className="hidden lg:flex absolute -right-3 top-5 items-center justify-center w-6 h-6 bg-surface border border-border rounded-full text-gray-400 hover:text-brand hover:border-brand/50 transition-colors z-50 shadow-sm cursor-pointer"
        >
          {isPinned ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        {/* Logo Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
          <Link href="/dashboard" className="flex items-center gap-3 text-brand font-bold text-xl tracking-tight overflow-hidden whitespace-nowrap">
            <Hexagon className="w-8 h-8 shrink-0 fill-brand text-brand" />
            {!isCollapsed && <span>VentoryPoint</span>}
          </Link>
          <button
            className="lg:hidden text-gray-500 hover:text-brand cursor-pointer"
            onClick={() => setIsMobileOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Workspace Organization & Facility Switcher */}
        {context && (
          <WorkspaceSwitcher
            organizations={context.organizations}
            activeOrg={context.activeOrg}
            facilities={context.facilities}
            activeFacilityId={context.activeFacilityId}
            isCollapsed={isCollapsed}
          />
        )}

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-hide">
          {!isCollapsed && (
            <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-3 px-3">
              Management
            </div>
          )}
          {filteredNavigation.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-purple-50 dark:bg-brand/10 text-brand shadow-sm ring-1 ring-purple-100 dark:ring-brand/20"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100/80 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-100"
                } ${isCollapsed ? "justify-center px-0" : ""}`}
                title={isCollapsed ? item.name : undefined}
              >
                <div
                  className={`flex items-center justify-center p-1 rounded-md transition-colors ${
                    isActive ? "bg-white shadow-sm" : "group-hover:bg-white group-hover:shadow-sm"
                  }`}
                >
                  <item.icon className="w-4 h-4 shrink-0 text-brand" strokeWidth={isActive ? 2.5 : 2} />
                </div>
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer actions / Settings */}
        <div className="p-3 border-t border-border flex flex-col gap-1">
          {/* Quick link to Floor Terminal */}
          <Link
            href="/floor-login"
            className={`group flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-all ${
              isCollapsed ? "justify-center px-0" : ""
            }`}
            title={isCollapsed ? "Floor Terminal" : undefined}
          >
            <div className="flex items-center justify-center p-1 rounded-md transition-colors">
              <Smartphone className="w-4 h-4 shrink-0 text-indigo-500" />
            </div>
            {!isCollapsed && <span>Floor Terminal</span>}
          </Link>

          {canAccessSettings && (
            <Link
              href="/dashboard/settings"
              className={`group flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                pathname.startsWith("/dashboard/settings")
                  ? "bg-purple-50 dark:bg-brand/10 text-brand font-semibold"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100/80 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-100"
              } ${isCollapsed ? "justify-center px-0" : ""}`}
              title={isCollapsed ? "Settings" : undefined}
            >
              <div className="flex items-center justify-center p-1 rounded-md transition-colors">
                <Settings className="w-4 h-4 shrink-0 text-brand" strokeWidth={2} />
              </div>
              {!isCollapsed && <span>Settings</span>}
            </Link>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-background border-b border-border flex items-center justify-between px-4 lg:px-6 shrink-0">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden text-gray-500 hover:text-brand cursor-pointer"
              onClick={() => setIsMobileOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="relative hidden sm:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-brand/50" />
              <input
                type="text"
                placeholder="Search facilities, clients, SKUs..."
                className="pl-9 pr-4 py-1.5 text-sm bg-surface border border-border rounded-full w-48 md:w-64 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 lg:gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-surface border border-border rounded-full text-xs font-medium text-gray-600 dark:text-gray-300">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span>{context?.activeOrg?.name || "Live"}</span>
              <span className="text-muted-foreground">•</span>
              <span className="capitalize font-semibold text-brand">
                {userRole.replace("_", " ")}
              </span>
            </div>

            <button className="text-gray-500 hover:text-brand relative p-1 transition-colors cursor-pointer">
              <Bell className="w-5 h-5 text-brand/70" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-background"></span>
            </button>

            <ThemeToggle />

            {/* User Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center font-bold text-xs shadow-sm cursor-pointer hover:bg-brand/90 transition-colors"
              >
                {userInitials}
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-background border border-border rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-border">
                    <p className="text-xs font-semibold text-foreground truncate">
                      {context?.user?.firstName} {context?.user?.lastName}
                    </p>
                    <p className="text-[11px] text-muted-foreground truncate font-mono">
                      {context?.user?.email}
                    </p>
                    <span className="inline-block mt-1 text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-brand/10 text-brand">
                      {userRole.replace("_", " ")}
                    </span>
                  </div>

                  {canAccessSettings && (
                    <Link
                      href="/dashboard/settings"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs text-foreground hover:bg-surface-hover transition-colors"
                    >
                      <Settings className="w-3.5 h-3.5 text-muted-foreground" />
                      <span>Organization Settings</span>
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5 text-red-500" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto bg-surface p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
