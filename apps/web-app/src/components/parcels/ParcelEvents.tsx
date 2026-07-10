"use client";

import { EventForm } from "@/components/events/EventForm";
import { EventList } from "@/components/events/EventList";
import { ApiErrorBanner } from "@/components/ui/ApiErrorBanner";
import { useAsyncAction } from "@/hooks/useAsyncAction";
import { useSyncedState } from "@/hooks/useSyncedState";
import { getApiClient } from "@/lib/api";
import type { ParcelEvent } from "@filizlen/shared";
import { useCallback, useEffect, useState } from "react";

export function ParcelEvents({
  parcelId,
  initialEvents,
  loadError,
}: {
  parcelId: string;
  initialEvents?: ParcelEvent[];
  loadError?: string | null;
}) {
  const api = getApiClient();
  const hasInitial = initialEvents !== undefined;
  const [events, setEvents] = useSyncedState(initialEvents ?? []);
  const [loading, setLoading] = useState(!hasInitial);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setEvents(await api.listParcelEvents(parcelId));
    } finally {
      setLoading(false);
    }
  }, [api, parcelId, setEvents]);

  useEffect(() => {
    if (hasInitial) return;
    load();
  }, [hasInitial, load]);

  const { run: submit, loading: saving, error } = useAsyncAction(
    async (values: {
      parcelId: string;
      type: Parameters<typeof api.createParcelEvent>[1]["type"];
      body: string;
    }) => {
      await api.createParcelEvent(values.parcelId, {
        type: values.type,
        body: values.body,
      });
      await load();
    },
  );

  return (
    <div className="space-y-5 md:space-y-6">
      <h2 className="text-lg font-semibold">Olaylar</h2>
      {loadError && <ApiErrorBanner message={loadError} />}
      <EventForm parcelId={parcelId} saving={saving} error={error} onSubmit={submit} />
      {loading ? (
        <p className="text-sm text-muted text-center py-6">Yükleniyor…</p>
      ) : (
        <EventList events={events} variant="parcel" />
      )}
    </div>
  );
}
