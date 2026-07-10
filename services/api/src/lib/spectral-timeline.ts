// @ts-nocheck — restored from compiled output; full typing deferred
import { query } from "./db.js";
import { userHasActiveFeature } from "./entitlements.js";
function parsePlantedAt(value) {
    return new Date(`${value}T00:00:00.000Z`);
}
function daysBetween(from, to) {
    return Math.floor((to.getTime() - from.getTime()) / (24 * 60 * 60 * 1000));
}
function weekIndex(planted, acquired) {
    const days = daysBetween(planted, acquired);
    return Math.max(1, Math.floor(days / 7) + 1);
}
function monthIndex(planted, acquired) {
    const days = daysBetween(planted, acquired);
    return Math.max(1, Math.floor(days / 30) + 1);
}
function monthLabel(planted, acquired) {
    const idx = monthIndex(planted, acquired);
    return `Ay ${idx}`;
}
function average(values) {
    if (values.length === 0)
        return null;
    return Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 1000) / 1000;
}
function buildBuckets(rows, planted, bucket) {
    const groups = new Map();
    for (const row of rows) {
        const analysis = row.metadata?.analysis;
        if (!analysis?.ndvi)
            continue;
        const acquired = new Date(row.acquired_at);
        if (acquired < planted)
            continue;
        const index = bucket === "week" ? weekIndex(planted, acquired) : monthIndex(planted, acquired);
        const group = groups.get(index) ?? { ndvi: [], stress: [], latest: null };
        group.ndvi.push(analysis.ndvi.mean);
        group.stress.push(analysis.ndvi.stress_pct);
        if (!group.latest || row.acquired_at > group.latest) {
            group.latest = row.acquired_at;
        }
        groups.set(index, group);
    }
    return [...groups.entries()]
        .sort(([a], [b]) => a - b)
        .map(([index, group]) => ({
        index,
        label: bucket === "week" ? `Hafta ${index}` : monthLabel(planted, new Date(group.latest)),
        ndvi_mean: average(group.ndvi),
        stress_pct: average(group.stress),
        scene_count: group.ndvi.length,
        latest_acquired_at: group.latest,
    }));
}
export function computeSpectralAlerts(points, plantedAt, scenes) {
    const alerts = [];
    const planted = parsePlantedAt(plantedAt);
    const now = new Date();
    const daysSincePlanting = daysBetween(planted, now);
    const analyzedScenes = scenes.filter((s) => s.metadata?.analysis?.ndvi);
    if (analyzedScenes.length === 0 && daysSincePlanting >= 14) {
        alerts.push({
            severity: "info",
            code: "missing_data",
            title: "Uydu verisi eksik",
            message: "Ekimden bu yana analizli sahne yok — Zorla yenile ile senkron önerilir.",
            occurred_at: now.toISOString(),
        });
        return alerts;
    }
    const latestScene = analyzedScenes[0];
    const latestAnalysis = latestScene?.metadata?.analysis;
    if (latestAnalysis && latestScene) {
        const { ndvi } = latestAnalysis;
        if (ndvi.stress_pct >= 25) {
            alerts.push({
                severity: ndvi.stress_pct >= 35 ? "critical" : "warning",
                code: "high_stress",
                title: "Kritik stres alanı",
                message: `Parselin %${ndvi.stress_pct.toFixed(0)}'inde stres sinyali — saha kontrolü önerilir (hastalık, su veya besin eksikliği olabilir).`,
                occurred_at: latestScene.acquired_at,
            });
        }
        if (daysSincePlanting >= 28 && ndvi.mean < 0.25) {
            alerts.push({
                severity: "warning",
                code: "below_baseline",
                title: "Düşük bitki vigoru",
                message: `NDVI ${ndvi.mean.toFixed(2)} beklenenin altında — sulama ve gübre değerlendirin.`,
                occurred_at: latestScene.acquired_at,
            });
        }
    }
    if (points.length >= 2) {
        const last = points[points.length - 1];
        const prev = points[points.length - 2];
        if (last.ndvi_mean != null &&
            prev.ndvi_mean != null &&
            last.ndvi_mean - prev.ndvi_mean <= -0.08) {
            alerts.push({
                severity: "warning",
                code: "ndvi_drop",
                title: "Hızlı NDVI düşüşü",
                message: `${prev.label} → ${last.label}: ${(last.ndvi_mean - prev.ndvi_mean).toFixed(3)} — su stresi, hastalık veya zararlı şüphesi; tarlada doğrulayın.`,
                occurred_at: last.latest_acquired_at ?? now.toISOString(),
            });
        }
    }
    return alerts;
}
export async function getParcelSpectralTimeline(parcelId, userId, bucket) {
    const allowed = await userHasActiveFeature(userId, "cloud_recommendations");
    if (!allowed) {
        throw new Error("Spektral analiz cloud_recommendations paketinde");
    }
    const { rows: parcelRows } = await query(`select id from parcels where id = $1 and user_id = $2`, [parcelId, userId]);
    if (!parcelRows[0])
        throw new Error("Parcel not found");
    const { rows: seasonRows } = await query(`select crop, planted_at::text as planted_at from parcel_seasons where parcel_id = $1`, [parcelId]);
    const season = seasonRows[0];
    if (!season?.planted_at) {
        throw new Error("Ekim tarihi gerekli — sezon sekmesinden planted_at girin");
    }
    const planted = parsePlantedAt(season.planted_at);
    const { rows: sceneRows } = await query(`select acquired_at, metadata
     from satellite_scenes
     where parcel_id = $1
       and acquired_at >= $2::timestamptz
       and metadata->'analysis' is not null
     order by acquired_at desc`, [parcelId, season.planted_at]);
    const points = buildBuckets(sceneRows, planted, bucket);
    const alerts = computeSpectralAlerts(points, season.planted_at, sceneRows);
    return {
        parcel_id: parcelId,
        planted_at: season.planted_at,
        crop: season.crop ?? null,
        bucket,
        points,
        alerts,
    };
}
