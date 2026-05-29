import { AppShell } from "@/components/layout/AppShell";
import { getSessionUser } from "@/lib/auth/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  return (
    <AppShell displayName={user.displayName ?? user.email}>
      {children}
    </AppShell>
  );
}
