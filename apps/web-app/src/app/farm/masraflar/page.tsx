import { FarmExpensesView } from "@/components/farm/FarmExpensesView";
import { getServerApiClient } from "@/lib/api-server";
import { safeServerFetchAll } from "@/lib/server-fetch";
import type { ExpenseWithParcel, Parcel } from "@filizlen/shared";

export default async function FarmExpensesPage() {
  const api = await getServerApiClient();
  const result = await safeServerFetchAll<[Parcel[], ExpenseWithParcel[]]>(
    [() => api.listParcels(), () => api.listFarmExpenses()],
    "Masraflar yüklenemedi",
  );

  if (!result.ok) {
    return <FarmExpensesView parcels={[]} initialExpenses={[]} loadError={result.error} />;
  }

  const [parcels, expenses] = result.data;
  return <FarmExpensesView parcels={parcels} initialExpenses={expenses} />;
}
