import { ParcelsListView } from "@/components/parcels/ParcelsListView";
import { fetchParcels } from "@/lib/fetch-parcels";

export default async function ParcelsPage() {
  const { parcels, error } = await fetchParcels();
  return <ParcelsListView parcels={parcels} error={error} />;
}
