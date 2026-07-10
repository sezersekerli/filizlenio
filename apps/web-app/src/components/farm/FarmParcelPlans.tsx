"use client";

import { ToneBadge } from "@/components/ui/ToneBadge";
import { TKGM_DISCLAIMER } from "@filizlen/shared";
import type { Parcel, ParcelSeason, WeatherSnapshot } from "@filizlen/shared";
import { getTkgmLocationLabel } from "@filizlen/shared";
import { formatParcelTitle } from "@/lib/parcel-display";
import Link from "next/link";

export type ParcelPlan = {
  parcel: Parcel;
  season: ParcelSeason | null;
  weather: WeatherSnapshot | null;
  nextTaskTitle: string | null;
};

function formatArea(areaM2: number | null) {
  if (areaM2 == null) return "—";
  const da = areaM2 / 1000;
  return da >= 1 ? `${da.toFixed(1)} da` : `${areaM2.toLocaleString("tr-TR")} m²`;
}

export function FarmParcelPlans({ plans }: { plans: ParcelPlan[] }) {
  if (plans.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {plans.map(({ parcel, season, weather, nextTaskTitle }) => {
        const title = formatParcelTitle(parcel);
        const crop = season?.crop ?? "Ürün belirtilmedi";
        const stage = season?.stage ?? "Başlangıç";
        const progress = season?.progress_pct ?? 0;
        const risk = weather?.risks[0] ?? null;
        const location = getTkgmLocationLabel(parcel.properties);
        const whatsappDraft =
          weather?.summary ??
          (nextTaskTitle ? `Sıradaki iş: ${nextTaskTitle}` : "Sezon profili ekleyin");

        return (
          <Link
            key={parcel.id}
            href={`/parcels/${parcel.id}`}
            className="farm-plan-card glass-card glow-border rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:hover:-translate-y-1 transition-transform duration-300 block active:scale-[0.99]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-1 text-xs text-muted">
                  {crop} · {formatArea(parcel.area_m2)}
                </p>
                {location && (
                  <p className="mt-1 text-[10px] text-muted/80">{location}</p>
                )}
                <p className="mt-1 text-[10px] text-muted/80">
                  Ada {parcel.ada}/{parcel.parsel_no}
                  {parcel.nitelik ? ` · ${parcel.nitelik}` : ""}
                </p>
              </div>
              <ToneBadge tone="accent">{stage}</ToneBadge>
            </div>

            <div className="mt-5">
              <div className="mb-2 flex justify-between text-xs text-muted">
                <span>Sezon ilerleme</span>
                <span>%{progress}</span>
              </div>
              <div className="h-2 rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="mt-5 space-y-3 text-sm">
              {risk ? (
                <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-3">
                  <p className="text-xs font-semibold text-amber-300">Risk</p>
                  <p className="mt-1 text-foreground/90">{risk}</p>
                </div>
              ) : (
                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-3">
                  <p className="text-xs font-semibold text-primary">Durum</p>
                  <p className="mt-1 text-foreground/90">Belirgin risk yok</p>
                </div>
              )}
              {nextTaskTitle && (
                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-3">
                  <p className="text-xs font-semibold text-primary">Sıradaki iş</p>
                  <p className="mt-1 text-foreground/90">{nextTaskTitle}</p>
                </div>
              )}
              <div className="hidden sm:block rounded-2xl border border-white/10 bg-black/20 p-3">
                <p className="text-xs font-semibold text-muted">WhatsApp taslağı</p>
                <p className="mt-1 text-xs leading-relaxed text-foreground/80">{whatsappDraft}</p>
              </div>
            </div>
            <p className="mt-3 text-[10px] text-muted/70">{TKGM_DISCLAIMER}</p>
          </Link>
        );
      })}
    </div>
  );
}
