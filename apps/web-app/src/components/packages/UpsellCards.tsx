"use client";

import { PRODUCT_PACKAGES } from "@filizlen/shared";
import { motion } from "framer-motion";
import { Cloud, Lock, Radio, SlidersHorizontal } from "lucide-react";
import { staggerContainer, fadeInUp, defaultTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";

const ICONS = {
  sense: Radio,
  cloud: Cloud,
  control: SlidersHorizontal,
} as const;

const STYLES = {
  sense: "package-card-sense border-emerald-500/25",
  cloud: "package-card-cloud border-sky-500/25",
  control: "package-card-control border-green-800/40",
} as const;

export function UpsellCards({ compact }: { compact?: boolean }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={staggerContainer}
      className={cn("grid gap-5", compact ? "sm:grid-cols-3" : "md:grid-cols-3")}
    >
      {PRODUCT_PACKAGES.map((pkg) => {
        const Icon = ICONS[pkg.id as keyof typeof ICONS] ?? Radio;
        return (
          <motion.div
            key={pkg.id}
            variants={fadeInUp}
            transition={defaultTransition}
            className={cn(
              "relative rounded-2xl border p-6 overflow-hidden group",
              STYLES[pkg.id as keyof typeof STYLES],
            )}
          >
            <div className="absolute top-4 right-4 text-muted/80">
              <Lock className="w-4 h-4" />
            </div>
            <div className="brand-icon-box w-11 h-11 mb-4 group-hover:scale-105 transition-transform">
              <Icon className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-highlight">{pkg.name}</h3>
            <p className="text-sm text-muted mt-2 leading-relaxed">{pkg.description}</p>
            <p className="text-xs text-primary/90 mt-5 font-medium">
              Yakında — ödeme entegrasyonu
            </p>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
