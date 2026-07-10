"use client";

import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export type MobileSubNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
  badge?: number;
};

export function MobileSubNav({ items }: { items: MobileSubNavItem[] }) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "sticky z-20 -mx-3 px-3 py-2 md:-mx-0 md:px-0 md:py-0 md:static",
        "top-[calc(3.5rem+env(safe-area-inset-top,0px))] md:top-auto",
        "bg-[var(--background)]/95 md:bg-transparent",
        "border-b border-[var(--card-border)] md:border-0",
        "backdrop-blur-sm md:backdrop-blur-none",
      )}
    >
      <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-none snap-x snap-mandatory">
        {items.map(({ href, label, icon: Icon, exact, badge }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
                "relative flex shrink-0 snap-start items-center gap-2 rounded-xl px-4 py-3 min-h-[44px]",
                "text-sm font-medium transition-colors active:scale-[0.98]",
                active
                  ? "bg-primary/15 text-primary border border-primary/30"
                  : "glass-card text-muted hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
              {badge != null && badge > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-black">
                  {badge > 99 ? "99+" : badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
