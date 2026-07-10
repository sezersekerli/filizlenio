import { getServerApiClient } from "@/lib/api-server";
import { formatParcelTitle } from "@/lib/parcel-display";
import { safeServerFetch } from "@/lib/server-fetch";
import type {
  Entitlement,
  Expense,
  Parcel,
  ParcelEvent,
  ParcelSeason,
} from "@filizlen/shared";
import { cache } from "react";
import { notFound } from "next/navigation";

export function parseParcelGeometry(geometry: unknown): GeoJSON.Polygon | null {
  if (!geometry) return null;
  if (typeof geometry === "string") {
    try {
      return JSON.parse(geometry) as GeoJSON.Polygon;
    } catch {
      return null;
    }
  }
  if (typeof geometry === "object" && (geometry as GeoJSON.Polygon).type === "Polygon") {
    return geometry as GeoJSON.Polygon;
  }
  return null;
}

export const loadParcelBasics = cache(async (
  id: string,
): Promise<{
  parcel: Parcel;
  geom: GeoJSON.Polygon | null;
  title: string;
}> => {
  try {
    const api = await getServerApiClient();
    const parcel = await api.getParcel(id);
    const geom = parseParcelGeometry(parcel.geometry);
    return { parcel, geom, title: formatParcelTitle(parcel) };
  } catch {
    notFound();
  }
});

export const loadEntitlements = cache(async (): Promise<Entitlement[]> => {
  try {
    const api = await getServerApiClient();
    return await api.listEntitlements();
  } catch {
    return [];
  }
});

export const loadParcelContext = cache(async (
  id: string,
): Promise<{
  parcel: Parcel;
  entitlements: Entitlement[];
  geom: GeoJSON.Polygon | null;
  title: string;
}> => {
  const [basics, entitlements] = await Promise.all([
    loadParcelBasics(id),
    loadEntitlements(),
  ]);
  return { ...basics, entitlements };
});

export const loadParcelSeason = cache(async (parcelId: string) => {
  const api = await getServerApiClient();
  const result = await safeServerFetch(() => api.getParcelSeason(parcelId));
  return result.ok ? result.data : null;
});

export const loadParcelExpenses = cache(async (parcelId: string): Promise<Expense[]> => {
  const api = await getServerApiClient();
  const result = await safeServerFetch(() => api.listParcelExpenses(parcelId));
  return result.ok ? result.data : [];
});

export const loadParcelEvents = cache(async (parcelId: string): Promise<ParcelEvent[]> => {
  const api = await getServerApiClient();
  const result = await safeServerFetch(() => api.listParcelEvents(parcelId));
  return result.ok ? result.data : [];
});
