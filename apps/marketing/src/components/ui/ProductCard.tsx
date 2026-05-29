"use client";

import Link from "next/link";
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
  href?: string;
};

export function ProductCard({ name, description, icon, index = 0, href }: ProductCardProps) {
  const Icon = iconMap[icon] ?? Radio;

  const content = (
    <article className="brand-card group relative h-full overflow-hidden rounded-2xl p-6 transition-shadow hover:shadow-[0_0_32px_rgba(34,197,94,0.15)]">
      <div className="brand-icon-box mb-4 h-12 w-12 transition-colors group-hover:bg-primary/20">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-semibold text-foreground">{name}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
      {href ? (
        <p className="mt-4 text-sm font-semibold text-primary transition-transform group-hover:translate-x-1">
          Detayı gör →
        </p>
      ) : null}
    </article>
  );

  return (
    <motion.div
      variants={blurIn}
      transition={{ ...defaultTransition, delay: index * 0.1 }}
      style={{ perspective: 1000 }}
    >
      <TiltCard className="h-full">
        {href ? (
          <Link href={href} className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            {content}
          </Link>
        ) : (
          content
        )}
      </TiltCard>
    </motion.div>
  );
}
