import { FarmNotificationsView } from "@/components/farm/FarmNotificationsView";
import { getServerApiClient } from "@/lib/api-server";
import { safeServerFetchAll } from "@/lib/server-fetch";
import type { NotificationMessage, NotificationSettings } from "@filizlen/shared";

export default async function FarmNotificationsPage() {
  const api = await getServerApiClient();
  const result = await safeServerFetchAll<[NotificationSettings, NotificationMessage[]]>(
    [() => api.getNotificationSettings(), () => api.listNotifications()],
    "Bildirimler yüklenemedi",
  );

  if (!result.ok) {
    return (
      <FarmNotificationsView
        settings={{
          whatsapp_phone: null,
          whatsapp_notifications_enabled: false,
          whatsapp_configured: false,
          can_send: false,
        }}
        notifications={[]}
        loadError={result.error}
      />
    );
  }

  const [settings, notifications] = result.data;
  return <FarmNotificationsView settings={settings} notifications={notifications} />;
}
