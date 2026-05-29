import { ParcelsListView } from "@/components/parcels/ParcelsListView";
import { getServerApiClient } from "@/lib/api-server";

export default async function ParcelsPage() {
  let parcels: Awaited<ReturnType<Awaited<ReturnType<typeof getServerApiClient>>["listParcels"]>> = [];

  try {
    parcels = await (await getServerApiClient()).listParcels();
  } catch {
    parcels = [];
  }

  return <ParcelsListView parcels={parcels} />;
}
