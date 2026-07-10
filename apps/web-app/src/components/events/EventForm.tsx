"use client";

import { Field, SelectInput, TextAreaInput } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { formatParcelTitle } from "@/lib/parcel-display";
import {
  createParcelEventSchema,
  PARCEL_EVENT_TYPES,
  PARCEL_EVENT_TYPE_LABELS,
} from "@filizlen/shared";
import type { Parcel } from "@filizlen/shared";
import { useId, useState } from "react";

export function EventForm({
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
    type: (typeof PARCEL_EVENT_TYPES)[number];
    body: string;
  }) => Promise<void>;
}) {
  const uid = useId();
  const [parcelId, setParcelId] = useState(fixedParcelId ?? parcels?.[0]?.id ?? "");
  const [type, setType] = useState<string>("note");
  const [body, setBody] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFieldError(null);
    const targetParcel = fixedParcelId ?? parcelId;
    const parsed = createParcelEventSchema.safeParse({ type, body: body.trim() || null });
    if (!targetParcel) {
      setFieldError("Parsel seçin");
      return;
    }
    if (!parsed.success) {
      setFieldError(parsed.error.issues[0]?.message ?? "Geçersiz giriş");
      return;
    }
    if (!body.trim()) {
      setFieldError("Açıklama yazın");
      return;
    }
    await onSubmit({
      parcelId: targetParcel,
      type: parsed.data.type as (typeof PARCEL_EVENT_TYPES)[number],
      body: body.trim(),
    });
    setBody("");
  }

  const displayError = fieldError ?? error;

  return (
    <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-4 sm:p-5 space-y-4">
      <h2 className="font-semibold">Olay ekle</h2>
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
        <Field label="Tür" htmlFor={`${uid}-type`}>
          <SelectInput id={`${uid}-type`} value={type} onChange={(e) => setType(e.target.value)}>
            {PARCEL_EVENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {PARCEL_EVENT_TYPE_LABELS[t]}
              </option>
            ))}
          </SelectInput>
        </Field>
      </div>
      <Field label="Açıklama" htmlFor={`${uid}-body`}>
        <TextAreaInput
          id={`${uid}-body`}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={3}
          placeholder="Örn: 2. sulama yapıldı"
        />
      </Field>
      <Button type="submit" disabled={saving || !body.trim()} className="w-full sm:w-auto">
        {saving ? "Kaydediliyor…" : "Kaydet"}
      </Button>
    </form>
  );
}
