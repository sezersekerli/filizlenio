"use client";

import { FarmNotificationCenter } from "@/components/farm/FarmNotificationCenter";
import { FarmNotificationSettings } from "@/components/farm/FarmNotificationSettings";
import { FarmQuickNav } from "@/components/farm/FarmQuickNav";
import { PageHeader } from "@/components/ui/PageHeader";
import { ApiErrorBanner } from "@/components/ui/ApiErrorBanner";
import type { NotificationMessage, NotificationSettings } from "@filizlen/shared";

export function FarmNotificationsView({
  settings,
  notifications,
  loadError,
}: {
  settings: NotificationSettings;
  notifications: NotificationMessage[];
  loadError?: string | null;
}) {
  return (
    <div className="space-y-5 md:space-y-8">
      <PageHeader
        eyebrow="Tarla yönetimi"
        title="Bildirimler"
        description="Sistem sizi WhatsApp üzerinden uyarır — geciken iş, hava riski, günlük hatırlatma."
      />
      <FarmQuickNav />
      {loadError && <ApiErrorBanner message={loadError} />}

      <FarmNotificationSettings initialSettings={settings} />

      <section className="space-y-3">
        <h2 className="font-semibold">Gönderim geçmişi</h2>
        <FarmNotificationCenter notifications={notifications} />
      </section>
    </div>
  );
}
