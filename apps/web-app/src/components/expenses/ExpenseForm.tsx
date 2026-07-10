"use client";

import { Field, SelectInput, TextInput } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { formatParcelTitle } from "@/lib/parcel-display";
import { createExpenseSchema, EXPENSE_CATEGORIES, EXPENSE_CATEGORY_LABELS } from "@filizlen/shared";
import type { Parcel } from "@filizlen/shared";
import { useId, useState } from "react";

export type ExpenseFormValues = {
  parcelId?: string;
  category: string;
  amount: string;
  note: string;
};

export function ExpenseForm({
  parcels,
  parcelId: fixedParcelId,
  saving,
  error,
  onSubmit,
}: {
  parcels?: Parcel[];
  parcelId?: string;
  saving: boolean;
  error?: string | null;
  onSubmit: (values: {
    parcelId: string;
    category: (typeof EXPENSE_CATEGORIES)[number];
    amount: number;
    note?: string;
  }) => Promise<void>;
}) {
  const uid = useId();
  const [parcelId, setParcelId] = useState(fixedParcelId ?? parcels?.[0]?.id ?? "");
  const [category, setCategory] = useState<string>("other");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFieldError(null);
    const targetParcel = fixedParcelId ?? parcelId;
    const parsed = createExpenseSchema.safeParse({
      category,
      amount: Number(amount),
      note: note || undefined,
    });
    if (!targetParcel) {
      setFieldError("Parsel seçin");
      return;
    }
    if (!parsed.success) {
      setFieldError(parsed.error.issues[0]?.message ?? "Geçersiz tutar");
      return;
    }
    await onSubmit({
      parcelId: targetParcel,
      category: parsed.data.category as (typeof EXPENSE_CATEGORIES)[number],
      amount: parsed.data.amount,
      note: parsed.data.note ?? undefined,
    });
    setAmount("");
    setNote("");
  }

  const displayError = fieldError ?? error;

  return (
    <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-4 sm:p-5 space-y-4">
      <h2 className="font-semibold">Masraf ekle</h2>
      {displayError && (
        <p role="alert" className="text-sm text-red-300 bg-red-500/10 rounded-xl px-3 py-2">
          {displayError}
        </p>
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        {!fixedParcelId && parcels && parcels.length > 0 && (
          <Field label="Parsel" htmlFor={`${uid}-parcel`}>
            <SelectInput
              id={`${uid}-parcel`}
              value={parcelId}
              onChange={(e) => setParcelId(e.target.value)}
            >
              {parcels.map((p) => (
                <option key={p.id} value={p.id}>
                  {formatParcelTitle(p)}
                </option>
              ))}
            </SelectInput>
          </Field>
        )}
        <Field label="Kategori" htmlFor={`${uid}-cat`}>
          <SelectInput
            id={`${uid}-cat`}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {EXPENSE_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {EXPENSE_CATEGORY_LABELS[c]}
              </option>
            ))}
          </SelectInput>
        </Field>
        <Field label="Tutar (₺)" htmlFor={`${uid}-amount`}>
          <TextInput
            id={`${uid}-amount`}
            type="number"
            min={0.01}
            step="0.01"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
          />
        </Field>
        <Field label="Not (isteğe bağlı)" htmlFor={`${uid}-note`} className="sm:col-span-2">
          <TextInput id={`${uid}-note`} value={note} onChange={(e) => setNote(e.target.value)} />
        </Field>
      </div>
      <Button type="submit" disabled={saving} className="w-full sm:w-auto">
        {saving ? "Kaydediliyor…" : "Kaydet"}
      </Button>
    </form>
  );
}
