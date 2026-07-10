import { ParcelExpensesPanel } from "@/components/parcels/ParcelExpensesPanel";
import { loadParcelExpenses } from "@/lib/parcel-page";

export default async function ParcelExpensesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const expenses = await loadParcelExpenses(id);
  return <ParcelExpensesPanel parcelId={id} initialExpenses={expenses} />;
}
