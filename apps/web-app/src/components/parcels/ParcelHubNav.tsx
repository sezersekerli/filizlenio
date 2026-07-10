"use client";

import { MobileSubNav } from "@/components/ui/MobileSubNav";
import { PARCEL_HUB_SEGMENTS, parcelHubHref } from "@/lib/parcel-hub-routes";
import {
  Banknote,
  BarChart3,
  ClipboardList,
  LayoutGrid,
  Map,
  Sprout,
  type LucideIcon,
} from "lucide-react";
import type { ParcelHubIconKey } from "@/lib/parcel-hub-routes";

const ICONS: Record<ParcelHubIconKey | "overview", LucideIcon> = {
  overview: LayoutGrid,
  map: Map,
  sprout: Sprout,
  banknote: Banknote,
  clipboard: ClipboardList,
  chart: BarChart3,
};

export function ParcelHubNav({ parcelId }: { parcelId: string }) {
  const base = `/parcels/${parcelId}`;
  const items = [
    { href: base, label: "Özet", icon: ICONS.overview, exact: true as const },
    ...PARCEL_HUB_SEGMENTS.map((s) => ({
      href: parcelHubHref(parcelId, s.segment),
      label: s.label,
      icon: ICONS[s.iconKey],
    })),
  ];

  return <MobileSubNav items={items} />;
}
