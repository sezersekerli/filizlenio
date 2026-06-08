import type { WeatherSnapshot } from "@filizlen/shared";
import { query } from "./db.js";

const CACHE_MS = 60 * 60 * 1000;

interface OpenMeteoDaily {
  time: string[];
  precipitation_sum: number[];
  wind_speed_10m_max: number[];
  temperature_2m_max: number[];
}

function assessRisks(precipMm: number, windKmh: number): string[] {
  const risks: string[] = [];
  if (precipMm >= 5) {
    risks.push("Yağış sonrası mildiyö riski — yaprak kontrolü önerilir");
  }
  if (windKmh >= 25) {
    risks.push("Rüzgar yüksek — ilaçlama ertelenmeli");
  }
  return risks;
}

export async function getParcelWeather(parcelId: string, userId: string): Promise<WeatherSnapshot | null> {
  const { rows: parcelRows } = await query<{ id: string }>(
    `select id from parcels where id = $1 and user_id = $2`,
    [parcelId, userId],
  );
  if (!parcelRows[0]) return null;

  const { rows: cacheRows } = await query<{ fetched_at: string; payload: Record<string, unknown> }>(
    `select fetched_at, payload from weather_snapshots
     where parcel_id = $1
     order by fetched_at desc limit 1`,
    [parcelId],
  );

  const cached = cacheRows[0];
  if (cached && Date.now() - new Date(cached.fetched_at).getTime() < CACHE_MS) {
    const p = cached.payload;
    return {
      parcel_id: parcelId,
      fetched_at: cached.fetched_at,
      temperature_c: (p.temperature_c as number) ?? null,
      precipitation_mm: (p.precipitation_mm as number) ?? null,
      wind_speed_kmh: (p.wind_speed_kmh as number) ?? null,
      risks: (p.risks as string[]) ?? [],
      summary: (p.summary as string) ?? "",
    };
  }

  const { rows: coordRows } = await query<{ lat: number; lon: number }>(
    `select
       st_y(st_centroid(geometry::geometry)) as lat,
       st_x(st_centroid(geometry::geometry)) as lon
     from parcels where id = $1 and geometry is not null`,
    [parcelId],
  );

  if (!coordRows[0]) {
    return {
      parcel_id: parcelId,
      fetched_at: new Date().toISOString(),
      temperature_c: null,
      precipitation_mm: null,
      wind_speed_kmh: null,
      risks: [],
      summary: "Parsel geometrisi yok — hava verisi alınamadı",
    };
  }

  const { lat, lon } = coordRows[0];
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(lat));
  url.searchParams.set("longitude", String(lon));
  url.searchParams.set("daily", "precipitation_sum,wind_speed_10m_max,temperature_2m_max");
  url.searchParams.set("timezone", "Europe/Istanbul");
  url.searchParams.set("forecast_days", "1");

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Open-Meteo request failed");
  }

  const data = (await res.json()) as { daily: OpenMeteoDaily };
  const precip = data.daily.precipitation_sum[0] ?? 0;
  const wind = data.daily.wind_speed_10m_max[0] ?? 0;
  const temp = data.daily.temperature_2m_max[0] ?? null;
  const risks = assessRisks(precip, wind);
  const summary =
    risks.length > 0
      ? risks[0]
      : `Bugün max ${temp?.toFixed(0) ?? "—"}°C, yağış ${precip.toFixed(1)} mm`;

  const payload = {
    temperature_c: temp,
    precipitation_mm: precip,
    wind_speed_kmh: wind,
    risks,
    summary,
  };

  await query(
    `insert into weather_snapshots (parcel_id, payload) values ($1, $2::jsonb)`,
    [parcelId, JSON.stringify(payload)],
  );

  return {
    parcel_id: parcelId,
    fetched_at: new Date().toISOString(),
    ...payload,
  };
}

export async function countRiskAlerts(userId: string): Promise<number> {
  const { rows } = await query<{ id: string }>(
    `select id from parcels where user_id = $1 and geometry is not null limit 20`,
    [userId],
  );

  let count = 0;
  for (const row of rows) {
    try {
      const w = await getParcelWeather(row.id, userId);
      if (w && w.risks.length > 0) count++;
    } catch {
      // skip failed weather fetch
    }
  }
  return count;
}
