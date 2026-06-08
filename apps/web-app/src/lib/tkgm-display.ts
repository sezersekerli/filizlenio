import type { TkgmParselProperties } from "@filizlen/shared";
import { getTkgmLocationLabel } from "@filizlen/shared";

export function formatParcelLocation(
  properties: Record<string, unknown> | null | undefined,
): string | null {
  return getTkgmLocationLabel(properties as TkgmParselProperties | undefined);
}

export function formatParcelArea(areaM2: number | null | undefined): string | null {
  if (areaM2 == null) return null;
  const n = Number(areaM2);
  if (!Number.isFinite(n)) return null;
  return `${n.toLocaleString("tr-TR")} m²`;
}
