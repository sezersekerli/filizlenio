"use client";

import { motion } from "framer-motion";
import { Radio, SlidersHorizontal, Cloud, Wrench, LucideIcon } from "lucide-react";
import { blurIn, defaultTransition } from "@/lib/motion";
import { TiltCard } from "@/components/ui/TiltCard";

const iconMap: Record<string, LucideIcon> = {
  sensors: Radio,
  control: SlidersHorizontal,
  cloud: Cloud,
  project: Wrench,
};

type ProductCardProps = {
  name: string;
  description: string;
  icon: "sensors" | "control" | "cloud" | "project";
  index?: number;
};

export function ProductCard({ name, description, icon, index = 0 }: ProductCardProps) {
  const Icon = iconMap[icon] ?? Radio;

  return (
    <motion.div
      variants={blurIn}
      transition={{ ...defaultTransition, delay: index * 0.1 }}
      style={{ perspective: 1000 }}
    >
      <TiltCard className="h-full">
        <article className="brand-card group relative h-full overflow-hidden rounded-2xl p-6 transition-shadow hover:shadow-[0_0_32px_rgba(34,197,94,0.15)]">
          <div className="brand-icon-box mb-4 h-12 w-12 transition-colors group-hover:bg-primary/20">
            <Icon className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">{name}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
        </article>
      </TiltCard>
    </motion.div>
  );
}
