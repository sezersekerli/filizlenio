"use client";

import { Logo } from "@/components/brand/Logo";
import { AppBackground } from "@/components/effects/AppBackground";
import { logoutUser } from "@/lib/auth/client";
import { cn } from "@/lib/utils";
import { PLAN_LABELS } from "@filizlen/shared";
import {
  CalendarCheck,
  LayoutDashboard,
  LogOut,
  Map,
  Package,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const nav = [
  { href: "/dashboard", label: "Panel", shortLabel: "Panel", icon: LayoutDashboard },
  { href: "/farm", label: "Tarla yönetimi", shortLabel: "Tarla", icon: CalendarCheck },
  { href: "/parcels", label: "Parseller", shortLabel: "Parsel", icon: Map },
  { href: "/packages", label: "Paketler", shortLabel: "Paket", icon: Package },
] as const;

function NavLinks({
  pathname,
  onNavigate,
  layout = "sidebar",
}: {
  pathname: string;
  onNavigate?: () => void;
  layout?: "sidebar" | "bottom";
}) {
  return (
    <>
      {nav.map(({ href, label, shortLabel, icon: Icon }) => {
        const active = pathname.startsWith(href);
        const displayLabel = layout === "bottom" ? shortLabel : label;
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              "relative flex items-center justify-center transition-colors",
              layout === "bottom"
                ? "flex-col gap-0.5 min-w-[4.25rem] min-h-[44px] px-2 py-1.5 text-[10px] font-medium"
                : "gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium",
              active
                ? "text-primary"
                : "text-muted hover:text-foreground hover:bg-white/5",
              layout === "sidebar" && "rounded-xl",
            )}
          >
            {active && layout === "sidebar" && (
              <span className="absolute inset-0 rounded-xl bg-primary/12 border border-primary/20" />
            )}
            {active && layout === "bottom" && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-primary" />
            )}
            <Icon
              className={cn(
                "relative z-10 shrink-0",
                layout === "bottom" ? "w-5 h-5" : "w-4 h-4",
              )}
            />
            <span className="relative z-10 leading-tight text-center">{displayLabel}</span>
          </Link>
        );
      })}
    </>
  );
}

export function AppShell({
  children,
  displayName,
  plan = "free",
}: {
  children: React.ReactNode;
  displayName?: string | null;
  plan?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    await logoutUser();
    router.push("/login");
    router.refresh();
  }

  const initials = displayName
    ? displayName
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "FL";

  const planLabel = PLAN_LABELS[plan] ?? plan;

  return (
    <div className="min-h-[100dvh] relative">
      <AppBackground subtle />

      <div className="flex min-h-[100dvh]">
        <aside className="hidden md:flex md:w-64 md:flex-col sidebar-glass fixed inset-y-0 left-0 z-30">
          <div className="p-5 flex-1 flex flex-col">
            <Link href="/dashboard" className="block mb-10 group">
              <Logo variant="full" href={null} className="min-w-0 max-w-[220px]" />
            </Link>

            <nav className="space-y-1">
              <NavLinks pathname={pathname} layout="sidebar" />
            </nav>

            <div className="mt-auto pt-6 border-t border-[var(--card-border)]">
              <div className="flex items-center gap-3 px-2 mb-4">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/30 to-accent/20 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary">
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{displayName ?? "Kullanıcı"}</p>
                  <p className="text-[10px] text-muted">{planLabel} plan</p>
                </div>
              </div>
              <button
                type="button"
                onClick={signOut}
                className="flex w-full items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-muted hover:text-foreground hover:bg-white/5 transition-colors min-h-[44px]"
              >
                <LogOut className="w-4 h-4" />
                Çıkış
              </button>
            </div>
          </div>
        </aside>

        <div className="md:hidden fixed top-0 inset-x-0 z-40 sidebar-glass border-b border-[var(--card-border)] pt-safe">
          <div className="flex items-center justify-between px-3 h-14">
            <Logo variant="full" href="/dashboard" className="h-7 min-w-0 max-w-[160px]" />
            <button
              type="button"
              onClick={signOut}
              className="p-2.5 text-muted min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Çıkış"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        <main className="flex-1 md:ml-64 pt-[calc(3.5rem+env(safe-area-inset-top,0px))] md:pt-0 pb-[calc(4.25rem+env(safe-area-inset-bottom,0px))] md:pb-0">
          <div className="p-3 sm:p-5 md:p-8 lg:p-10 max-w-6xl mx-auto page-stack">{children}</div>
        </main>

        <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 sidebar-glass border-t border-[var(--card-border)] px-1 pb-safe pt-0.5">
          <div className="flex justify-around items-stretch">
            <NavLinks pathname={pathname} layout="bottom" />
          </div>
        </nav>
      </div>
    </div>
  );
}
