"use client";

import { Field, TextInput } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { ApiErrorBanner } from "@/components/ui/ApiErrorBanner";
import { getApiClient } from "@/lib/api";
import type { NotificationSettings } from "@filizlen/shared";
import { useId, useState } from "react";
import { useSyncedState } from "@/hooks/useSyncedState";
import { useAsyncAction } from "@/hooks/useAsyncAction";
import { cn } from "@/lib/utils";

export function FarmNotificationSettings({
  initialSettings,
}: {
  initialSettings: NotificationSettings;
}) {
  const uid = useId();
  const api = getApiClient();
  const [settings, setSettings] = useSyncedState(initialSettings);
  const [phone, setPhone] = useState(initialSettings.whatsapp_phone ?? "");
  const [enabled, setEnabled] = useState(initialSettings.whatsapp_notifications_enabled);

  const { run: save, loading, error } = useAsyncAction(async () => {
    const updated = await api.updateNotificationSettings({
      whatsapp_phone: phone.trim() || null,
      whatsapp_notifications_enabled: enabled,
    });
    setSettings(updated);
    setPhone(updated.whatsapp_phone ?? "");
    setEnabled(updated.whatsapp_notifications_enabled);
  });

  const { run: testSend, loading: testing, error: testError } = useAsyncAction(async () => {
    await api.dispatchNotifications();
  });

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-5 space-y-4">
      <div>
        <h2 className="font-semibold">WhatsApp bildirimleri</h2>
        <p className="text-xs text-muted mt-1">
          Sistem geciken işler, hava riskleri ve bugünkü işler için size mesaj gönderir.
        </p>
      </div>

      {!settings.whatsapp_configured && (
        <p className="text-sm text-amber-200 bg-amber-500/10 border border-amber-500/30 rounded-xl px-3 py-2">
          Sunucuda WhatsApp API anahtarları henüz tanımlı değil. Numaranızı kaydedebilirsiniz;
          anahtarlar eklenince gönderim başlar.
        </p>
      )}

      {(error || testError) && (
        <ApiErrorBanner message={error ?? testError ?? ""} />
      )}

      <Field label="WhatsApp numarası" htmlFor={`${uid}-phone`}>
        <TextInput
          id={`${uid}-phone`}
          type="tel"
          inputMode="tel"
          placeholder="05XX XXX XX XX"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </Field>

      <label
        className={cn(
          "flex items-center gap-3 rounded-xl border px-4 py-3 min-h-[44px] cursor-pointer",
          enabled ? "border-primary/30 bg-primary/10" : "border-white/10",
        )}
      >
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
          className="h-4 w-4 accent-primary"
        />
        <span className="text-sm">WhatsApp bildirimlerini aç</span>
      </label>

      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={save} disabled={loading || !phone.trim()}>
          {loading ? "Kaydediliyor…" : "Kaydet"}
        </Button>
        {enabled && phone.trim() && settings.whatsapp_configured && (
          <Button type="button" variant="secondary" onClick={testSend} disabled={testing}>
            {testing ? "Kontrol ediliyor…" : "Şimdi kontrol et"}
          </Button>
        )}
      </div>
    </div>
  );
}
