import { formatExpenseRow } from "@/lib/parcel-display";
import type { Expense, ExpenseWithParcel } from "@filizlen/shared";

export function ExpenseList({
  expenses,
  variant = "farm",
}: {
  expenses: (Expense | ExpenseWithParcel)[];
  variant?: "farm" | "parcel";
}) {
  if (expenses.length === 0) {
    return <p className="text-sm text-muted">Henüz masraf yok.</p>;
  }

  return (
    <ul className="space-y-2">
      {expenses.map((e) => {
        const row = formatExpenseRow(e);
        return (
          <li
            key={e.id}
            className="glass-card rounded-xl px-4 py-3 flex justify-between gap-3 items-start text-sm"
          >
            <div className="min-w-0">
              <p className="font-medium break-words">
                {row.title}
                {variant === "parcel" && e.note ? ` — ${e.note}` : ""}
              </p>
              {variant === "farm" && (
                <>
                  <p className="text-xs text-muted mt-0.5">{row.subtitle}</p>
                  {e.note && <p className="text-xs mt-1">{e.note}</p>}
                </>
              )}
            </div>
            <span className="font-medium shrink-0">{row.amount}</span>
          </li>
        );
      })}
    </ul>
  );
}
