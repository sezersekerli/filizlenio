"use client";

import { Button } from "@/components/ui/Button";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { getApiClient } from "@/lib/api";
import { defaultTransition, fadeInUp } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { FarmTask } from "@filizlen/shared";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  Droplets,
  Loader2,
  Sprout,
} from "lucide-react";
import { useState } from "react";

const TASK_META: Record<
  string,
  { label: string; icon: typeof Droplets; tone: "primary" | "accent" | "warning" }
> = {
  irrigation: { label: "Sulama", icon: Droplets, tone: "accent" },
  fertilization: { label: "Gübreleme", icon: Sprout, tone: "primary" },
  spray: { label: "İlaçlama", icon: AlertTriangle, tone: "warning" },
  inspection: { label: "Kontrol", icon: AlertTriangle, tone: "warning" },
  expense: { label: "Masraf", icon: Sprout, tone: "primary" },
  other: { label: "Diğer", icon: Sprout, tone: "primary" },
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

function parcelLabel(task: FarmTask) {
  return (
    task.parcel_label ||
    (task.parcel_ada ? `Ada ${task.parcel_ada} / ${task.parcel_parsel_no}` : "Parsel")
  );
}

export function FarmTaskList({
  tasks: initialTasks,
  onTaskComplete,
}: {
  tasks: FarmTask[];
  onTaskComplete?: () => void;
}) {
  const [tasks, setTasks] = useState(initialTasks);
  const [completing, setCompleting] = useState<string | null>(null);
  const api = getApiClient();

  async function completeTask(id: string) {
    setCompleting(id);
    try {
      await api.updateFarmTask(id, { status: "completed" });
      setTasks((prev) => prev.filter((t) => t.id !== id));
      onTaskComplete?.();
    } finally {
      setCompleting(null);
    }
  }

  if (tasks.length === 0) {
    return (
      <p className="text-sm text-muted text-center py-8">
        Bugün için bekleyen iş yok.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => {
        const meta = TASK_META[task.task_type] ?? TASK_META.other;
        const Icon = meta.icon;
        return (
          <motion.div
            key={task.id}
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={defaultTransition}
            className="rounded-2xl border border-white/10 bg-black/20 p-4"
          >
            <div className="flex items-start gap-3">
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
                  <p className="font-medium">{task.title}</p>
                  <ToneBadge tone={meta.tone}>{meta.label}</ToneBadge>
                  {task.priority === "high" && (
                    <ToneBadge tone="warning">Kritik</ToneBadge>
                  )}
                </div>
                <p className="mt-1 text-xs text-muted">{parcelLabel(task)}</p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2">
                <span className="text-xs text-muted">{formatDue(task.due_at)}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={completing === task.id}
                  onClick={() => completeTask(task.id)}
                >
                  {completing === task.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  )}
                  Tamamla
                </Button>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
