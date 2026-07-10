import {
  canSendFieldNotifications,
  type Entitlement,
  createExpenseSchema,
  createFarmTaskSchema,
  createNotificationSchema,
  PLAN_LIMITS,
  updateFarmTaskSchema,
  updateNotificationSettingsSchema,
  upsertParcelSeasonSchema,
} from "@filizlen/shared";
import { Hono } from "hono";
import type { AuthVariables } from "../middleware/auth.js";
import { query } from "../lib/db.js";
import {
  fetchScenePreviewPng,
  listParcelSatelliteScenes,
  recomputeSceneAnalysis,
  syncParcelSatelliteScenes,
} from "../lib/satellite.js";
import { getParcelSpectralTimeline } from "../lib/spectral-timeline.js";
import {
  ACTIVITY_SELECT,
  buildTaskListQuery,
  dayBounds,
  weekStartMonday,
} from "../lib/farm-queries.js";
import {
  getUserNotificationPrefs,
  scanAndDispatchNotifications,
  sendNotificationMessage,
} from "../lib/notifications.js";
import { isWhatsAppConfigured } from "../lib/whatsapp.js";
import { getEnv } from "../env.js";
import { countRiskAlerts, getParcelWeather } from "../lib/weather.js";

type Env = { Variables: AuthVariables };

export const farmRoutes = new Hono<Env>();

farmRoutes.get("/summary", async (c) => {
  const userId = c.get("userId");

  void scanAndDispatchNotifications(userId).catch(() => {});

  const { rows: countRows } = await query<{ count: string }>(
    `select count(*)::text as count from parcels where user_id = $1`,
    [userId],
  );
  const parcelCount = Number(countRows[0]?.count ?? 0);

  const { dayStart: todayStart, dayEnd: todayEnd, weekEnd } = dayBounds();
  const weekMonday = weekStartMonday();

  const { rows: taskRows } = await query<{
    today: string;
    critical: string;
    overdue: string;
    upcoming: string;
    completed_week: string;
  }>(
    `select
       count(*) filter (
         where status = 'pending' and due_at >= $2 and due_at < $3
       )::text as today,
       count(*) filter (
         where status = 'pending' and due_at >= $2 and due_at < $3 and priority = 'high'
       )::text as critical,
       count(*) filter (
         where status = 'pending' and due_at < $2
       )::text as overdue,
       count(*) filter (
         where status = 'pending' and due_at >= $3 and due_at < $4
       )::text as upcoming,
       count(*) filter (
         where status = 'completed'
           and coalesce(completed_at, updated_at) >= $5
       )::text as completed_week
     from farm_tasks
     where user_id = $1`,
    [
      userId,
      todayStart.toISOString(),
      todayEnd.toISOString(),
      weekEnd.toISOString(),
      weekMonday.toISOString(),
    ],
  );

  const { rows: expenseRows } = await query<{ total: string }>(
    `select coalesce(sum(amount), 0)::text as total
     from expenses where user_id = $1
       and occurred_at >= date_trunc('year', now())`,
    [userId],
  );

  const riskAlertCount = await countRiskAlerts(userId);

  return c.json({
    parcelCount,
    parcelLimit: PLAN_LIMITS.free.maxParcels,
    todayTaskCount: Number(taskRows[0]?.today ?? 0),
    criticalTaskCount: Number(taskRows[0]?.critical ?? 0),
    overdueTaskCount: Number(taskRows[0]?.overdue ?? 0),
    upcomingTaskCount: Number(taskRows[0]?.upcoming ?? 0),
    completedThisWeekCount: Number(taskRows[0]?.completed_week ?? 0),
    riskAlertCount,
    seasonExpenseTotal: Number(expenseRows[0]?.total ?? 0),
    currency: "TRY",
  });
});

farmRoutes.get("/tasks", async (c) => {
  const userId = c.get("userId");
  const { where, values, orderBy } = buildTaskListQuery({
    status: c.req.query("status"),
    scope: c.req.query("scope"),
    date: c.req.query("date"),
  });

  const { rows } = await query(
    `select t.*, p.label as parcel_label, p.ada as parcel_ada, p.parsel_no as parcel_parsel_no
     from farm_tasks t
     join parcels p on p.id = t.parcel_id
     where t.user_id = $1 ${where}
     order by ${orderBy}`,
    [userId, ...values],
  );
  return c.json(rows);
});

farmRoutes.get("/activity", async (c) => {
  const userId = c.get("userId");
  const limitParam = Number(c.req.query("limit") ?? 30);
  const limit = Math.min(Math.max(limitParam, 1), 100);
  const before = c.req.query("before");

  const params: unknown[] = [userId];
  let cursorClause = "";
  if (before) {
    cursorClause = "where activity.occurred_at < $2";
    params.push(before);
  }

  const { rows } = await query(
    `${ACTIVITY_SELECT}
     ${cursorClause}
     order by activity.occurred_at desc
     limit ${before ? "$3" : "$2"}`,
    before ? [...params, limit] : [userId, limit],
  );
  return c.json(rows);
});

farmRoutes.post("/tasks", async (c) => {
  const userId = c.get("userId");
  const body = await c.req.json();
  const parsed = createFarmTaskSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: parsed.error.flatten() }, 400);
  }

  const { rows: parcelRows } = await query(
    `select id from parcels where id = $1 and user_id = $2`,
    [parsed.data.parcel_id, userId],
  );
  if (!parcelRows[0]) return c.json({ error: "Parcel not found" }, 404);

  const { rows } = await query(
    `insert into farm_tasks (parcel_id, user_id, title, task_type, due_at, priority, body)
     values ($1, $2, $3, $4, $5, $6, $7)
     returning *`,
    [
      parsed.data.parcel_id,
      userId,
      parsed.data.title,
      parsed.data.task_type,
      parsed.data.due_at,
      parsed.data.priority ?? "normal",
      parsed.data.body ?? null,
    ],
  );
  return c.json(rows[0], 201);
});

farmRoutes.patch("/tasks/:id", async (c) => {
  const userId = c.get("userId");
  const id = c.req.param("id");
  const body = await c.req.json();
  const parsed = updateFarmTaskSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: parsed.error.flatten() }, 400);
  }

  const fields: string[] = [];
  const values: unknown[] = [id, userId];
  let idx = 3;

  for (const [key, value] of Object.entries(parsed.data)) {
    if (value !== undefined) {
      fields.push(`${key} = $${idx}`);
      values.push(value);
      idx++;
    }
  }

  if (parsed.data.status === "completed") {
    fields.push(`completed_at = $${idx}`);
    values.push(new Date().toISOString());
    idx++;
  }

  if (fields.length === 0) {
    return c.json({ error: "No fields to update" }, 400);
  }

  const { rows } = await query(
    `update farm_tasks set ${fields.join(", ")}, updated_at = now()
     where id = $1 and user_id = $2
     returning *`,
    values,
  );
  if (!rows[0]) return c.json({ error: "Task not found" }, 404);
  return c.json(rows[0]);
});

farmRoutes.get("/notifications", async (c) => {
  const userId = c.get("userId");
  const { rows } = await query(
    `select * from notification_messages
     where user_id = $1
     order by created_at desc limit 30`,
    [userId],
  );
  return c.json(rows);
});

farmRoutes.get("/notifications/settings", async (c) => {
  const userId = c.get("userId");
  const prefs = await getUserNotificationPrefs(userId);
  const { rows: entitlements } = await query<Entitlement>(
    `select feature, active, expires_at from entitlements where user_id = $1`,
    [userId],
  );

  const env = getEnv();
  const canSend =
    isWhatsAppConfigured() &&
    (env.whatsappNotifyAllUsers || canSendFieldNotifications(entitlements));

  return c.json({
    whatsapp_phone: prefs?.whatsapp_phone ?? null,
    whatsapp_notifications_enabled: prefs?.whatsapp_notifications_enabled ?? false,
    whatsapp_configured: isWhatsAppConfigured(),
    can_send: canSend,
  });
});

farmRoutes.patch("/notifications/settings", async (c) => {
  const userId = c.get("userId");
  const body = await c.req.json();
  const parsed = updateNotificationSettingsSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: parsed.error.flatten() }, 400);
  }

  const fields: string[] = [];
  const values: unknown[] = [userId];
  let idx = 2;

  if (parsed.data.whatsapp_phone !== undefined) {
    fields.push(`whatsapp_phone = $${idx}`);
    values.push(parsed.data.whatsapp_phone);
    idx++;
  }
  if (parsed.data.whatsapp_notifications_enabled !== undefined) {
    fields.push(`whatsapp_notifications_enabled = $${idx}`);
    values.push(parsed.data.whatsapp_notifications_enabled);
    idx++;
  }

  if (fields.length === 0) {
    return c.json({ error: "No fields to update" }, 400);
  }

  await query(
    `update profiles set ${fields.join(", ")}, updated_at = now() where id = $1`,
    values,
  );

  if (parsed.data.whatsapp_notifications_enabled) {
    void scanAndDispatchNotifications(userId).catch(() => {});
  }

  const prefs = await getUserNotificationPrefs(userId);
  const { rows: entitlements } = await query<Entitlement>(
    `select feature, active, expires_at from entitlements where user_id = $1`,
    [userId],
  );
  const env = getEnv();

  return c.json({
    whatsapp_phone: prefs?.whatsapp_phone ?? null,
    whatsapp_notifications_enabled: prefs?.whatsapp_notifications_enabled ?? false,
    whatsapp_configured: isWhatsAppConfigured(),
    can_send:
      isWhatsAppConfigured() &&
      (env.whatsappNotifyAllUsers || canSendFieldNotifications(entitlements)),
  });
});

farmRoutes.post("/notifications/dispatch", async (c) => {
  const userId = c.get("userId");
  const cronSecret = c.req.header("x-cron-secret");
  const env = getEnv();

  if (env.notificationCronSecret && cronSecret !== env.notificationCronSecret) {
    return c.json({ error: "Forbidden" }, 403);
  }

  const result = await scanAndDispatchNotifications(userId);
  return c.json(result);
});

farmRoutes.post("/notifications/:id/send", async (c) => {
  const userId = c.get("userId");
  const id = c.req.param("id");

  try {
    const message = await sendNotificationMessage(id, userId);
    const { rows } = await query(`select * from notification_messages where id = $1`, [id]);
    return c.json(rows[0] ?? message);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Gönderim başarısız";
    return c.json({ error: message }, 502);
  }
});

farmRoutes.get("/expenses", async (c) => {
  const userId = c.get("userId");
  const { rows } = await query(
    `select e.*, p.label as parcel_label, p.ada as parcel_ada, p.parsel_no as parcel_parsel_no
     from expenses e
     join parcels p on p.id = e.parcel_id
     where e.user_id = $1
     order by e.occurred_at desc
     limit 200`,
    [userId],
  );
  return c.json(rows);
});

farmRoutes.get("/events", async (c) => {
  const userId = c.get("userId");
  const { rows } = await query(
    `select ev.*, p.label as parcel_label, p.ada as parcel_ada, p.parsel_no as parcel_parsel_no
     from parcel_events ev
     join parcels p on p.id = ev.parcel_id
     where ev.user_id = $1
     order by ev.occurred_at desc
     limit 200`,
    [userId],
  );
  return c.json(rows);
});

farmRoutes.post("/notifications/preview", async (c) => {
  const userId = c.get("userId");
  const body = await c.req.json();
  const parsed = createNotificationSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: parsed.error.flatten() }, 400);
  }

  if (parsed.data.parcel_id) {
    const { rows: parcelRows } = await query(
      `select id from parcels where id = $1 and user_id = $2`,
      [parsed.data.parcel_id, userId],
    );
    if (!parcelRows[0]) return c.json({ error: "Parcel not found" }, 404);
  }

  const { rows } = await query(
    `insert into notification_messages (user_id, parcel_id, label, body, status, scheduled_at)
     values ($1, $2, $3, $4, 'draft', $5)
     returning *`,
    [
      userId,
      parsed.data.parcel_id ?? null,
      parsed.data.label,
      parsed.data.body,
      parsed.data.scheduled_at ?? null,
    ],
  );
  return c.json(rows[0], 201);
});

// Parcel sub-routes mounted under /parcels/:id in index
export const parcelFarmRoutes = new Hono<Env>();

parcelFarmRoutes.get("/:id/season", async (c) => {
  const userId = c.get("userId");
  const parcelId = c.req.param("id");

  const { rows: parcelRows } = await query(
    `select id from parcels where id = $1 and user_id = $2`,
    [parcelId, userId],
  );
  if (!parcelRows[0]) return c.json({ error: "Parcel not found" }, 404);

  const { rows } = await query(
    `select * from parcel_seasons where parcel_id = $1`,
    [parcelId],
  );
  return c.json(rows[0] ?? null);
});

parcelFarmRoutes.post("/:id/season", async (c) => {
  const userId = c.get("userId");
  const parcelId = c.req.param("id");
  const body = await c.req.json();
  const parsed = upsertParcelSeasonSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: parsed.error.flatten() }, 400);
  }

  const { rows: parcelRows } = await query(
    `select id from parcels where id = $1 and user_id = $2`,
    [parcelId, userId],
  );
  if (!parcelRows[0]) return c.json({ error: "Parcel not found" }, 404);

  const { rows } = await query(
    `insert into parcel_seasons (parcel_id, user_id, crop, planted_at, stage, progress_pct, notes)
     values ($1, $2, $3, $4, $5, $6, $7)
     on conflict (parcel_id) do update set
       crop = excluded.crop,
       planted_at = excluded.planted_at,
       stage = excluded.stage,
       progress_pct = excluded.progress_pct,
       notes = excluded.notes
     returning *`,
    [
      parcelId,
      userId,
      parsed.data.crop,
      parsed.data.planted_at ?? null,
      parsed.data.stage ?? "Başlangıç",
      parsed.data.progress_pct ?? 0,
      parsed.data.notes ?? null,
    ],
  );
  return c.json(rows[0]);
});

parcelFarmRoutes.get("/:id/expenses", async (c) => {
  const userId = c.get("userId");
  const parcelId = c.req.param("id");

  const { rows: parcelRows } = await query(
    `select id from parcels where id = $1 and user_id = $2`,
    [parcelId, userId],
  );
  if (!parcelRows[0]) return c.json({ error: "Parcel not found" }, 404);

  const { rows } = await query(
    `select * from expenses where parcel_id = $1 order by occurred_at desc`,
    [parcelId],
  );
  return c.json(rows);
});

parcelFarmRoutes.post("/:id/expenses", async (c) => {
  const userId = c.get("userId");
  const parcelId = c.req.param("id");
  const body = await c.req.json();
  const parsed = createExpenseSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: parsed.error.flatten() }, 400);
  }

  const { rows: parcelRows } = await query(
    `select id from parcels where id = $1 and user_id = $2`,
    [parcelId, userId],
  );
  if (!parcelRows[0]) return c.json({ error: "Parcel not found" }, 404);

  const { rows } = await query(
    `insert into expenses (parcel_id, user_id, category, amount, currency, occurred_at, note)
     values ($1, $2, $3, $4, $5, $6, $7)
     returning *`,
    [
      parcelId,
      userId,
      parsed.data.category,
      parsed.data.amount,
      parsed.data.currency ?? "TRY",
      parsed.data.occurred_at ?? new Date().toISOString(),
      parsed.data.note ?? null,
    ],
  );
  return c.json(rows[0], 201);
});

parcelFarmRoutes.get("/:id/weather", async (c) => {
  const userId = c.get("userId");
  const parcelId = c.req.param("id");

  try {
    const weather = await getParcelWeather(parcelId, userId);
    if (!weather) return c.json({ error: "Parcel not found" }, 404);
    return c.json(weather);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Weather error";
    return c.json({ error: message }, 502);
  }
});

parcelFarmRoutes.get("/:id/tasks", async (c) => {
  const userId = c.get("userId");
  const parcelId = c.req.param("id");
  const status = c.req.query("status") ?? "all";

  const { rows: parcelRows } = await query(
    `select id from parcels where id = $1 and user_id = $2`,
    [parcelId, userId],
  );
  if (!parcelRows[0]) return c.json({ error: "Parcel not found" }, 404);

  const statusClause =
    status === "all" ? "" : `and status = $3`;
  const orderBy =
    status === "completed"
      ? "coalesce(completed_at, updated_at) desc"
      : "due_at asc";
  const params =
    status === "all" ? [parcelId, userId] : [parcelId, userId, status];

  const { rows } = await query(
    `select * from farm_tasks
     where parcel_id = $1 and user_id = $2 ${statusClause}
     order by ${orderBy} limit 50`,
    params,
  );
  return c.json(rows);
});

parcelFarmRoutes.get("/:id/activity", async (c) => {
  const userId = c.get("userId");
  const parcelId = c.req.param("id");
  const limitParam = Number(c.req.query("limit") ?? 20);
  const limit = Math.min(Math.max(limitParam, 1), 100);
  const before = c.req.query("before");

  const { rows: parcelRows } = await query(
    `select id from parcels where id = $1 and user_id = $2`,
    [parcelId, userId],
  );
  if (!parcelRows[0]) return c.json({ error: "Parcel not found" }, 404);

  const params: unknown[] = [userId, parcelId];
  let cursorClause = "where activity.parcel_id = $2";
  if (before) {
    cursorClause += " and activity.occurred_at < $3";
    params.push(before);
  }

  const { rows } = await query(
    `${ACTIVITY_SELECT}
     ${cursorClause}
     order by activity.occurred_at desc
     limit ${before ? "$4" : "$3"}`,
    before ? [...params, limit] : [userId, parcelId, limit],
  );
  return c.json(rows);
});

parcelFarmRoutes.get("/:id/satellite/scenes", async (c) => {
  const userId = c.get("userId");
  const parcelId = c.req.param("id");
  const { rows: parcelRows } = await query(
    `select id from parcels where id = $1 and user_id = $2`,
    [parcelId, userId],
  );
  if (!parcelRows[0]) return c.json({ error: "Parcel not found" }, 404);
  try {
    return c.json(await listParcelSatelliteScenes(parcelId, userId));
  } catch (e) {
    const message = e instanceof Error ? e.message : "Satellite error";
    return c.json({ error: message }, 502);
  }
});

parcelFarmRoutes.post("/:id/satellite/sync", async (c) => {
  const userId = c.get("userId");
  const parcelId = c.req.param("id");
  const force = c.req.query("force") === "true";
  const { rows: parcelRows } = await query(
    `select id from parcels where id = $1 and user_id = $2`,
    [parcelId, userId],
  );
  if (!parcelRows[0]) return c.json({ error: "Parcel not found" }, 404);
  try {
    return c.json(await syncParcelSatelliteScenes(parcelId, userId, force));
  } catch (e) {
    const message = e instanceof Error ? e.message : "Satellite sync error";
    const status = message === "Parcel not found" ? 404 : 502;
    return c.json({ error: message }, status);
  }
});

parcelFarmRoutes.get("/:id/satellite/timeline", async (c) => {
  const userId = c.get("userId");
  const parcelId = c.req.param("id");
  const bucketParam = c.req.query("bucket") ?? "week";
  const bucket = bucketParam === "month" ? "month" : "week";
  const { rows: parcelRows } = await query(
    `select id from parcels where id = $1 and user_id = $2`,
    [parcelId, userId],
  );
  if (!parcelRows[0]) return c.json({ error: "Parcel not found" }, 404);
  try {
    return c.json(await getParcelSpectralTimeline(parcelId, userId, bucket));
  } catch (e) {
    const message = e instanceof Error ? e.message : "Timeline error";
    const status = message.includes("cloud_recommendations") ||
      message.includes("Spektral analiz")
      ? 403
      : message.includes("Ekim tarihi")
        ? 400
        : message === "Parcel not found"
          ? 404
          : 502;
    return c.json({ error: message }, status);
  }
});

parcelFarmRoutes.get("/:id/satellite/scenes/:sceneId/preview", async (c) => {
  const userId = c.get("userId");
  const parcelId = c.req.param("id");
  const sceneId = c.req.param("sceneId");
  const layerParam = c.req.query("layer") ?? "rgb";
  const layer = ["rgb", "ndvi", "ndre"].includes(layerParam)
    ? (layerParam as "rgb" | "ndvi" | "ndre")
    : "rgb";
  try {
    const png = await fetchScenePreviewPng(parcelId, sceneId, userId, layer);
    return c.body(new Uint8Array(png), 200, {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Preview error";
    const status =
      message === "Scene not found"
        ? 404
        : message.includes("Uydu Katmanı") || message.includes("Premium")
          ? 403
          : 502;
    return c.json({ error: message }, status);
  }
});
