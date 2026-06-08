import { createParcelEventSchema, createParcelSchema, PLAN_LIMITS } from "@filizlen/shared";
import { Hono } from "hono";
import type { AuthVariables } from "../middleware/auth.js";
import { query } from "../lib/db.js";
import { fetchParselFields } from "../lib/tkgm.js";

type Env = { Variables: AuthVariables };

export const parcelsRoutes = new Hono<Env>();

parcelsRoutes.get("/", async (c) => {
  const userId = c.get("userId");
  const { rows } = await query(
    `select id, user_id, label, il_id, ilce_id, mahalle_id, ada, parsel_no,
            st_asgeojson(geometry)::json as geometry, area_m2, nitelik, properties,
            created_at, updated_at
     from parcels where user_id = $1 order by created_at desc`,
    [userId],
  );
  return c.json(rows);
});

parcelsRoutes.get("/:id", async (c) => {
  const userId = c.get("userId");
  const id = c.req.param("id");
  const { rows } = await query(
    `select id, user_id, label, il_id, ilce_id, mahalle_id, ada, parsel_no,
            st_asgeojson(geometry)::json as geometry, area_m2, nitelik, properties,
            created_at, updated_at
     from parcels where id = $1 and user_id = $2`,
    [id, userId],
  );
  if (!rows[0]) return c.json({ error: "Parcel not found" }, 404);
  return c.json(rows[0]);
});

parcelsRoutes.post("/", async (c) => {
  const userId = c.get("userId");
  const body = await c.req.json();
  const parsed = createParcelSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: parsed.error.flatten() }, 400);
  }

  const { rows: countRows } = await query<{ count: string }>(
    `select count(*)::text as count from parcels where user_id = $1`,
    [userId],
  );
  const count = Number(countRows[0]?.count ?? 0);
  if (count >= PLAN_LIMITS.free.maxParcels) {
    return c.json(
      {
        error: "parcel_limit_reached",
        message: `Ücretsiz planda en fazla ${PLAN_LIMITS.free.maxParcels} parsel ekleyebilirsiniz.`,
        limit: PLAN_LIMITS.free.maxParcels,
      },
      403,
    );
  }

  const d = parsed.data;

  try {
    let rows;
    if (d.geometry) {
      ({ rows } = await query(
        `insert into parcels (
           user_id, label, il_id, ilce_id, mahalle_id, ada, parsel_no,
           geometry, area_m2, nitelik, properties
         ) values (
           $1, $2, $3, $4, $5, $6, $7,
           ST_SetSRID(ST_GeomFromGeoJSON($8), 4326)::geography, $9, $10, $11::jsonb
         )
         returning id, user_id, label, il_id, ilce_id, mahalle_id, ada, parsel_no,
                   st_asgeojson(geometry)::json as geometry, area_m2, nitelik, properties,
                   created_at, updated_at`,
        [
          userId,
          d.label ?? null,
          d.il_id,
          d.ilce_id,
          d.mahalle_id,
          d.ada,
          d.parsel_no,
          JSON.stringify(d.geometry),
          d.area_m2 ?? null,
          d.nitelik ?? null,
          JSON.stringify(d.properties ?? {}),
        ],
      ));
    } else {
      ({ rows } = await query(
        `insert into parcels (
           user_id, label, il_id, ilce_id, mahalle_id, ada, parsel_no,
           area_m2, nitelik, properties
         ) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10::jsonb)
         returning id, user_id, label, il_id, ilce_id, mahalle_id, ada, parsel_no,
                   st_asgeojson(geometry)::json as geometry, area_m2, nitelik, properties,
                   created_at, updated_at`,
        [
          userId,
          d.label ?? null,
          d.il_id,
          d.ilce_id,
          d.mahalle_id,
          d.ada,
          d.parsel_no,
          d.area_m2 ?? null,
          d.nitelik ?? null,
          JSON.stringify(d.properties ?? {}),
        ],
      ));
    }
    return c.json(rows[0], 201);
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes("parcel_limit_reached")) {
      return c.json(
        {
          error: "parcel_limit_reached",
          message: `Ücretsiz planda en fazla ${PLAN_LIMITS.free.maxParcels} parsel ekleyebilirsiniz.`,
          limit: PLAN_LIMITS.free.maxParcels,
        },
        403,
      );
    }
    throw err;
  }
});

parcelsRoutes.delete("/:id", async (c) => {
  const userId = c.get("userId");
  const id = c.req.param("id");
  const { rowCount } = await query(
    `delete from parcels where id = $1 and user_id = $2`,
    [id, userId],
  );
  if (!rowCount) return c.json({ error: "Parcel not found" }, 404);
  return c.body(null, 204);
});

parcelsRoutes.post("/:id/tkgm/sync", async (c) => {
  const userId = c.get("userId");
  const id = c.req.param("id");

  const { rows: parcelRows } = await query<{
    id: string;
    mahalle_id: number;
    ada: string;
    parsel_no: string;
  }>(
    `select id, mahalle_id, ada, parsel_no from parcels where id = $1 and user_id = $2`,
    [id, userId],
  );
  const parcel = parcelRows[0];
  if (!parcel) return c.json({ error: "Parcel not found" }, 404);

  try {
    const { feature, area_m2, nitelik, properties } = await fetchParselFields(
      parcel.mahalle_id,
      parcel.ada,
      parcel.parsel_no,
    );

    const ilId = properties.ilId ?? null;
    const ilceId = properties.ilceId ?? null;
    const mahalleId = properties.mahalleId ?? parcel.mahalle_id;

    let rows;
    if (feature.geometry?.type === "Polygon") {
      ({ rows } = await query(
        `update parcels set
           il_id = coalesce($3, il_id),
           ilce_id = coalesce($4, ilce_id),
           mahalle_id = coalesce($5, mahalle_id),
           geometry = ST_SetSRID(ST_GeomFromGeoJSON($6), 4326)::geography,
           area_m2 = $7,
           nitelik = $8,
           properties = $9::jsonb
         where id = $1 and user_id = $2
         returning id, user_id, label, il_id, ilce_id, mahalle_id, ada, parsel_no,
                   st_asgeojson(geometry)::json as geometry, area_m2, nitelik, properties,
                   created_at, updated_at`,
        [
          id,
          userId,
          ilId,
          ilceId,
          mahalleId,
          JSON.stringify(feature.geometry),
          area_m2,
          nitelik,
          JSON.stringify(properties),
        ],
      ));
    } else {
      ({ rows } = await query(
        `update parcels set
           il_id = coalesce($3, il_id),
           ilce_id = coalesce($4, ilce_id),
           mahalle_id = coalesce($5, mahalle_id),
           area_m2 = $6,
           nitelik = $7,
           properties = $8::jsonb
         where id = $1 and user_id = $2
         returning id, user_id, label, il_id, ilce_id, mahalle_id, ada, parsel_no,
                   st_asgeojson(geometry)::json as geometry, area_m2, nitelik, properties,
                   created_at, updated_at`,
        [
          id,
          userId,
          ilId,
          ilceId,
          mahalleId,
          area_m2,
          nitelik,
          JSON.stringify(properties),
        ],
      ));
    }

    return c.json(rows[0]);
  } catch (e) {
    const message = e instanceof Error ? e.message : "TKGM sync failed";
    return c.json({ error: message }, 502);
  }
});

parcelsRoutes.get("/:id/events", async (c) => {
  const userId = c.get("userId");
  const parcelId = c.req.param("id");

  const { rows: parcelRows } = await query(
    `select id from parcels where id = $1 and user_id = $2`,
    [parcelId, userId],
  );
  if (!parcelRows[0]) return c.json({ error: "Parcel not found" }, 404);

  const { rows } = await query(
    `select * from parcel_events where parcel_id = $1 order by occurred_at desc`,
    [parcelId],
  );
  return c.json(rows);
});

parcelsRoutes.post("/:id/events", async (c) => {
  const userId = c.get("userId");
  const parcelId = c.req.param("id");
  const body = await c.req.json();
  const parsed = createParcelEventSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: parsed.error.flatten() }, 400);
  }

  const { rows: parcelRows } = await query(
    `select id from parcels where id = $1 and user_id = $2`,
    [parcelId, userId],
  );
  if (!parcelRows[0]) return c.json({ error: "Parcel not found" }, 404);

  const { rows } = await query(
    `insert into parcel_events (parcel_id, user_id, type, occurred_at, body)
     values ($1, $2, $3, $4, $5)
     returning *`,
    [
      parcelId,
      userId,
      parsed.data.type,
      parsed.data.occurred_at ?? new Date().toISOString(),
      parsed.data.body ?? null,
    ],
  );
  return c.json(rows[0], 201);
});
