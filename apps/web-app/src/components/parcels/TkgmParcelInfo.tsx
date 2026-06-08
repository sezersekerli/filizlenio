"use client";

import type { TkgmParselProperties } from "@filizlen/shared";
import { parseTkgmAreaM2, TKGM_DISCLAIMER } from "@filizlen/shared";
import { formatParcelArea } from "@/lib/tkgm-display";

export function TkgmParcelInfo({
  properties,
  areaM2,
  nitelik,
}: {
  properties?: TkgmParselProperties | Record<string, unknown> | null;
  areaM2?: number | null;
  nitelik?: string | null;
}) {
  if (!properties && !areaM2 && !nitelik) return null;

  const p = (properties ?? {}) as TkgmParselProperties;
  const area = areaM2 ?? parseTkgmAreaM2(p.alan);
  const rows = [
    p.ozet ? { label: "Özet", value: p.ozet } : null,
    p.ilAd || p.ilceAd || p.mahalleAd
      ? {
          label: "Konum",
          value: [p.mahalleAd, p.ilceAd, p.ilAd].filter(Boolean).join(" · "),
        }
      : null,
    p.adaNo && p.parselNo
      ? { label: "Ada / Parsel", value: `${p.adaNo} / ${p.parselNo}` }
      : null,
    nitelik || p.nitelik ? { label: "Nitelik", value: nitelik ?? p.nitelik ?? "" } : null,
    area ? { label: "Alan", value: formatParcelArea(area) ?? "" } : null,
    p.pafta ? { label: "Pafta", value: p.pafta } : null,
    p.zeminKmdurum ? { label: "Zemin", value: p.zeminKmdurum } : null,
  ].filter(Boolean) as Array<{ label: string; value: string }>;

  if (rows.length === 0) return null;

  return (
    <div className="glass-card glow-border rounded-2xl p-5 space-y-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-primary">TKGM kaydı</p>
      <dl className="grid gap-2 sm:grid-cols-2">
        {rows.map((row) => (
          <div key={row.label} className="rounded-xl border border-white/10 bg-black/20 px-3 py-2">
            <dt className="text-[10px] uppercase tracking-wide text-muted">{row.label}</dt>
            <dd className="text-sm mt-0.5">{row.value}</dd>
          </div>
        ))}
      </dl>
      <p className="text-[10px] text-muted">{TKGM_DISCLAIMER}</p>
    </div>
  );
}
