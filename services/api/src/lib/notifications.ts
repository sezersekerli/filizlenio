import { canSendFieldNotifications, type Entitlement } from "@filizlen/shared";
import { getEnv } from "../env.js";
import { query } from "./db.js";
import { dayBounds } from "./farm-queries.js";
import { getParcelWeather } from "./weather.js";
import { isWhatsAppConfigured, sendWhatsAppText } from "./whatsapp.js";

type NotificationRow = {
  id: string;
  user_id: string;
  parcel_id: string | null;
  label: string;
  body: string;
  status: string;
};

type UserPrefs = {
  whatsapp_phone: string | null;
  whatsapp_notifications_enabled: boolean;
  last_notification_scan_at: string | null;
};

const SCAN_COOLDOWN_MS = 6 * 60 * 60 * 1000;

export async function getUserNotificationPrefs(userId: string): Promise<UserPrefs | null> {
  const { rows } = await query<UserPrefs>(
    `select whatsapp_phone, whatsapp_notifications_enabled, last_notification_scan_at
     from profiles where id = $1`,
    [userId],
  );
  return rows[0] ?? null;
}

async function userMayReceiveNotifications(userId: string): Promise<boolean> {
  const prefs = await getUserNotificationPrefs(userId);
  if (!prefs?.whatsapp_phone || !prefs.whatsapp_notifications_enabled) {
    return false;
  }
  if (!isWhatsAppConfigured()) return false;

  const env = getEnv();
  if (env.whatsappNotifyAllUsers) return true;

  const { rows: entitlements } = await query<Entitlement>(
    `select feature, active, expires_at from entitlements where user_id = $1`,
    [userId],
  );
  return canSendFieldNotifications(entitlements);
}

async function recentDuplicate(
  userId: string,
  parcelId: string | null,
  label: string,
): Promise<boolean> {
  const { rows } = await query<{ id: string }>(
    `select id from notification_messages
     where user_id = $1
       and label = $2
       and (($3::uuid is null and parcel_id is null) or parcel_id = $3)
       and created_at > now() - interval '24 hours'
     limit 1`,
    [userId, label, parcelId],
  );
  return Boolean(rows[0]);
}

export async function insertNotification(input: {
  userId: string;
  parcelId?: string | null;
  label: string;
  body: string;
  status?: string;
}): Promise<NotificationRow> {
  const { rows } = await query<NotificationRow>(
    `insert into notification_messages (user_id, parcel_id, channel, label, body, status)
     values ($1, $2, 'whatsapp', $3, $4, $5)
     returning id, user_id, parcel_id, label, body, status`,
    [
      input.userId,
      input.parcelId ?? null,
      input.label,
      input.body,
      input.status ?? "draft",
    ],
  );
  return rows[0];
}

export async function sendNotificationMessage(notificationId: string, userId: string) {
  const maySend = await userMayReceiveNotifications(userId);
  if (!maySend) {
    throw new Error("WhatsApp bildirimleri kapalı veya yapılandırılmamış");
  }

  const { rows } = await query<NotificationRow>(
    `select id, user_id, parcel_id, label, body, status
     from notification_messages where id = $1 and user_id = $2`,
    [notificationId, userId],
  );
  const message = rows[0];
  if (!message) throw new Error("Bildirim bulunamadı");
  if (message.status === "sent") return message;

  const prefs = await getUserNotificationPrefs(userId);
  if (!prefs?.whatsapp_phone) throw new Error("WhatsApp numarası kayıtlı değil");

  try {
    const { messageId } = await sendWhatsAppText(prefs.whatsapp_phone, message.body);
    await query(
      `update notification_messages
       set status = 'sent', sent_at = now(), provider_ref = $3, error_message = null
       where id = $1 and user_id = $2`,
      [notificationId, userId, messageId],
    );
  } catch (e) {
    const err = e instanceof Error ? e.message : "Gönderim başarısız";
    await query(
      `update notification_messages
       set status = 'failed', error_message = $3
       where id = $1 and user_id = $2`,
      [notificationId, userId, err],
    );
    throw e;
  }

  const { rows: updated } = await query<NotificationRow>(
    `select id, user_id, parcel_id, label, body, status from notification_messages where id = $1`,
    [notificationId],
  );
  return updated[0];
}

async function createAndSendIfAllowed(
  userId: string,
  input: { parcelId?: string | null; label: string; body: string },
): Promise<"sent" | "skipped" | "duplicate"> {
  if (await recentDuplicate(userId, input.parcelId ?? null, input.label)) {
    return "duplicate";
  }

  const maySend = await userMayReceiveNotifications(userId);
  if (!maySend) return "skipped";

  const row = await insertNotification({
    userId,
    parcelId: input.parcelId,
    label: input.label,
    body: input.body,
    status: "draft",
  });

  try {
    await sendNotificationMessage(row.id, userId);
    return "sent";
  } catch {
    return "skipped";
  }
}

export async function scanAndDispatchNotifications(userId: string): Promise<{
  scanned: boolean;
  sent: number;
}> {
  const prefs = await getUserNotificationPrefs(userId);
  if (!prefs?.whatsapp_notifications_enabled || !prefs.whatsapp_phone) {
    return { scanned: false, sent: 0 };
  }

  if (
    prefs.last_notification_scan_at &&
    Date.now() - new Date(prefs.last_notification_scan_at).getTime() < SCAN_COOLDOWN_MS
  ) {
    return { scanned: false, sent: 0 };
  }

  await query(
    `update profiles set last_notification_scan_at = now() where id = $1`,
    [userId],
  );

  let sent = 0;
  const { dayStart, dayEnd } = dayBounds();

  const { rows: overdueTasks } = await query<{
    id: string;
    parcel_id: string;
    title: string;
    parcel_label: string | null;
    parcel_ada: string;
    parcel_parsel_no: string;
  }>(
    `select t.id, t.parcel_id, t.title,
            p.label as parcel_label, p.ada as parcel_ada, p.parsel_no as parcel_parsel_no
     from farm_tasks t
     join parcels p on p.id = t.parcel_id
     where t.user_id = $1 and t.status = 'pending' and t.due_at < $2
     order by t.due_at asc limit 3`,
    [userId, dayStart.toISOString()],
  );

  for (const task of overdueTasks) {
    const parcelName =
      task.parcel_label?.trim() ||
      `Ada ${task.parcel_ada}/${task.parcel_parsel_no}`;
    const body = `Filizlen — Geciken iş\n\n${parcelName}\n${task.title}\n\nUygulamada tamamlayabilirsiniz.`;
    const result = await createAndSendIfAllowed(userId, {
      parcelId: task.parcel_id,
      label: "Geciken iş",
      body,
    });
    if (result === "sent") sent++;
    if (sent >= 3) return { scanned: true, sent };
  }

  const { rows: parcels } = await query<{ id: string; label: string | null; ada: string; parsel_no: string }>(
    `select id, label, ada, parsel_no from parcels
     where user_id = $1 and geometry is not null limit 10`,
    [userId],
  );

  for (const parcel of parcels) {
    try {
      const weather = await getParcelWeather(parcel.id, userId);
      if (!weather?.risks[0]) continue;
      const parcelName =
        parcel.label?.trim() || `Ada ${parcel.ada}/${parcel.parsel_no}`;
      const body = `Filizlen — Hava uyarısı\n\n${parcelName}\n${weather.risks[0]}`;
      const result = await createAndSendIfAllowed(userId, {
        parcelId: parcel.id,
        label: "Hava riski",
        body,
      });
      if (result === "sent") sent++;
      if (sent >= 3) break;
    } catch {
      // skip parcel weather errors
    }
  }

  const { rows: todayTasks } = await query<{
    parcel_id: string;
    title: string;
    parcel_label: string | null;
    parcel_ada: string;
    parcel_parsel_no: string;
  }>(
    `select t.parcel_id, t.title,
            p.label as parcel_label, p.ada as parcel_ada, p.parsel_no as parcel_parsel_no
     from farm_tasks t
     join parcels p on p.id = t.parcel_id
     where t.user_id = $1 and t.status = 'pending'
       and t.due_at >= $2 and t.due_at < $3
     order by t.priority desc, t.due_at asc limit 1`,
    [userId, dayStart.toISOString(), dayEnd.toISOString()],
  );

  if (sent < 3 && todayTasks[0]) {
    const task = todayTasks[0];
    const parcelName =
      task.parcel_label?.trim() ||
      `Ada ${task.parcel_ada}/${task.parcel_parsel_no}`;
    const body = `Filizlen — Bugünkü iş\n\n${parcelName}\n${task.title}`;
    const result = await createAndSendIfAllowed(userId, {
      parcelId: task.parcel_id,
      label: "Bugünkü iş",
      body,
    });
    if (result === "sent") sent++;
  }

  return { scanned: true, sent };
}
