import { DashboardView } from "@/components/dashboard/DashboardView";
import { fetchParcels } from "@/lib/fetch-parcels";
import { getSessionUser } from "@/lib/auth/server";

export default async function DashboardPage() {
  const [user, { parcels, error }] = await Promise.all([
    getSessionUser(),
    fetchParcels(),
  ]);

  return (
    <DashboardView parcels={parcels} error={error} plan={user?.plan ?? "free"} />
  );
}
