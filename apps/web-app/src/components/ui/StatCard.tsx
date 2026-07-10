"use client";

import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  accent = "primary",
  className,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: LucideIcon;
  accent?: "primary" | "accent";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "glass-card glow-border rounded-2xl p-4 sm:p-5 relative overflow-hidden",
        className,
      )}
    >
      <div className="relative flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[10px] sm:text-xs text-muted uppercase tracking-wide truncate">
            {label}
          </p>
          <p className="text-2xl sm:text-3xl font-bold mt-0.5 sm:mt-1 tabular-nums truncate">
            {value}
          </p>
          {sub && (
            <p className="text-[10px] sm:text-xs text-muted mt-0.5 sm:mt-1 line-clamp-2">{sub}</p>
          )}
        </div>
        <div
          className={cn(
            "brand-icon-box w-9 h-9 sm:w-11 sm:h-11 shrink-0",
            accent === "accent" && "text-accent",
          )}
        >
          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
      </div>
    </div>
  );
}
