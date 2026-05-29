"use client";

import { defaultTransition, fadeInUp } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowUpRight, MapPin } from "lucide-react";
import Link from "next/link";

type ParcelSummary = {
  id: string;
  label: string | null;
  ada: string;
  parsel_no: string;
  nitelik: string | null;
  area_m2: number | null;
};

export function ParcelCard({
  parcel,
  index = 0,
  variant = "grid",
}: {
  parcel: ParcelSummary;
  index?: number;
  variant?: "grid" | "list";
}) {
  const title = parcel.label || `Ada ${parcel.ada} / ${parcel.parsel_no}`;

  return (
    <motion.li
      variants={fadeInUp}
      transition={{ ...defaultTransition, delay: index * 0.06 }}
    >
      <Link
        href={`/parcels/${parcel.id}`}
        className={cn(
          "parcel-card group block rounded-2xl transition-all duration-300",
          variant === "grid" ? "glass-card glow-border p-5" : "glass-card glow-border p-4",
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="inline-flex w-8 h-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <MapPin className="w-4 h-4" />
              </span>
              <p className="font-semibold truncate group-hover:text-primary transition-colors">
                {title}
              </p>
            </div>
            <p className="text-xs text-muted mt-3 pl-10">
              {parcel.nitelik ?? "Parsel"}
              {parcel.area_m2 ? ` · ${parcel.area_m2.toLocaleString("tr-TR")} m²` : ""}
            </p>
          </div>
          <ArrowUpRight className="w-4 h-4 text-muted group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 mt-1" />
        </div>
      </Link>
    </motion.li>
  );
}
