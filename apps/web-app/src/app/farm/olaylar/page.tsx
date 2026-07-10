import { FarmEventsView } from "@/components/farm/FarmEventsView";
import { getServerApiClient } from "@/lib/api-server";
import { safeServerFetchAll } from "@/lib/server-fetch";
import type { Parcel, ParcelEventWithParcel } from "@filizlen/shared";

export default async function FarmEventsPage() {
  const api = await getServerApiClient();
  const result = await safeServerFetchAll<[Parcel[], ParcelEventWithParcel[]]>(
    [() => api.listParcels(), () => api.listFarmEvents()],
    "Olaylar yüklenemedi",
  );

  if (!result.ok) {
    return <FarmEventsView parcels={[]} initialEvents={[]} loadError={result.error} />;
  }

  const [parcels, events] = result.data;
  return <FarmEventsView parcels={parcels} initialEvents={events} />;
}
