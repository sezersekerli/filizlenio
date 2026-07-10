import {
  EXPENSE_CATEGORY_LABELS,
  FARM_TASK_TYPE_LABELS,
  PARCEL_EVENT_TYPE_LABELS,
} from "@filizlen/shared";
import type { FarmActivityItem } from "@filizlen/shared";

export function activityDisplayTitle(item: FarmActivityItem): string {
  if (item.kind === "expense") {
    const label =
      EXPENSE_CATEGORY_LABELS[
        item.category as keyof typeof EXPENSE_CATEGORY_LABELS
      ] ?? item.title;
    return label;
  }
  if (item.kind === "event") {
    const typeLabel =
      PARCEL_EVENT_TYPE_LABELS[
        item.category as keyof typeof PARCEL_EVENT_TYPE_LABELS
      ];
    if (typeLabel && (!item.title || item.title === item.category)) {
      return typeLabel;
    }
    return item.title || typeLabel || "Olay";
  }
  if (item.kind === "task_completed") {
    return item.title;
  }
  return item.title;
}

export function activityCategoryLabel(item: FarmActivityItem): string | null {
  if (item.kind === "task_completed" && item.category) {
    return (
      FARM_TASK_TYPE_LABELS[
        item.category as keyof typeof FARM_TASK_TYPE_LABELS
      ] ?? null
    );
  }
  if (item.kind === "event" && item.category) {
    return (
      PARCEL_EVENT_TYPE_LABELS[
        item.category as keyof typeof PARCEL_EVENT_TYPE_LABELS
      ] ?? null
    );
  }
  return null;
}

export function groupActivityByDay(items: FarmActivityItem[]) {
  const groups = new Map<string, FarmActivityItem[]>();
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  for (const item of items) {
    const d = new Date(item.occurred_at);
    const day = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    let label: string;
    if (day.getTime() === today.getTime()) {
      label = "Bugün";
    } else if (day.getTime() === yesterday.getTime()) {
      label = "Dün";
    } else {
      label = d.toLocaleDateString("tr-TR", { day: "numeric", month: "long" });
    }
    const list = groups.get(label) ?? [];
    list.push(item);
    groups.set(label, list);
  }
  return [...groups.entries()];
}
