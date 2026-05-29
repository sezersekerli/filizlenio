import { DEFAULT_TKGM_API_BASE } from "@filizlen/shared";
import type { TkgmIlce, TkgmMahalle } from "@filizlen/shared";
import { getEnv } from "../env.js";

const cache = new Map<string, { data: unknown; expires: number }>();
const CACHE_TTL_MS = 1000 * 60 * 60; // 1 hour

function cacheKey(path: string) {
  return path;
}

async function cachedFetch<T>(path: string): Promise<T> {
  const key = cacheKey(path);
  const hit = cache.get(key);
  if (hit && hit.expires > Date.now()) {
    return hit.data as T;
  }

  const base = getEnv().tkgmApiBase || DEFAULT_TKGM_API_BASE;
  const url = `${base}${path}`;
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    throw new Error(`TKGM ${res.status}: ${await res.text()}`);
  }

  const data = (await res.json()) as T;
  cache.set(key, { data, expires: Date.now() + CACHE_TTL_MS });
  return data;
}

export async function fetchIlceler(ilId: number): Promise<TkgmIlce[]> {
  const raw = await cachedFetch<{ features?: Array<{ properties: { id: number; text: string } }> }>(
    `/ilceListe/${ilId}`,
  );
  if (Array.isArray(raw)) {
    return (raw as Array<{ id: number; ad?: string; text?: string }>).map((x) => ({
      id: x.id,
      ad: x.ad ?? x.text ?? String(x.id),
    }));
  }
  if (raw.features) {
    return raw.features.map((f) => ({
      id: f.properties.id,
      ad: f.properties.text,
    }));
  }
  return [];
}

export async function fetchMahalleler(ilceId: number): Promise<TkgmMahalle[]> {
  const raw = await cachedFetch<{ features?: Array<{ properties: { id: number; text: string } }> }>(
    `/mahalleListe/${ilceId}`,
  );
  if (Array.isArray(raw)) {
    return (raw as Array<{ id: number; ad?: string; text?: string }>).map((x) => ({
      id: x.id,
      ad: x.ad ?? x.text ?? String(x.id),
    }));
  }
  if (raw.features) {
    return raw.features.map((f) => ({
      id: f.properties.id,
      ad: f.properties.text,
    }));
  }
  return [];
}

export async function fetchParselGeoJson(
  mahalleId: number,
  ada: string,
  parsel: string,
): Promise<GeoJSON.Feature> {
  const raw = await cachedFetch<GeoJSON.Feature | { geometry?: GeoJSON.Geometry; properties?: Record<string, unknown> }>(
    `/parsel/${mahalleId}/${ada}/${parsel}`,
  );
  if ("type" in raw && raw.type === "Feature") {
    return raw as GeoJSON.Feature;
  }
  const geom = (raw as { geometry?: GeoJSON.Geometry }).geometry;
  return {
    type: "Feature",
    properties: (raw as { properties?: Record<string, unknown> }).properties ?? {},
    geometry: geom ?? { type: "Polygon", coordinates: [] },
  };
}
