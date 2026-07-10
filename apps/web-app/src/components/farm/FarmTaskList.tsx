"use client";

import { Button } from "@/components/ui/Button";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { ApiErrorBanner } from "@/components/ui/ApiErrorBanner";
import { useState } from "react";
import { useSyncedState } from "@/hooks/useSyncedState";
import { formatParcelTitle } from "@/lib/parcel-display";
import { getApiClient } from "@/lib/api";
import { cn } from "@/lib/utils";
import { FARM_TASK_TYPE_LABELS } from "@filizlen/shared";
import type { FarmTask } from "@filizlen/shared";
import {
  AlertTriangle,
  CheckCircle2,
  Droplets,
  Loader2,
  Sprout,
} from "lucide-react";

const TASK_META: Record<
  string,
  { icon: typeof Droplets; tone: "primary" | "accent" | "warning" }
> = {
  irrigation: { icon: Droplets, tone: "accent" },
  fertilization: { icon: Sprout, tone: "primary" },
  spray: { icon: AlertTriangle, tone: "warning" },
  inspection: { icon: AlertTriangle, tone: "warning" },
  expense: { icon: Sprout, tone: "primary" },
  other: { icon: Sprout, tone: "primary" },
};

function formatDue(dueAt: string) {
  const due = new Date(dueAt);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate());
  if (dueDay.getTime() === today.getTime()) {
    return `Bugün ${due.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}`;
  }
  return due.toLocaleDateString("tr-TR", { day: "numeric", month: "short" });
}

export function FarmTaskList({
  tasks,
  onTaskComplete,
}: {
  tasks: FarmTask[];
  onTaskComplete?: () => void;
}) {
  const [items, setItems] = useSyncedState(tasks);
  const api = getApiClient();

  const [completingId, setCompletingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  async function completeTask(id: string) {
    setCompletingId(id);
    setActionError(null);
    try {
      await api.updateFarmTask(id, { status: "completed" });
      setItems((prev) => prev.filter((t) => t.id !== id));
      onTaskComplete?.();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "İşlem başarısız");
    } finally {
      setCompletingId(null);
    }
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {actionError && <ApiErrorBanner message={actionError} />}
      {items.map((task) => {
        const meta = TASK_META[task.task_type] ?? TASK_META.other;
        const label =
          FARM_TASK_TYPE_LABELS[task.task_type as keyof typeof FARM_TASK_TYPE_LABELS] ??
          task.task_type;
        const Icon = meta.icon;
        const isCompleting = completingId === task.id;
        return (
          <div
            key={task.id}
            className="rounded-2xl border border-white/10 bg-black/20 p-4"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-3">
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <span
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                    meta.tone === "accent" && "bg-accent/10 text-accent",
                    meta.tone === "warning" && "bg-amber-400/10 text-amber-300",
                    meta.tone === "primary" && "bg-primary/10 text-primary",
                  )}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium break-words">{task.title}</p>
                    <ToneBadge tone={meta.tone}>{label}</ToneBadge>
                    {task.priority === "high" && (
                      <ToneBadge tone="warning">Kritik</ToneBadge>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-muted">
                    {task.parcel_label
                      ? task.parcel_label
                      : task.parcel_ada
                        ? formatParcelTitle(task)
                        : "Parsel"}
                  </p>
                  <p className="mt-1 text-xs text-muted sm:hidden">{formatDue(task.due_at)}</p>
                </div>
              </div>
              <div className="flex items-center justify-between gap-2 sm:flex-col sm:items-end sm:shrink-0 border-t border-white/5 pt-3 sm:border-0 sm:pt-0">
                <span className="text-xs text-muted hidden sm:block">{formatDue(task.due_at)}</span>
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={isCompleting}
                  onClick={() => completeTask(task.id)}
                  className="w-full sm:w-auto"
                >
                  {isCompleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                  Tamamla
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
