"use client";

import { FarmTaskList } from "@/components/farm/FarmTaskList";
import type { FarmTask } from "@filizlen/shared";
import { AlertTriangle } from "lucide-react";
import { useMemo } from "react";

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function partitionTasks(tasks: FarmTask[]) {
  const now = new Date();
  const today = startOfDay(now);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const weekEnd = new Date(today);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const overdue: FarmTask[] = [];
  const todayTasks: FarmTask[] = [];
  const upcoming: FarmTask[] = [];

  for (const task of tasks) {
    const due = new Date(task.due_at);
    if (due < today) {
      overdue.push(task);
    } else if (due >= today && due < tomorrow) {
      todayTasks.push(task);
    } else if (due >= tomorrow && due < weekEnd) {
      upcoming.push(task);
    }
  }

  return { overdue, todayTasks, upcoming };
}

function TaskSection({
  title,
  tasks,
  tone,
  onTaskComplete,
}: {
  title: string;
  tasks: FarmTask[];
  tone?: "warning";
  onTaskComplete?: () => void;
}) {
  if (tasks.length === 0) return null;
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {tone === "warning" && (
          <AlertTriangle className="h-4 w-4 text-amber-300 shrink-0" />
        )}
        <h3
          className={
            tone === "warning"
              ? "text-sm font-semibold text-amber-200"
              : "text-sm font-semibold text-muted"
          }
        >
          {title} ({tasks.length})
        </h3>
      </div>
      <FarmTaskList tasks={tasks} onTaskComplete={onTaskComplete} />
    </div>
  );
}

export function FarmPendingTasks({
  tasks,
  onTaskComplete,
}: {
  tasks: FarmTask[];
  onTaskComplete?: () => void;
}) {
  const { overdue, todayTasks, upcoming } = useMemo(
    () => partitionTasks(tasks),
    [tasks],
  );

  const empty = overdue.length === 0 && todayTasks.length === 0 && upcoming.length === 0;

  if (empty) {
    return (
      <p className="text-sm text-muted text-center py-6">
        Bu hafta için bekleyen iş yok.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <TaskSection
        title="Geciken"
        tasks={overdue}
        tone="warning"
        onTaskComplete={onTaskComplete}
      />
      <TaskSection title="Bugün" tasks={todayTasks} onTaskComplete={onTaskComplete} />
      <TaskSection title="Yaklaşan" tasks={upcoming} onTaskComplete={onTaskComplete} />
    </div>
  );
}
