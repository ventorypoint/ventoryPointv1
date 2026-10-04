"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Building, Settings, Menu, Bell, Search, Hexagon, ChevronLeft, ChevronRight, X } from "lucide-react";
import { ThemeToggle } from "./ui/theme-toggle";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isPinned, setIsPinned] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isCollapsed = !isPinned && !isHovered;

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Facilities', href: '/dashboard/facilities', icon: Building },
    { name: 'Clients', href: '/dashboard/clients', icon: Users },
    { name: 'Members', href: '/dashboard/members', icon: Users },
  ];

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
          className="hidden lg:flex absolute -right-3 top-5 items-center justify-center w-6 h-6 bg-surface border border-border rounded-full text-gray-400 hover:text-brand hover:border-brand/50 transition-colors z-50 shadow-sm"
        >
          {isPinned ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
          <div className="flex items-center gap-3 text-brand font-bold text-xl tracking-tight overflow-hidden whitespace-nowrap">
            <Hexagon className="w-8 h-8 shrink-0 fill-brand text-brand" />
            {!isCollapsed && <span>VentoryPoint</span>}
          </div>
          <button 
            className="lg:hidden text-gray-500 hover:text-brand"
            onClick={() => setIsMobileOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-hide">
          {!isCollapsed && (
            <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-3 px-3">
              Overview
            </div>
          )}
          {navigation.map((item) => {
            const isActive = item.href === '/dashboard' 
              ? pathname === '/dashboard' 
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
                <div className={`flex items-center justify-center p-1 rounded-md transition-colors ${isActive ? 'bg-white shadow-sm' : 'group-hover:bg-white group-hover:shadow-sm'}`}>
                  <item.icon className={`w-4 h-4 shrink-0 text-brand`} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border flex flex-col gap-2">
          <Link
            href="/dashboard/settings"
            className={`group flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100/80 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-100 transition-all duration-200 ${
              isCollapsed ? "justify-center px-0" : ""
            }`}
            title={isCollapsed ? "Settings" : undefined}
          >
            <div className="flex items-center justify-center p-1 rounded-md transition-colors group-hover:bg-white dark:group-hover:bg-gray-700 group-hover:shadow-sm">
              <Settings className="w-4 h-4 shrink-0 text-brand" strokeWidth={2} />
            </div>
            {!isCollapsed && <span>Settings</span>}
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-background border-b border-border flex items-center justify-between px-4 lg:px-6 shrink-0">
          <div className="flex items-center gap-3">
            <button 
              className="lg:hidden text-gray-500 hover:text-brand"
              onClick={() => setIsMobileOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="relative hidden sm:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-brand/50" />
              <input 
                type="text" 
                placeholder="Quick Actions or Search..." 
                className="pl-9 pr-4 py-1.5 text-sm bg-surface border border-border rounded-full w-48 md:w-64 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3 lg:gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-surface border border-border rounded-full text-xs font-medium text-gray-600">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              System Operational
            </div>
            <button className="text-gray-500 hover:text-brand relative p-1 transition-colors">
              <Bell className="w-5 h-5 text-brand/70" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-background"></span>
            </button>
            <ThemeToggle />
            <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center font-bold text-sm shadow-sm cursor-pointer hover:bg-brand/90 transition-colors">
              VP
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
