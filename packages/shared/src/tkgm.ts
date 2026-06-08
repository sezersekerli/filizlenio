/** TKGM parsel feature properties (MEGSİS v3.1) */
export interface TkgmParselProperties {
  ilAd?: string;
  ilceAd?: string;
  mahalleAd?: string;
  adaNo?: string;
  parselNo?: string;
  nitelik?: string;
  alan?: string;
  pafta?: string;
  mevkii?: string;
  ozet?: string;
  zeminKmdurum?: string;
  ilId?: number;
  ilceId?: number;
  mahalleId?: number;
  durum?: string;
  [key: string]: unknown;
}

/** TKGM alan metnini m² sayısına çevirir (ör. "9.260,13" → 9260.13) */
export function parseTkgmAreaM2(value: unknown): number | null {
  if (value == null || value === "") return null;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const normalized = String(value).trim().replace(/\./g, "").replace(",", ".");
  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
}

export function getTkgmLocationLabel(
  properties: TkgmParselProperties | Record<string, unknown> | null | undefined,
): string | null {
  if (!properties) return null;
  const p = properties as TkgmParselProperties;
  const parts = [p.mahalleAd, p.ilceAd, p.ilAd].filter(Boolean);
  return parts.length > 0 ? parts.join(" · ") : null;
}

export function getTkgmParselSummary(
  properties: TkgmParselProperties | Record<string, unknown> | null | undefined,
): string | null {
  if (!properties) return null;
  const p = properties as TkgmParselProperties;
  if (p.ozet) return p.ozet;
  if (p.adaNo && p.parselNo) return `Ada ${p.adaNo} / ${p.parselNo}`;
  return null;
}
