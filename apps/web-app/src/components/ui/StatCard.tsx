"use client";

import { scaleIn, springTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
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
    <motion.div
      variants={scaleIn}
      transition={springTransition}
      className={cn(
        "glass-card glow-border rounded-2xl p-5 relative overflow-hidden group",
        className,
      )}
    >
      <div
        className={cn(
          "absolute -right-4 -top-4 w-24 h-24 rounded-full blur-2xl opacity-40 transition-opacity group-hover:opacity-70",
          accent === "primary" ? "bg-primary" : "bg-accent",
        )}
      />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-muted uppercase tracking-wide">{label}</p>
          <p className="text-3xl font-bold mt-1 tabular-nums">{value}</p>
          {sub && <p className="text-xs text-muted mt-1">{sub}</p>}
        </div>
        <div className="brand-icon-box w-11 h-11 shrink-0">
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </motion.div>
  );
}
