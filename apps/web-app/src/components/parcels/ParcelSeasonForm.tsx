"use client";

import { Field, TextAreaInput, TextInput } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { LoadingState } from "@/components/ui/LoadingState";
import { useAsyncAction } from "@/hooks/useAsyncAction";
import { getApiClient } from "@/lib/api";
import { upsertParcelSeasonSchema, type ParcelSeason } from "@filizlen/shared";
import { useCallback, useEffect, useState } from "react";

export function ParcelSeasonForm({
  parcelId,
  initialSeason,
}: {
  parcelId: string;
  initialSeason?: ParcelSeason | null;
}) {
  const api = getApiClient();
  const hasInitial = initialSeason !== undefined;
  const [loading, setLoading] = useState(!hasInitial);
  const [season, setSeason] = useState<ParcelSeason | null>(initialSeason ?? null);
  const [crop, setCrop] = useState(initialSeason?.crop ?? "");
  const [plantedAt, setPlantedAt] = useState(
    initialSeason?.planted_at ? initialSeason.planted_at.slice(0, 10) : "",
  );
  const [stage, setStage] = useState(initialSeason?.stage ?? "Başlangıç");
  const [progress, setProgress] = useState(initialSeason?.progress_pct ?? 0);
  const [notes, setNotes] = useState(initialSeason?.notes ?? "");
  const [fieldError, setFieldError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const s = await api.getParcelSeason(parcelId);
      setSeason(s);
      if (s) {
        setCrop(s.crop);
        setPlantedAt(s.planted_at ? s.planted_at.slice(0, 10) : "");
        setStage(s.stage);
        setProgress(s.progress_pct);
        setNotes(s.notes ?? "");
      }
    } finally {
      setLoading(false);
    }
  }, [api, parcelId]);

  useEffect(() => {
    if (hasInitial) return;
    load();
  }, [hasInitial, load]);

  const { run: save, loading: saving, error } = useAsyncAction(async () => {
    setFieldError(null);
    const parsed = upsertParcelSeasonSchema.safeParse({
      crop,
      planted_at: plantedAt || null,
      stage,
      progress_pct: progress,
      notes: notes || null,
    });
    if (!parsed.success) {
      setFieldError(parsed.error.issues[0]?.message ?? "Geçersiz giriş");
      return;
    }
    const updated = await api.upsertParcelSeason(parcelId, parsed.data);
    setSeason(updated);
  });

  if (loading) return <LoadingState label="Sezon bilgisi yükleniyor…" />;

  const displayError = fieldError ?? error;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save();
      }}
      className="glass-card rounded-2xl p-4 sm:p-5 space-y-4 max-w-lg"
    >
      <div>
        <h2 className="font-semibold">Sezon</h2>
        <p className="text-xs text-muted mt-1">
          Ürün ve ekim tarihi — NDVI grafiği ekimden itibaren hesaplanır.
        </p>
      </div>
      {displayError && (
        <p role="alert" className="text-sm text-red-300 bg-red-500/10 rounded-xl px-3 py-2">
          {displayError}
        </p>
      )}
      <Field label="Ürün" htmlFor="season-crop">
        <TextInput
          id="season-crop"
          value={crop}
          onChange={(e) => setCrop(e.target.value)}
          placeholder="Örn: Buğday"
          required
        />
      </Field>
      <Field label="Ekim tarihi" htmlFor="season-planted">
        <TextInput
          id="season-planted"
          type="date"
          value={plantedAt}
          onChange={(e) => setPlantedAt(e.target.value)}
        />
      </Field>
      <Field label="Aşama" htmlFor="season-stage">
        <TextInput id="season-stage" value={stage} onChange={(e) => setStage(e.target.value)} />
      </Field>
      <div>
        <label htmlFor="season-progress" className="text-xs text-muted">
          Sezon ilerlemesi: %{progress}
        </label>
        <input
          id="season-progress"
          type="range"
          min={0}
          max={100}
          value={progress}
          onChange={(e) => setProgress(Number(e.target.value))}
          className="w-full mt-2 min-h-[44px]"
        />
      </div>
      <Field label="Not (isteğe bağlı)" htmlFor="season-notes">
        <TextAreaInput
          id="season-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
        />
      </Field>
      {season && (
        <p className="text-xs text-muted">
          Son güncelleme:{" "}
          {new Date(season.updated_at ?? season.created_at).toLocaleString("tr-TR")}
        </p>
      )}
      <Button type="submit" disabled={saving} className="w-full sm:w-auto">
        {saving ? "Kaydediliyor…" : "Kaydet"}
      </Button>
    </form>
  );
}
