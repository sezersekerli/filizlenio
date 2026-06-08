"use client";

import { Logo } from "@/components/brand/Logo";
import { AppBackground } from "@/components/effects/AppBackground";
import { logoutUser } from "@/lib/auth/client";
import { cn } from "@/lib/utils";
import { PLAN_LABELS } from "@filizlen/shared";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarCheck,
  LayoutDashboard,
  LogOut,
  Map,
  Menu,
  Package,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const nav = [
  { href: "/dashboard", label: "Panel", icon: LayoutDashboard },
  { href: "/farm", label: "Tarla yönetimi", icon: CalendarCheck },
  { href: "/parcels", label: "Parseller", icon: Map },
  { href: "/packages", label: "Paketler", icon: Package },
];

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
      {nav.map(({ href, label, icon: Icon }) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              "relative flex items-center gap-2.5 rounded-xl text-sm font-medium transition-colors",
              layout === "bottom"
                ? "flex-col gap-1 px-3 py-2 text-[10px]"
                : "px-3 py-2.5",
              active
                ? "text-primary"
                : "text-muted hover:text-foreground hover:bg-white/5",
            )}
          >
            {active && layout === "sidebar" && (
              <motion.span
                layoutId="nav-active"
                className="absolute inset-0 rounded-xl bg-primary/12 border border-primary/20"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <Icon className={cn("relative z-10", layout === "bottom" ? "w-5 h-5" : "w-4 h-4")} />
            <span className="relative z-10">{label}</span>
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
  const [mobileOpen, setMobileOpen] = useState(false);

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
    <div className="min-h-screen relative">
      <AppBackground subtle />

      <div className="flex min-h-screen">
        {/* Desktop sidebar */}
        <aside className="hidden md:flex md:w-64 md:flex-col sidebar-glass fixed inset-y-0 left-0 z-30">
          <div className="p-5 flex-1 flex flex-col">
            <Link href="/dashboard" className="block mb-10 group">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Logo variant="full" href={null} className="min-w-0 max-w-[220px]" />
              </motion.div>
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
                className="flex w-full items-center gap-2 px-3 py-2 rounded-xl text-sm text-muted hover:text-foreground hover:bg-white/5 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Çıkış
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile header */}
        <div className="md:hidden fixed top-0 inset-x-0 z-40 sidebar-glass border-b border-[var(--card-border)]">
          <div className="flex items-center justify-between px-4 h-14">
            <Logo variant="full" href="/dashboard" className="h-8 min-w-0 max-w-[180px]" />
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="p-2 text-muted"
              aria-label="Menü"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                onClick={() => setMobileOpen(false)}
              />
              <motion.aside
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 28, stiffness: 320 }}
                className="md:hidden fixed inset-y-0 right-0 z-50 w-72 sidebar-glass p-5 flex flex-col"
              >
                <div className="flex justify-between items-center mb-8">
                  <span className="font-semibold">Menü</span>
                  <button type="button" onClick={() => setMobileOpen(false)} aria-label="Kapat">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <nav className="space-y-1 flex-1">
                  <NavLinks
                    pathname={pathname}
                    layout="sidebar"
                    onNavigate={() => setMobileOpen(false)}
                  />
                </nav>
                <button
                  type="button"
                  onClick={signOut}
                  className="flex items-center gap-2 text-sm text-muted mt-4"
                >
                  <LogOut className="w-4 h-4" />
                  Çıkış
                </button>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        <main className="flex-1 md:ml-64 pt-14 md:pt-0 pb-20 md:pb-0">
          <div className="p-4 md:p-8 lg:p-10 max-w-6xl mx-auto">{children}</div>
        </main>

        {/* Mobile bottom nav */}
        <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 sidebar-glass border-t border-[var(--card-border)] px-2 pb-safe">
          <div className="flex justify-around py-2">
            <NavLinks pathname={pathname} layout="bottom" />
          </div>
        </nav>
      </div>
    </div>
  );
}
