// @ts-nocheck — restored from compiled output; full typing deferred
import { PLAN_LIMITS, SATELLITE_NDVI, SATELLITE_PROFILES } from "@filizlen/shared";
import { query } from "./db.js";
import { userHasActiveFeature } from "./entitlements.js";
const STAC_BASE = "https://planetarycomputer.microsoft.com/api/stac/v1";
const PC_DATA = "https://planetarycomputer.microsoft.com/api/data/v1";
const DEFAULT_STAC_URL = process.env.STAC_API_URL ?? `${STAC_BASE}/search`;
const FREE_COLLECTION = process.env.SATELLITE_COLLECTION ?? "sentinel-2-l2a";
const PREMIUM_COLLECTION = process.env.SATELLITE_PREMIUM_COLLECTION ?? FREE_COLLECTION;
const SYNC_COOLDOWN_MS = Number(process.env.SATELLITE_SYNC_COOLDOWN_HOURS ?? 6) * 60 * 60 * 1000;
function satelliteProfile(tier) {
    return tier === "premium" ? SATELLITE_PROFILES.premium : SATELLITE_PROFILES.free;
}
function collectionForTier(tier) {
    return tier === "premium" ? PREMIUM_COLLECTION : FREE_COLLECTION;
}
const LAYERS = {
    rgb: {
        assets: ["visual"],
        assetBidx: "visual|1,2,3",
    },
    ndvi: {
        assets: ["B04", "B08"],
        expression: "(B08-B04)/(B08+B04)",
        rescale: "-0.2,0.8",
        colormap: "rdylgn",
    },
    ndre: {
        assets: ["B05", "B8A"],
        expression: "(B8A-B05)/(B8A+B05)",
        rescale: "-0.2,0.6",
        colormap: "rdylgn",
        premiumOnly: true,
    },
};
const INDEX_SPECS = {
    ndvi: { assets: ["B04", "B08"], expression: "(B08-B04)/(B08+B04)" },
    ndre: { assets: ["B05", "B8A"], expression: "(B8A-B05)/(B8A+B05)" },
};
function bboxToLeafletBounds(bbox) {
    const [west, south, east, north] = bbox;
    return [
        [south, west],
        [north, east],
    ];
}
function normalizeBbox(raw) {
    if (!raw || raw.length < 4)
        return null;
    const [a, b, c, d] = raw;
    return [Math.min(a, c), Math.min(b, d), Math.max(a, c), Math.max(b, d)];
}
/** Planetary Computer /item/feature pratik üst sınır (~7680px; 8192+ sık 502) */
const PREVIEW_SIZE_CAP = {
    free: Number(process.env.SATELLITE_PREVIEW_SIZE_FREE_MAX ?? 2048),
    premium: Number(process.env.SATELLITE_PREVIEW_SIZE_PREMIUM_MAX ?? 7680),
};
function resolvePreviewSize(tier) {
    const limits = tier === "premium" ? PLAN_LIMITS.sense : PLAN_LIMITS.free;
    const cap = tier === "premium" ? PREVIEW_SIZE_CAP.premium : PREVIEW_SIZE_CAP.free;
    const envOverride = tier === "premium"
        ? Number(process.env.SATELLITE_PREVIEW_SIZE_PREMIUM)
        : Number(process.env.SATELLITE_PREVIEW_SIZE_FREE);
    const requested = Number.isFinite(envOverride) && envOverride > 0 ? envOverride : limits.satellitePreviewPx;
    return Math.min(requested, cap);
}
function tierLimits(tier) {
    const limits = tier === "premium" ? PLAN_LIMITS.sense : PLAN_LIMITS.free;
    const profile = satelliteProfile(tier);
    return {
        profile,
        collection: collectionForTier(tier),
        searchDays: limits.satelliteSearchDays,
        maxScenes: limits.satelliteMaxScenes,
        previewSize: resolvePreviewSize(tier),
    };
}
const CLOUD_MAX_SCENES = 24;
const CLOUD_MAX_SEARCH_DAYS = 365;
async function resolveSearchWindow(parcelId, userId, tier) {
    const base = tierLimits(tier);
    const hasCloud = await userHasActiveFeature(userId, "cloud_recommendations");
    if (!hasCloud) {
        return { searchDays: base.searchDays, maxScenes: base.maxScenes };
    }
    const { rows } = await query(`select planted_at::text as planted_at from parcel_seasons where parcel_id = $1`, [parcelId]);
    const plantedAt = rows[0]?.planted_at;
    if (!plantedAt) {
        return { searchDays: base.searchDays, maxScenes: base.maxScenes };
    }
    const planted = new Date(`${plantedAt}T00:00:00.000Z`);
    const daysSince = Math.max(1, Math.ceil((Date.now() - planted.getTime()) / (24 * 60 * 60 * 1000)));
    return {
        searchDays: Math.min(CLOUD_MAX_SEARCH_DAYS, Math.max(base.searchDays, daysSince)),
        maxScenes: Math.max(base.maxScenes, CLOUD_MAX_SCENES),
    };
}
function listMeta(tier, searchDays) {
    const profile = satelliteProfile(tier);
    return {
        tier,
        quality: profile.quality,
        source_label: profile.sourceLabel,
        search_days: searchDays,
    };
}
function healthLabel(mean, stressPct) {
    if (stressPct >= 35 || mean < 0.15)
        return SATELLITE_NDVI.labels.critical;
    if (mean < 0.25)
        return SATELLITE_NDVI.labels.low;
    if (mean < 0.4)
        return SATELLITE_NDVI.labels.moderate;
    if (mean < 0.6)
        return SATELLITE_NDVI.labels.good;
    return SATELLITE_NDVI.labels.dense;
}
function stressPctFromHistogram(histogram, threshold = SATELLITE_NDVI.stressThreshold) {
    if (!histogram)
        return 0;
    const [counts, edges] = histogram;
    let stress = 0;
    let total = 0;
    for (let i = 0; i < counts.length; i++) {
        const count = counts[i] ?? 0;
        const lo = edges[i] ?? 0;
        const hi = edges[i + 1] ?? lo;
        total += count;
        if (hi <= threshold) {
            stress += count;
        }
        else if (lo < threshold) {
            const span = hi - lo || 1;
            stress += count * ((threshold - lo) / span);
        }
    }
    return total > 0 ? Math.round((stress / total) * 1000) / 10 : 0;
}
function mapIndexStats(raw, kind) {
    const stress_pct = stressPctFromHistogram(raw.histogram);
    return {
        mean: Math.round(raw.mean * 1000) / 1000,
        min: Math.round(raw.min * 1000) / 1000,
        max: Math.round(raw.max * 1000) / 1000,
        std: Math.round(raw.std * 1000) / 1000,
        stress_pct,
        health: kind === "ndvi"
            ? healthLabel(raw.mean, stress_pct)
            : raw.mean < 0.15
                ? "Düşük klorofil sinyali"
                : raw.mean < 0.3
                    ? "Orta klorofil"
                    : "Yüksek klorofil",
    };
}
export async function resolveSatelliteTier(userId) {
    const premium = await userHasActiveFeature(userId, "sense_live");
    return premium ? "premium" : "free";
}
async function getParcelGeometry(parcelId, userId) {
    const { rows } = await query(`select st_asgeojson(geometry::geometry)::json as geometry
     from parcels where id = $1 and user_id = $2 and geometry is not null`, [parcelId, userId]);
    return rows[0]?.geometry ?? null;
}
async function getParcelDisplayBbox(parcelId, userId) {
    const { rows } = await query(`select
       st_xmin(e)::float8 as west,
       st_ymin(e)::float8 as south,
       st_xmax(e)::float8 as east,
       st_ymax(e)::float8 as north
     from (
       select st_expand(st_envelope(geometry::geometry), 0.00005) as e
       from parcels where id = $1 and user_id = $2 and geometry is not null
     ) q`, [parcelId, userId]);
    const row = rows[0];
    if (!row)
        return null;
    return [row.west, row.south, row.east, row.north];
}
function parcelFeature(geometry) {
    return { type: "Feature", geometry, properties: {} };
}
function buildPcFeatureUrl(sceneId, previewSize, layer, collection, tier) {
    const spec = LAYERS[layer];
    const url = new URL(`${PC_DATA}/item/feature/${previewSize}x${previewSize}.png`);
    url.searchParams.set("collection", collection);
    url.searchParams.set("item", sceneId);
    url.searchParams.set("format", "png");
    url.searchParams.set("nodata", "0");
    if (tier === "premium") {
        url.searchParams.set("resampling", "bilinear");
    }
    if (spec.expression) {
        url.searchParams.set("asset_as_band", "true");
        for (const asset of spec.assets) {
            url.searchParams.append("assets", asset);
        }
        url.searchParams.set("expression", spec.expression);
        if (spec.rescale)
            url.searchParams.set("rescale", spec.rescale);
        if (spec.colormap)
            url.searchParams.set("colormap_name", spec.colormap);
    }
    else {
        url.searchParams.set("assets", spec.assets[0]);
        if (spec.assetBidx)
            url.searchParams.set("asset_bidx", spec.assetBidx);
    }
    return url;
}
async function fetchPcIndexStats(sceneId, geometry, kind, collection) {
    const spec = INDEX_SPECS[kind];
    const url = new URL(`${PC_DATA}/item/statistics`);
    url.searchParams.set("collection", collection);
    url.searchParams.set("item", sceneId);
    url.searchParams.set("asset_as_band", "true");
    url.searchParams.set("expression", spec.expression);
    for (const asset of spec.assets) {
        url.searchParams.append("assets", asset);
    }
    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parcelFeature(geometry)),
    });
    if (!res.ok) {
        throw new Error(`İndeks istatistiği alınamadı (${res.status})`);
    }
    const data = (await res.json());
    const stats = data.properties?.statistics?.[spec.expression];
    if (!stats)
        throw new Error("İndeks istatistiği boş döndü");
    return stats;
}
async function computeSceneAnalysis(sceneId, geometry, tier, previousMean, collection) {
    const profile = satelliteProfile(tier);
    if (!profile.computeAnalysis) {
        throw new Error("Analiz yalnızca premium uydu profilinde");
    }
    const ndviRaw = await fetchPcIndexStats(sceneId, geometry, "ndvi", collection);
    const ndvi = mapIndexStats(ndviRaw, "ndvi");
    let ndre = null;
    if (tier === "premium") {
        try {
            const ndreRaw = await fetchPcIndexStats(sceneId, geometry, "ndre", collection);
            ndre = mapIndexStats(ndreRaw, "ndre");
        }
        catch {
            ndre = null;
        }
    }
    return {
        ndvi,
        ndre,
        computed_at: new Date().toISOString(),
        ndvi_delta: previousMean != null ? Math.round((ndvi.mean - previousMean) * 1000) / 1000 : null,
    };
}
async function searchSentinelScenes(geometry, searchDays, maxScenes, tier) {
    const { profile, collection } = tierLimits(tier);
    const candidateLimit = Math.min(maxScenes * profile.stacPoolMultiplier, 50);
    const end = new Date().toISOString();
    const start = new Date(Date.now() - searchDays * 24 * 60 * 60 * 1000).toISOString();
    const res = await fetch(DEFAULT_STAC_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            collections: [collection],
            intersects: geometry,
            datetime: `${start}/${end}`,
            query: { "eo:cloud_cover": { lt: profile.maxCloudCover } },
            sort: [{ field: "properties.datetime", direction: "desc" }],
            limit: candidateLimit,
        }),
    });
    if (!res.ok)
        throw new Error(`STAC search failed (${res.status})`);
    const data = (await res.json());
    const features = data.features ?? [];
    return [...features]
        .sort((a, b) => {
        const cloudA = a.properties?.["eo:cloud_cover"] ?? 100;
        const cloudB = b.properties?.["eo:cloud_cover"] ?? 100;
        if (cloudA !== cloudB)
            return cloudA - cloudB;
        const dateA = a.properties?.datetime ?? "";
        const dateB = b.properties?.datetime ?? "";
        return dateB.localeCompare(dateA);
    })
        .slice(0, maxScenes);
}
function rowToScene(row, displayBbox, previewSize) {
    const overlayBbox = row.metadata?.display_bbox ?? displayBbox;
    return {
        id: row.id,
        parcel_id: row.parcel_id,
        provider: row.provider,
        scene_id: row.scene_id,
        acquired_at: row.acquired_at,
        cloud_cover_pct: row.cloud_cover_pct != null ? Number(row.cloud_cover_pct) : null,
        bbox: row.bbox,
        display_bbox: overlayBbox,
        bounds: bboxToLeafletBounds(overlayBbox),
        preview_url: `/api/parcels/${row.parcel_id}/satellite/scenes/${row.id}/preview`,
        preview_width: row.metadata?.preview_width ?? previewSize,
        fetched_at: row.fetched_at,
        analysis: row.metadata?.analysis ?? null,
    };
}
async function loadSceneRows(parcelId, searchDays, maxScenes) {
    const { rows } = await query(`select id, parcel_id, provider, scene_id, acquired_at, cloud_cover_pct, bbox, metadata, fetched_at
     from satellite_scenes
     where parcel_id = $1
       and acquired_at >= now() - ($2 || ' days')::interval
     order by acquired_at desc
     limit $3`, [parcelId, String(searchDays), maxScenes]);
    return rows;
}
async function getSceneContext(parcelId, sceneRowId, userId) {
    const { rows } = await query(`select s.scene_id
     from satellite_scenes s
     inner join parcels p on p.id = s.parcel_id
     where s.id = $1 and s.parcel_id = $2 and p.user_id = $3`, [sceneRowId, parcelId, userId]);
    if (!rows[0])
        throw new Error("Scene not found");
    const geometry = await getParcelGeometry(parcelId, userId);
    if (!geometry)
        throw new Error("Parsel geometrisi yok");
    return { scene_id: rows[0].scene_id, geometry };
}
export async function fetchScenePreviewPng(parcelId, sceneRowId, userId, layer = "rgb") {
    const tier = await resolveSatelliteTier(userId);
    const { previewSize, profile, collection } = tierLimits(tier);
    if (!profile.layers.includes(layer)) {
        throw new Error("Spektral katmanlar Uydu Katmanı (Premium) paketinde");
    }
    const { scene_id, geometry } = await getSceneContext(parcelId, sceneRowId, userId);
    const url = buildPcFeatureUrl(scene_id, previewSize, layer, collection, tier);
    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parcelFeature(geometry)),
    });
    if (!res.ok) {
        const detail = await res.text().catch(() => "");
        throw new Error(`Görüntü oluşturulamadı (${res.status})${detail ? `: ${detail.slice(0, 120)}` : ""}`);
    }
    return Buffer.from(await res.arrayBuffer());
}
export async function listParcelSatelliteScenes(parcelId, userId) {
    const tier = await resolveSatelliteTier(userId);
    const { previewSize } = tierLimits(tier);
    const { searchDays, maxScenes } = await resolveSearchWindow(parcelId, userId, tier);
    const { rows: parcelRows } = await query(`select id from parcels where id = $1 and user_id = $2`, [parcelId, userId]);
    if (!parcelRows[0]) {
        return { ...listMeta(tier, searchDays), scenes: [] };
    }
    const displayBbox = await getParcelDisplayBbox(parcelId, userId);
    if (!displayBbox) {
        return { ...listMeta(tier, searchDays), scenes: [] };
    }
    const rows = await loadSceneRows(parcelId, searchDays, maxScenes);
    return {
        ...listMeta(tier, searchDays),
        scenes: rows.map((row) => rowToScene(row, displayBbox, previewSize)),
    };
}
export async function syncParcelSatelliteScenes(parcelId, userId, force = false) {
    const tier = await resolveSatelliteTier(userId);
    const { previewSize } = tierLimits(tier);
    const { searchDays, maxScenes } = await resolveSearchWindow(parcelId, userId, tier);
    const { rows: parcelRows } = await query(`select id from parcels where id = $1 and user_id = $2`, [parcelId, userId]);
    if (!parcelRows[0])
        throw new Error("Parcel not found");
    const geometry = await getParcelGeometry(parcelId, userId);
    if (!geometry)
        throw new Error("Parsel geometrisi yok — önce TKGM senkronu yapın");
    const displayBbox = await getParcelDisplayBbox(parcelId, userId);
    if (!displayBbox)
        throw new Error("Parsel bbox hesaplanamadı");
    if (!force) {
        const { rows: recentRows } = await query(`select fetched_at from satellite_scenes where parcel_id = $1 order by fetched_at desc limit 1`, [parcelId]);
        const recent = recentRows[0];
        if (recent && Date.now() - new Date(recent.fetched_at).getTime() < SYNC_COOLDOWN_MS) {
            const listed = await listParcelSatelliteScenes(parcelId, userId);
            return { synced: 0, ...listed };
        }
    }
    const { profile, collection } = tierLimits(tier);
    const features = await searchSentinelScenes(geometry, searchDays, maxScenes, tier);
    if (features.length === 0) {
        throw new Error(tier === "premium"
            ? `Son ${searchDays} günde %${profile.maxCloudCover} altında uygun premium sahne bulunamadı`
            : `Son ${searchDays} günde uygun Sentinel-2 sahnesi bulunamadı`);
    }
    let synced = 0;
    const chronological = [...features].reverse();
    let lastMean = null;
    for (const feature of chronological) {
        const bbox = normalizeBbox(feature.bbox);
        const acquiredAt = feature.properties?.datetime;
        if (!bbox || !acquiredAt)
            continue;
        let analysis = null;
        if (profile.computeAnalysis) {
            try {
                analysis = await computeSceneAnalysis(feature.id, geometry, tier, lastMean, collection);
                lastMean = analysis.ndvi.mean;
            }
            catch {
                analysis = null;
            }
        }
        const metadata = {
            display_bbox: displayBbox,
            preview_width: previewSize,
            quality: profile.quality,
            stac: feature.id,
            analysis: analysis ?? undefined,
        };
        await query(`insert into satellite_scenes
         (parcel_id, user_id, provider, scene_id, acquired_at, cloud_cover_pct, bbox, metadata)
       values ($1, $2, $3, $4, $5, $6, $7::jsonb, $8::jsonb)
       on conflict (parcel_id, scene_id) do update set
         provider = excluded.provider,
         cloud_cover_pct = excluded.cloud_cover_pct,
         bbox = excluded.bbox,
         metadata = excluded.metadata,
         fetched_at = now()`, [
            parcelId,
            userId,
            profile.providerId,
            feature.id,
            acquiredAt,
            feature.properties?.["eo:cloud_cover"] ?? null,
            JSON.stringify(bbox),
            JSON.stringify(metadata),
        ]);
        synced += 1;
    }
    const listed = await listParcelSatelliteScenes(parcelId, userId);
    return { synced, ...listed };
}
export async function recomputeSceneAnalysis(parcelId, sceneRowId, userId) {
    const tier = await resolveSatelliteTier(userId);
    const profile = satelliteProfile(tier);
    if (!profile.computeAnalysis) {
        throw new Error("Spektral analiz Uydu Katmanı (Premium) paketinde");
    }
    const { collection } = tierLimits(tier);
    const { scene_id, geometry } = await getSceneContext(parcelId, sceneRowId, userId);
    const { rows: prevRows } = await query(`select (metadata->'analysis'->'ndvi'->>'mean')::float as mean
     from satellite_scenes
     where parcel_id = $1 and id <> $2
     order by acquired_at desc limit 1`, [parcelId, sceneRowId]);
    const analysis = await computeSceneAnalysis(scene_id, geometry, tier, prevRows[0]?.mean ?? null, collection);
    await query(`update satellite_scenes
     set metadata = jsonb_set(coalesce(metadata, '{}'::jsonb), '{analysis}', $4::jsonb, true)
     where id = $1 and parcel_id = $2 and user_id = $3`, [sceneRowId, parcelId, userId, JSON.stringify(analysis)]);
    return analysis;
}
