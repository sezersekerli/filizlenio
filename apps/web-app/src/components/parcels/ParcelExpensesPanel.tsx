"use client";

import { ExpenseForm } from "@/components/expenses/ExpenseForm";
import { ExpenseList } from "@/components/expenses/ExpenseList";
import { ApiErrorBanner } from "@/components/ui/ApiErrorBanner";
import { LoadingState } from "@/components/ui/LoadingState";
import { useAsyncAction } from "@/hooks/useAsyncAction";
import { useSyncedState } from "@/hooks/useSyncedState";
import { formatMoneyTry } from "@/lib/parcel-display";
import { getApiClient } from "@/lib/api";
import type { Expense } from "@filizlen/shared";
import { useCallback, useEffect, useState } from "react";

export function ParcelExpensesPanel({
  parcelId,
  initialExpenses,
  loadError,
}: {
  parcelId: string;
  initialExpenses?: Expense[];
  loadError?: string | null;
}) {
  const api = getApiClient();
  const hasInitial = initialExpenses !== undefined;
  const [expenses, setExpenses] = useSyncedState(initialExpenses ?? []);
  const [loading, setLoading] = useState(!hasInitial);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setExpenses(await api.listParcelExpenses(parcelId));
    } finally {
      setLoading(false);
    }
  }, [api, parcelId, setExpenses]);

  useEffect(() => {
    if (hasInitial) return;
    load();
  }, [hasInitial, load]);

  const { run: submit, loading: saving, error } = useAsyncAction(
    async (values: {
      parcelId: string;
      category: Parameters<typeof api.createExpense>[1]["category"];
      amount: number;
      note?: string;
    }) => {
      await api.createExpense(values.parcelId, {
        category: values.category,
        amount: values.amount,
        note: values.note,
      });
      await load();
    },
  );

  const total = expenses.reduce((s, e) => s + Number(e.amount), 0);

  return (
    <div className="space-y-5 md:space-y-6">
      {loadError && <ApiErrorBanner message={loadError} />}
      <div className="glass-card rounded-2xl p-4 sm:p-5">
        <p className="text-sm text-muted">Bu parselde toplam</p>
        <p className="text-2xl font-bold text-gradient mt-1">{formatMoneyTry(total)}</p>
      </div>

      <ExpenseForm
        parcelId={parcelId}
        saving={saving}
        error={error}
        onSubmit={submit}
      />

      {loading ? (
        <LoadingState />
      ) : (
        <ExpenseList expenses={expenses} variant="parcel" />
      )}
    </div>
  );
}
