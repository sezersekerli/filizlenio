"use client";

import { getApiClient } from "@/lib/api";
import { EXPENSE_CATEGORIES, FARM_TASK_TYPES } from "@filizlen/shared";
import type { Expense, FarmTask, ParcelSeason } from "@filizlen/shared";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { LoadingState } from "@/components/ui/LoadingState";

const EXPENSE_LABELS: Record<string, string> = {
  fuel: "Mazot",
  fertilizer: "Gübre",
  pesticide: "İlaç",
  labor: "İşçilik",
  seed: "Tohum",
  irrigation: "Sulama",
  transport: "Nakliye",
  other: "Diğer",
};

const TASK_LABELS: Record<string, string> = {
  irrigation: "Sulama",
  fertilization: "Gübreleme",
  spray: "İlaçlama",
  inspection: "Kontrol",
  expense: "Masraf",
  other: "Diğer",
};

export function ParcelDetailTabs({ parcelId }: { parcelId: string }) {
  const api = getApiClient();
  const [tab, setTab] = useState<"season" | "expenses" | "tasks">("season");
  const [loading, setLoading] = useState(true);
  const [season, setSeason] = useState<ParcelSeason | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [tasks, setTasks] = useState<FarmTask[]>([]);

  const [crop, setCrop] = useState("");
  const [stage, setStage] = useState("Başlangıç");
  const [progress, setProgress] = useState(0);
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseCategory, setExpenseCategory] = useState<string>("other");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [s, e, t] = await Promise.all([
        api.getParcelSeason(parcelId),
        api.listParcelExpenses(parcelId),
        api.listParcelTasks(parcelId),
      ]);
      setSeason(s);
      setExpenses(e);
      setTasks(t);
      if (s) {
        setCrop(s.crop);
        setStage(s.stage);
        setProgress(s.progress_pct);
      }
    } finally {
      setLoading(false);
    }
  }, [api, parcelId]);

  useEffect(() => {
    load();
  }, [load]);

  async function saveSeason(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await api.upsertParcelSeason(parcelId, {
        crop,
        stage,
        progress_pct: progress,
      });
      setSeason(updated);
    } finally {
      setSaving(false);
    }
  }

  async function addExpense(e: React.FormEvent) {
    e.preventDefault();
    const amount = Number(expenseAmount);
    if (!amount || amount <= 0) return;
    setSaving(true);
    try {
      await api.createExpense(parcelId, {
        category: expenseCategory as (typeof EXPENSE_CATEGORIES)[number],
        amount,
      });
      setExpenseAmount("");
      await load();
    } finally {
      setSaving(false);
    }
  }

  const tabs = [
    { id: "season" as const, label: "Sezon" },
    { id: "expenses" as const, label: "Masraflar" },
    { id: "tasks" as const, label: "Görevler" },
  ];

  return (
    <section className="space-y-5">
      <div className="flex gap-2 border-b border-[var(--card-border)] pb-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm rounded-t-lg transition-colors ${
              tab === t.id
                ? "text-primary border-b-2 border-primary font-medium"
                : "text-muted hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingState />
      ) : tab === "season" ? (
        <form onSubmit={saveSeason} className="glass-card glow-border rounded-2xl p-5 space-y-4">
          <h3 className="font-semibold">Sezon profili</h3>
          <input
            value={crop}
            onChange={(e) => setCrop(e.target.value)}
            placeholder="Ürün (ör. Domates)"
            className="input-field"
            required
          />
          <input
            value={stage}
            onChange={(e) => setStage(e.target.value)}
            placeholder="Aşama"
            className="input-field"
          />
          <div>
            <label className="text-xs text-muted">İlerleme: %{progress}</label>
            <input
              type="range"
              min={0}
              max={100}
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              className="w-full mt-2"
            />
          </div>
          {season && (
            <p className="text-xs text-muted">
              Son güncelleme: {new Date(season.updated_at ?? season.created_at).toLocaleString("tr-TR")}
            </p>
          )}
          <Button type="submit" size="sm" disabled={saving}>
            Kaydet
          </Button>
        </form>
      ) : tab === "expenses" ? (
        <div className="space-y-4">
          <form onSubmit={addExpense} className="glass-card glow-border rounded-2xl p-5 space-y-4">
            <h3 className="font-semibold">Masraf ekle</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <select
                value={expenseCategory}
                onChange={(e) => setExpenseCategory(e.target.value)}
                className="input-field"
              >
                {EXPENSE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {EXPENSE_LABELS[c] ?? c}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min="0"
                step="0.01"
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(e.target.value)}
                placeholder="Tutar (TRY)"
                className="input-field"
                required
              />
            </div>
            <Button type="submit" size="sm" disabled={saving}>
              Masraf kaydet
            </Button>
          </form>
          {expenses.length === 0 ? (
            <p className="text-sm text-muted text-center py-6">Henüz masraf kaydı yok.</p>
          ) : (
            <ul className="space-y-2">
              {expenses.map((ex) => (
                <li key={ex.id} className="glass-card rounded-xl p-4 flex justify-between text-sm">
                  <span>
                    {EXPENSE_LABELS[ex.category] ?? ex.category}
                    {ex.note ? ` — ${ex.note}` : ""}
                  </span>
                  <span className="font-medium">
                    {Number(ex.amount).toLocaleString("tr-TR")} {ex.currency}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {tasks.length === 0 ? (
            <p className="text-sm text-muted text-center py-6">Bu parsel için görev yok.</p>
          ) : (
            tasks.map((task) => (
              <div key={task.id} className="glass-card rounded-xl p-4 text-sm">
                <div className="flex justify-between gap-2">
                  <span className="font-medium">{task.title}</span>
                  <span className="text-xs text-muted">{task.status}</span>
                </div>
                <p className="text-xs text-muted mt-1">
                  {TASK_LABELS[task.task_type] ?? task.task_type} ·{" "}
                  {new Date(task.due_at).toLocaleString("tr-TR")}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </section>
  );
}
