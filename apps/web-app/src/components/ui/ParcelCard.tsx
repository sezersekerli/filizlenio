"use client";

import { formatParcelTitle } from "@/lib/parcel-display";
import { formatParcelArea, formatParcelLocation } from "@/lib/tkgm-display";
import { cn } from "@/lib/utils";
import { ArrowUpRight, MapPin } from "lucide-react";
import Link from "next/link";

type ParcelSummary = {
  id: string;
  label: string | null;
  ada: string;
  parsel_no: string;
  nitelik: string | null;
  area_m2: number | null;
  properties?: Record<string, unknown> | null;
};

export function ParcelCard({
  parcel,
  variant = "grid",
}: {
  parcel: ParcelSummary;
  index?: number;
  variant?: "grid" | "list";
}) {
  const title = formatParcelTitle(parcel);
  const location = formatParcelLocation(parcel.properties);
  const area = formatParcelArea(parcel.area_m2 ? Number(parcel.area_m2) : null);

  return (
    <li>
      <Link
        href={`/parcels/${parcel.id}`}
        className={cn(
          "parcel-card group block rounded-2xl transition-colors active:scale-[0.99]",
          variant === "grid" ? "glass-card glow-border p-4 sm:p-5 min-h-[88px]" : "glass-card glow-border p-4 min-h-[72px]",
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex w-9 h-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <MapPin className="w-4 h-4" />
              </span>
              <p className="font-semibold break-words group-hover:text-primary transition-colors">
                {title}
              </p>
            </div>
            <p className="text-xs text-muted mt-2 pl-11 line-clamp-2">
              {location ?? parcel.nitelik ?? "Parsel"}
              {area ? ` · ${area}` : ""}
            </p>
          </div>
          <ArrowUpRight className="w-4 h-4 text-muted group-hover:text-primary shrink-0 mt-2" />
        </div>
      </Link>
    </li>
  );
}
