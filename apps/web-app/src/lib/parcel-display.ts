import type { Expense, ExpenseWithParcel, Parcel } from "@filizlen/shared";
import { EXPENSE_CATEGORY_LABELS } from "@filizlen/shared";

type ParcelLike = {
  label?: string | null;
  ada?: string | null;
  parsel_no?: string | null;
  parcel_label?: string | null;
  parcel_ada?: string | null;
  parcel_parsel_no?: string | null;
};

export function formatParcelTitle(parcel: ParcelLike): string {
  if (parcel.parcel_label) return parcel.parcel_label;
  if (parcel.label) return parcel.label;
  const ada = parcel.parcel_ada ?? parcel.ada;
  const parsel = parcel.parcel_parsel_no ?? parcel.parsel_no;
  if (!ada || !parsel) return "Parsel";
  return `Ada ${ada} / ${parsel}`;
}

export function formatExpenseCategory(category: string): string {
  return EXPENSE_CATEGORY_LABELS[category as keyof typeof EXPENSE_CATEGORY_LABELS] ?? category;
}

export function formatMoneyTry(amount: number | string): string {
  return `${Number(amount).toLocaleString("tr-TR")} ₺`;
}

export function formatExpenseRow(
  expense: Expense | ExpenseWithParcel,
): { title: string; subtitle: string; amount: string } {
  const title = formatExpenseCategory(expense.category);
  const amount = formatMoneyTry(expense.amount);
  const date = new Date(expense.occurred_at).toLocaleDateString("tr-TR");
  const parcel =
    "parcel_label" in expense && expense.parcel_label
      ? expense.parcel_label
      : "parcel_ada" in expense && expense.parcel_ada
        ? `Ada ${expense.parcel_ada} / ${expense.parcel_parsel_no}`
        : null;
  const subtitle = [parcel, date].filter(Boolean).join(" · ");
  return { title, subtitle, amount };
}
