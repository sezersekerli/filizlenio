export function dayBounds(date?: Date) {
  const day = date ? new Date(date) : new Date();
  day.setHours(0, 0, 0, 0);
  const nextDay = new Date(day);
  nextDay.setDate(nextDay.getDate() + 1);
  const weekEnd = new Date(day);
  weekEnd.setDate(weekEnd.getDate() + 7);
  return { dayStart: day, dayEnd: nextDay, weekEnd };
}

export function weekStartMonday() {
  const now = new Date();
  const day = now.getDay();
  const diff = day === 0 ? 6 : day - 1;
  const monday = new Date(now);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(monday.getDate() - diff);
  return monday;
}

export type TaskListParams = {
  status?: string;
  scope?: string;
  date?: string;
};

export function buildTaskListQuery(params: TaskListParams) {
  const { dayStart, dayEnd, weekEnd } = dayBounds(
    params.date ? new Date(params.date) : undefined,
  );

  const status = params.status ?? "pending";
  const scope =
    params.scope ?? (params.status !== undefined || params.date ? "all" : "today");

  const conditions: string[] = [];
  const values: unknown[] = [];
  let idx = 2;

  if (status !== "all") {
    conditions.push(`t.status = $${idx}`);
    values.push(status);
    idx++;
  }

  const applyPendingDate =
    status === "pending" || (status === "all" && scope !== "all");

  if (applyPendingDate) {
    if (scope === "today") {
      conditions.push(`t.due_at >= $${idx} and t.due_at < $${idx + 1}`);
      values.push(dayStart.toISOString(), dayEnd.toISOString());
      idx += 2;
      if (status === "all") {
        conditions.push(`t.status = 'pending'`);
      }
    } else if (scope === "overdue") {
      conditions.push(`t.due_at < $${idx}`);
      values.push(dayStart.toISOString());
      idx++;
      if (status === "all") {
        conditions.push(`t.status = 'pending'`);
      }
    } else if (scope === "upcoming") {
      conditions.push(`t.due_at >= $${idx} and t.due_at < $${idx + 1}`);
      values.push(dayEnd.toISOString(), weekEnd.toISOString());
      idx += 2;
      if (status === "all") {
        conditions.push(`t.status = 'pending'`);
      }
    } else if (scope === "week") {
      conditions.push(`t.due_at < $${idx}`);
      values.push(weekEnd.toISOString());
      idx++;
      if (status === "all") {
        conditions.push(`t.status = 'pending'`);
      }
    }
  }

  const orderBy =
    status === "completed"
      ? "coalesce(t.completed_at, t.updated_at) desc"
      : "t.priority desc, t.due_at asc";

  const where =
    conditions.length > 0 ? `and ${conditions.join(" and ")}` : "";

  return { where, values, orderBy, dayStart, dayEnd, weekEnd };
}

export const ACTIVITY_SELECT = `
  select * from (
    select
      t.id::text as id,
      'task_completed'::text as kind,
      coalesce(t.completed_at, t.updated_at) as occurred_at,
      t.parcel_id,
      p.label as parcel_label,
      p.ada as parcel_ada,
      p.parsel_no as parcel_parsel_no,
      t.title,
      t.body as subtitle,
      null::numeric as amount,
      null::text as currency,
      t.task_type as category
    from farm_tasks t
    join parcels p on p.id = t.parcel_id
    where t.user_id = $1 and t.status = 'completed'

    union all

    select
      ev.id::text,
      'event'::text,
      ev.occurred_at,
      ev.parcel_id,
      p.label,
      p.ada,
      p.parsel_no,
      coalesce(nullif(trim(ev.body), ''), ev.type) as title,
      ev.body as subtitle,
      null::numeric,
      null::text,
      ev.type as category
    from parcel_events ev
    join parcels p on p.id = ev.parcel_id
    where ev.user_id = $1

    union all

    select
      e.id::text,
      'expense'::text,
      e.occurred_at,
      e.parcel_id,
      p.label,
      p.ada,
      p.parsel_no,
      e.category as title,
      e.note as subtitle,
      e.amount,
      e.currency,
      e.category
    from expenses e
    join parcels p on p.id = e.parcel_id
    where e.user_id = $1
  ) activity
`;
