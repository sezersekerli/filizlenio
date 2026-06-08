import {
  DEFAULT_TKGM_API_BASE,
  parseTkgmAreaM2,
  type TkgmParselProperties,
} from "@filizlen/shared";
import type { TkgmIlce, TkgmMahalle } from "@filizlen/shared";
import { getEnv } from "../env.js";

const cache = new Map<string, { data: unknown; expires: number }>();
const CACHE_TTL_MS = 1000 * 60 * 60; // 1 hour
const IL_LIST_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours

const TKGM_HEADERS = {
  Accept: "application/json",
  "User-Agent": "Filizlen/1.0 (+https://filizlen.io; tarla-yonetimi)",
};

function normalizeBase(base: string) {
  return base.replace(/\/$/, "");
}

function cacheKey(path: string) {
  return path;
}

async function tkgmFetch<T>(path: string, ttlMs = CACHE_TTL_MS): Promise<T> {
  const key = cacheKey(path);
  const hit = cache.get(key);
  if (hit && hit.expires > Date.now()) {
    return hit.data as T;
  }

  const base = normalizeBase(getEnv().tkgmApiBase || DEFAULT_TKGM_API_BASE);
  const url = `${base}/${path.replace(/^\//, "")}`;
  const res = await fetch(url, { headers: TKGM_HEADERS });

  if (!res.ok) {
    throw new Error(`TKGM ${res.status}: ${await res.text()}`);
  }

  const data = (await res.json()) as T;
  cache.set(key, { data, expires: Date.now() + ttlMs });
  return data;
}

function parseAdminList(raw: unknown): Array<{ id: number; ad: string }> {
  if (raw && typeof raw === "object" && "features" in raw) {
    const features = (raw as GeoJSON.FeatureCollection).features ?? [];
    return features
      .map((f) => {
        const props = f.properties as { id?: number; text?: string } | null;
        if (!props?.id) return null;
        return { id: props.id, ad: props.text ?? String(props.id) };
      })
      .filter((x): x is { id: number; ad: string } => x !== null)
      .sort((a, b) => a.ad.localeCompare(b.ad, "tr"));
  }

  if (Array.isArray(raw)) {
    return (raw as Array<{ id: number; ad?: string; text?: string }>).map((x) => ({
      id: x.id,
      ad: x.ad ?? x.text ?? String(x.id),
    }));
  }

  return [];
}

function assertNotErrorPayload(raw: unknown) {
  if (raw && typeof raw === "object" && "Message" in raw && !("geometry" in raw)) {
    throw new Error(String((raw as { Message: string }).Message));
  }
}

export async function fetchIller(): Promise<Array<{ id: number; ad: string }>> {
  const raw = await tkgmFetch<GeoJSON.FeatureCollection>("idariYapi/ilListe", IL_LIST_TTL_MS);
  return parseAdminList(raw);
}

export async function fetchIlceler(ilId: number): Promise<TkgmIlce[]> {
  const raw = await tkgmFetch<GeoJSON.FeatureCollection>(`idariYapi/ilceListe/${ilId}`);
  return parseAdminList(raw);
}

export async function fetchMahalleler(ilceId: number): Promise<TkgmMahalle[]> {
  const raw = await tkgmFetch<GeoJSON.FeatureCollection>(`idariYapi/mahalleListe/${ilceId}`);
  return parseAdminList(raw);
}

export function normalizeParselFeature(raw: unknown): GeoJSON.Feature {
  assertNotErrorPayload(raw);

  if (raw && typeof raw === "object" && "type" in raw && (raw as GeoJSON.Feature).type === "Feature") {
    return raw as GeoJSON.Feature;
  }

  const obj = raw as { geometry?: GeoJSON.Geometry; properties?: TkgmParselProperties };
  if (obj?.geometry) {
    return {
      type: "Feature",
      properties: obj.properties ?? {},
      geometry: obj.geometry,
    };
  }

  throw new Error("TKGM parsel yanıtı geçersiz");
}

export async function fetchParselGeoJson(
  mahalleId: number,
  ada: string,
  parsel: string,
): Promise<GeoJSON.Feature> {
  const adaNorm = ada.trim();
  const parselNorm = parsel.trim();
  const raw = await tkgmFetch<unknown>(
    `parsel/${mahalleId}/${encodeURIComponent(adaNorm)}/${encodeURIComponent(parselNorm)}`,
    1000 * 60 * 15,
  );
  return normalizeParselFeature(raw);
}

export function extractParselFields(feature: GeoJSON.Feature) {
  const props = (feature.properties ?? {}) as TkgmParselProperties;
  return {
    area_m2: parseTkgmAreaM2(props.alan),
    nitelik: props.nitelik ?? null,
    properties: props,
  };
}

export async function fetchParselFields(
  mahalleId: number,
  ada: string,
  parsel: string,
) {
  const feature = await fetchParselGeoJson(mahalleId, ada, parsel);
  return { feature, ...extractParselFields(feature) };
}
