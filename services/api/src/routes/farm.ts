import {
  createExpenseSchema,
  createFarmTaskSchema,
  createNotificationSchema,
  PLAN_LIMITS,
  updateFarmTaskSchema,
  upsertParcelSeasonSchema,
} from "@filizlen/shared";
import { Hono } from "hono";
import type { AuthVariables } from "../middleware/auth.js";
import { query } from "../lib/db.js";
import { countRiskAlerts, getParcelWeather } from "../lib/weather.js";

type Env = { Variables: AuthVariables };

export const farmRoutes = new Hono<Env>();

farmRoutes.get("/summary", async (c) => {
  const userId = c.get("userId");

  const { rows: countRows } = await query<{ count: string }>(
    `select count(*)::text as count from parcels where user_id = $1`,
    [userId],
  );
  const parcelCount = Number(countRows[0]?.count ?? 0);

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(todayStart);
  todayEnd.setDate(todayEnd.getDate() + 1);

  const { rows: taskRows } = await query<{ total: string; critical: string }>(
    `select
       count(*)::text as total,
       count(*) filter (where priority = 'high')::text as critical
     from farm_tasks
     where user_id = $1 and status = 'pending'
       and due_at >= $2 and due_at < $3`,
    [userId, todayStart.toISOString(), todayEnd.toISOString()],
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
    todayTaskCount: Number(taskRows[0]?.total ?? 0),
    criticalTaskCount: Number(taskRows[0]?.critical ?? 0),
    riskAlertCount,
    seasonExpenseTotal: Number(expenseRows[0]?.total ?? 0),
    currency: "TRY",
  });
});

farmRoutes.get("/tasks", async (c) => {
  const userId = c.get("userId");
  const dateParam = c.req.query("date");
  const day = dateParam ? new Date(dateParam) : new Date();
  day.setHours(0, 0, 0, 0);
  const nextDay = new Date(day);
  nextDay.setDate(nextDay.getDate() + 1);

  const { rows } = await query(
    `select t.*, p.label as parcel_label, p.ada as parcel_ada, p.parsel_no as parcel_parsel_no
     from farm_tasks t
     join parcels p on p.id = t.parcel_id
     where t.user_id = $1 and t.status = 'pending'
       and t.due_at >= $2 and t.due_at < $3
     order by t.priority desc, t.due_at asc`,
    [userId, day.toISOString(), nextDay.toISOString()],
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

  if (fields.length === 0) {
    return c.json({ error: "No fields to update" }, 400);
  }

  const { rows } = await query(
    `update farm_tasks set ${fields.join(", ")}
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
     order by created_at desc limit 20`,
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

  const { rows: parcelRows } = await query(
    `select id from parcels where id = $1 and user_id = $2`,
    [parcelId, userId],
  );
  if (!parcelRows[0]) return c.json({ error: "Parcel not found" }, 404);

  const { rows } = await query(
    `select * from farm_tasks where parcel_id = $1 and user_id = $2
     order by due_at desc limit 50`,
    [parcelId, userId],
  );
  return c.json(rows);
});
