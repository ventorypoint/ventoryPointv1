import { AppShell } from "@/components/app-shell";
import { getActiveWorkspaceContext } from "@/lib/org-context";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const context = await getActiveWorkspaceContext();

  if (!context) {
    redirect("/onboarding");
  }

  return <AppShell context={context}>{children}</AppShell>;
}
