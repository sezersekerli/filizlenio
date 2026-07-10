"use client";

import { ExpenseForm } from "@/components/expenses/ExpenseForm";
import { ExpenseList } from "@/components/expenses/ExpenseList";
import { NoParcelsPrompt } from "@/components/parcels/NoParcelsPrompt";
import { FarmQuickNav } from "@/components/farm/FarmQuickNav";
import { ApiErrorBanner } from "@/components/ui/ApiErrorBanner";
import { PageHeader } from "@/components/ui/PageHeader";
import { useAsyncAction } from "@/hooks/useAsyncAction";
import { useSyncedState } from "@/hooks/useSyncedState";
import { formatMoneyTry } from "@/lib/parcel-display";
import { getApiClient } from "@/lib/api";
import type { ExpenseWithParcel, Parcel } from "@filizlen/shared";
import { useCallback } from "react";

export function FarmExpensesView({
  parcels,
  initialExpenses,
  loadError,
}: {
  parcels: Parcel[];
  initialExpenses: ExpenseWithParcel[];
  loadError?: string | null;
}) {
  const api = getApiClient();
  const [expenses, setExpenses] = useSyncedState(initialExpenses);

  const reload = useCallback(async () => {
    setExpenses(await api.listFarmExpenses());
  }, [api, setExpenses]);

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
      await reload();
    },
  );

  const total = expenses.reduce((s, e) => s + Number(e.amount), 0);

  return (
    <div className="space-y-5 md:space-y-8">
      <PageHeader
        eyebrow="Tarla yönetimi"
        title="Masraflar"
        description="Gübre, mazot, ilaç — ne harcadığınızı tek yerden takip edin."
      />
      <FarmQuickNav />
      {loadError && <ApiErrorBanner message={loadError} />}

      <div className="glass-card rounded-2xl p-4 sm:p-5">
        <p className="text-sm text-muted">Bu yıl toplam</p>
        <p className="text-2xl sm:text-3xl font-bold text-gradient mt-1">{formatMoneyTry(total)}</p>
      </div>

      {parcels.length === 0 ? (
        <NoParcelsPrompt message="Masraf girmek için önce bir parsel kaydedin." />
      ) : (
        <ExpenseForm parcels={parcels} saving={saving} error={error} onSubmit={submit} />
      )}

      <section className="space-y-3">
        <h2 className="font-semibold">Son kayıtlar</h2>
        <ExpenseList expenses={expenses} variant="farm" />
      </section>
    </div>
  );
}
