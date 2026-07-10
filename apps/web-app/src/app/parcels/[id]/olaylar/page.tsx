import { ParcelEvents } from "@/components/parcels/ParcelEvents";
import { loadParcelEvents } from "@/lib/parcel-page";

export default async function ParcelEventsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const events = await loadParcelEvents(id);
  return <ParcelEvents parcelId={id} initialEvents={events} />;
}
