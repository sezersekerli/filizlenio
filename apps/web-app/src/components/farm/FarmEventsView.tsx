"use client";

import { EventForm } from "@/components/events/EventForm";
import { EventList } from "@/components/events/EventList";
import { NoParcelsPrompt } from "@/components/parcels/NoParcelsPrompt";
import { FarmQuickNav } from "@/components/farm/FarmQuickNav";
import { ApiErrorBanner } from "@/components/ui/ApiErrorBanner";
import { PageHeader } from "@/components/ui/PageHeader";
import { useAsyncAction } from "@/hooks/useAsyncAction";
import { useSyncedState } from "@/hooks/useSyncedState";
import { getApiClient } from "@/lib/api";
import type { Parcel, ParcelEventWithParcel } from "@filizlen/shared";
import { useCallback } from "react";

export function FarmEventsView({
  parcels,
  initialEvents,
  loadError,
}: {
  parcels: Parcel[];
  initialEvents: ParcelEventWithParcel[];
  loadError?: string | null;
}) {
  const api = getApiClient();
  const [events, setEvents] = useSyncedState(initialEvents);

  const reload = useCallback(async () => {
    setEvents(await api.listFarmEvents());
  }, [api, setEvents]);

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
      await reload();
    },
  );

  return (
    <div className="space-y-5 md:space-y-8">
      <PageHeader
        eyebrow="Tarla yönetimi"
        title="Olaylar"
        description="Sulama, ilaçlama, hasat — tarlada ne oldu, buraya yazın."
      />
      <FarmQuickNav />
      {loadError && <ApiErrorBanner message={loadError} />}

      {parcels.length === 0 ? (
        <NoParcelsPrompt message="Olay eklemek için önce bir parsel kaydedin." />
      ) : (
        <EventForm parcels={parcels} saving={saving} error={error} onSubmit={submit} />
      )}

      <section className="space-y-3">
        <h2 className="font-semibold">Son olaylar</h2>
        <EventList events={events} variant="farm" />
      </section>
    </div>
  );
}
