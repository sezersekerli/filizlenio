import { Hono } from "hono";
import {
  extractParselFields,
  fetchIlceler,
  fetchIller,
  fetchMahalleler,
  fetchParselGeoJson,
} from "../lib/tkgm.js";

export const tkgmRoutes = new Hono();

tkgmRoutes.get("/iller", async (c) => {
  try {
    const data = await fetchIller();
    return c.json(data);
  } catch (e) {
    const message = e instanceof Error ? e.message : "TKGM error";
    return c.json({ error: message }, 502);
  }
});

tkgmRoutes.get("/ilceler/:ilId", async (c) => {
  const ilId = Number(c.req.param("ilId"));
  if (!Number.isFinite(ilId)) {
    return c.json({ error: "Invalid ilId" }, 400);
  }
  try {
    const data = await fetchIlceler(ilId);
    return c.json(data);
  } catch (e) {
    const message = e instanceof Error ? e.message : "TKGM error";
    return c.json({ error: message }, 502);
  }
});

tkgmRoutes.get("/mahalleler/:ilceId", async (c) => {
  const ilceId = Number(c.req.param("ilceId"));
  if (!Number.isFinite(ilceId)) {
    return c.json({ error: "Invalid ilceId" }, 400);
  }
  try {
    const data = await fetchMahalleler(ilceId);
    return c.json(data);
  } catch (e) {
    const message = e instanceof Error ? e.message : "TKGM error";
    return c.json({ error: message }, 502);
  }
});

tkgmRoutes.get("/parsel/:mahalleId/:ada/:parsel", async (c) => {
  const mahalleId = Number(c.req.param("mahalleId"));
  const ada = c.req.param("ada");
  const parsel = c.req.param("parsel");
  if (!Number.isFinite(mahalleId) || !ada || !parsel) {
    return c.json({ error: "Invalid parameters" }, 400);
  }
  try {
    const feature = await fetchParselGeoJson(mahalleId, ada, parsel);
    const meta = extractParselFields(feature);
    return c.json({
      ...feature,
      meta: {
        area_m2: meta.area_m2,
        nitelik: meta.nitelik,
        location: {
          il: meta.properties.ilAd ?? null,
          ilce: meta.properties.ilceAd ?? null,
          mahalle: meta.properties.mahalleAd ?? null,
        },
        ozet: meta.properties.ozet ?? null,
        pafta: meta.properties.pafta ?? null,
        zeminKmdurum: meta.properties.zeminKmdurum ?? null,
      },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "TKGM error";
    return c.json({ error: message }, 502);
  }
});
