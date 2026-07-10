import {
  PARCEL_HUB_SEGMENTS,
  parcelHubHref,
  type ParcelHubIconKey,
} from "@/lib/parcel-hub-routes";
import {
  Banknote,
  BarChart3,
  ClipboardList,
  Map,
  Sprout,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

const ICONS: Record<ParcelHubIconKey, LucideIcon> = {
  map: Map,
  sprout: Sprout,
  banknote: Banknote,
  clipboard: ClipboardList,
  chart: BarChart3,
};

export function ParcelHubCards({ parcelId }: { parcelId: string }) {
  return (
    <div className="grid gap-2 sm:gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {PARCEL_HUB_SEGMENTS.map(({ segment, label, desc, iconKey }) => {
        const Icon = ICONS[iconKey];
        return (
          <Link
            key={segment}
            href={parcelHubHref(parcelId, segment)}
            className="glass-card rounded-2xl p-4 sm:p-5 hover:border-primary/30 active:scale-[0.98] transition-transform flex items-center gap-4 sm:block min-h-[72px] sm:min-h-0"
          >
            <span className="flex h-11 w-11 sm:h-auto sm:w-auto shrink-0 items-center justify-center sm:block rounded-xl sm:rounded-none bg-primary/10 sm:bg-transparent">
              <Icon className="h-5 w-5 text-primary sm:mb-3" />
            </span>
            <div className="min-w-0">
              <p className="font-semibold">{label}</p>
              <p className="text-xs text-muted mt-0.5 line-clamp-2">{desc}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
