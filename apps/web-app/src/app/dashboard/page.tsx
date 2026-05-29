import { DashboardView } from "@/components/dashboard/DashboardView";
import { getServerApiClient } from "@/lib/api-server";

export default async function DashboardPage() {
  let parcels: Awaited<ReturnType<Awaited<ReturnType<typeof getServerApiClient>>["listParcels"]>> = [];
  let error: string | null = null;

  try {
    parcels = await (await getServerApiClient()).listParcels();
  } catch (e) {
    error = e instanceof Error ? e.message : "Parseller yüklenemedi";
  }

  return <DashboardView parcels={parcels} error={error} />;
}
