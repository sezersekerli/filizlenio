import { ParcelSpectralChart } from "@/components/parcels/ParcelSpectralChart";
import { loadParcelContext } from "@/lib/parcel-page";

export default async function ParcelChartPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { entitlements } = await loadParcelContext(id);
  return <ParcelSpectralChart parcelId={id} entitlements={entitlements} />;
}
