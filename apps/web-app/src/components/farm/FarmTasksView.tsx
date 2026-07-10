"use client";

import { FarmActivityTimeline } from "@/components/farm/FarmActivityTimeline";
import { FarmPendingTasks } from "@/components/farm/FarmPendingTasks";
import { Field, SelectInput, TextInput } from "@/components/ui/Field";
import { getApiClient } from "@/lib/api";
import { formatParcelTitle } from "@/lib/parcel-display";
import { createFarmTaskSchema, FARM_TASK_TYPES, FARM_TASK_TYPE_LABELS } from "@filizlen/shared";
import type { FarmActivityItem, FarmTask, Parcel } from "@filizlen/shared";
import { useId, useState } from "react";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { ApiErrorBanner } from "@/components/ui/ApiErrorBanner";
import { NoParcelsPrompt } from "@/components/parcels/NoParcelsPrompt";
import { FarmQuickNav } from "./FarmQuickNav";
import { useAsyncAction } from "@/hooks/useAsyncAction";
import { useSyncedState } from "@/hooks/useSyncedState";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

type Tab = "yapilacak" | "gecmis";

export function FarmTasksView({
  parcels,
  initialTasks,
  initialActivity,
  loadError,
  summaryBadge,
}: {
  parcels: Parcel[];
  initialTasks: FarmTask[];
  initialActivity: FarmActivityItem[];
  loadError?: string | null;
  summaryBadge?: number;
}) {
  const uid = useId();
  const api = getApiClient();
  const searchParams = useSearchParams();
  const initialTab: Tab = searchParams.get("tab") === "gecmis" ? "gecmis" : "yapilacak";
  const [tab, setTab] = useState<Tab>(initialTab);
  const [tasks, setTasks] = useSyncedState(initialTasks);
  const [activity, setActivity] = useSyncedState(initialActivity);
  const [parcelId, setParcelId] = useState(parcels[0]?.id ?? "");
  const [title, setTitle] = useState("");
  const [taskType, setTaskType] = useState<string>("other");
  const [dueAt, setDueAt] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 16);
  });
  const [fieldError, setFieldError] = useState<string | null>(null);

  async function refreshAfterComplete() {
    const [nextTasks, nextActivity] = await Promise.all([
      api.listFarmTasks({ status: "pending", scope: "week" }),
      api.listFarmActivity({ limit: 30 }),
    ]);
    setTasks(nextTasks);
    setActivity(nextActivity);
  }

  const { run: submit, loading: saving, error } = useAsyncAction(async () => {
    setFieldError(null);
    const parsed = createFarmTaskSchema.safeParse({
      parcel_id: parcelId,
      title: title.trim(),
      task_type: taskType,
      due_at: new Date(dueAt).toISOString(),
    });
    if (!parsed.success) {
      setFieldError(parsed.error.issues[0]?.message ?? "Geçersiz giriş");
      return;
    }
    const created = await api.createFarmTask(parsed.data);
    setTasks((prev) => [created, ...prev]);
    setTitle("");
  });

  return (
    <div className="space-y-5 md:space-y-8">
      <PageHeader
        eyebrow="Tarla yönetimi"
        title="İşler"
        description="Yapılacaklar ve geçmiş — sulama, ilaç, masraf ve olaylar bir arada."
      />
      <FarmQuickNav taskBadge={summaryBadge} />

      <div className="flex gap-2">
        {(
          [
            ["yapilacak", "Yapılacak"],
            ["gecmis", "Geçmiş"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={cn(
              "flex-1 rounded-xl px-4 py-3 min-h-[44px] text-sm font-medium transition-colors",
              tab === key
                ? "bg-primary/15 text-primary border border-primary/30"
                : "glass-card text-muted hover:text-foreground",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {loadError && <ApiErrorBanner message={loadError} />}

      {tab === "yapilacak" ? (
        <>
          {parcels.length === 0 ? (
            <NoParcelsPrompt message="İş eklemek için önce bir parsel kaydedin." />
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit();
              }}
              className="glass-card rounded-2xl p-4 sm:p-5 space-y-4"
            >
              <h2 className="font-semibold">İş ekle</h2>
              {(fieldError || error) && (
                <p role="alert" className="text-sm text-red-300 bg-red-500/10 rounded-xl px-3 py-2">
                  {fieldError ?? error}
                </p>
              )}
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Başlık" htmlFor={`${uid}-title`} className="sm:col-span-2">
                  <TextInput
                    id={`${uid}-title`}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Örn: Tarla kenarı kontrolü"
                  />
                </Field>
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
                <Field label="Tür" htmlFor={`${uid}-type`}>
                  <SelectInput
                    id={`${uid}-type`}
                    value={taskType}
                    onChange={(e) => setTaskType(e.target.value)}
                  >
                    {FARM_TASK_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {FARM_TASK_TYPE_LABELS[t]}
                      </option>
                    ))}
                  </SelectInput>
                </Field>
                <Field label="Tarih" htmlFor={`${uid}-due`} className="sm:col-span-2">
                  <TextInput
                    id={`${uid}-due`}
                    type="datetime-local"
                    value={dueAt}
                    onChange={(e) => setDueAt(e.target.value)}
                  />
                </Field>
              </div>
              <Button type="submit" disabled={saving || !title.trim()} className="w-full sm:w-auto">
                {saving ? "Kaydediliyor…" : "Kaydet"}
              </Button>
            </form>
          )}

          <section className="space-y-3">
            <h2 className="font-semibold">Yapılacak işler</h2>
            <FarmPendingTasks tasks={tasks} onTaskComplete={refreshAfterComplete} />
          </section>
        </>
      ) : (
        <section className="space-y-3">
          <h2 className="font-semibold">Geçmiş aktivite</h2>
          <p className="text-xs text-muted">
            Tamamlanan işler, olaylar ve masraflar kronolojik sırada.
          </p>
          <FarmActivityTimeline initialItems={activity} loadMore />
        </section>
      )}
    </div>
  );
}
