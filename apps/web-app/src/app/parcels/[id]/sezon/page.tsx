import { ParcelSeasonForm } from "@/components/parcels/ParcelSeasonForm";
import { loadParcelSeason } from "@/lib/parcel-page";

export default async function ParcelSeasonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const season = await loadParcelSeason(id);
  return <ParcelSeasonForm parcelId={id} initialSeason={season} />;
}
