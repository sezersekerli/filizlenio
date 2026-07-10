"use client";

import { EmptyState } from "@/components/ui/EmptyState";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { Button } from "@/components/ui/Button";
import {
  activityCategoryLabel,
  activityDisplayTitle,
  groupActivityByDay,
} from "@/lib/farm-activity-display";
import { formatMoneyTry, formatParcelTitle } from "@/lib/parcel-display";
import { getApiClient } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { FarmActivityItem } from "@filizlen/shared";
import { Banknote, CheckCircle2, ClipboardList, Loader2 } from "lucide-react";
import { useState } from "react";
import { useSyncedState } from "@/hooks/useSyncedState";

const KIND_META = {
  task_completed: {
    icon: CheckCircle2,
    tone: "primary" as const,
    label: "İş",
  },
  event: {
    icon: ClipboardList,
    tone: "accent" as const,
    label: "Olay",
  },
  expense: {
    icon: Banknote,
    tone: "warning" as const,
    label: "Masraf",
  },
};

function ActivityRow({ item, compact }: { item: FarmActivityItem; compact?: boolean }) {
  const meta = KIND_META[item.kind];
  const Icon = meta.icon;
  const category = activityCategoryLabel(item);
  const parcelName =
    item.parcel_label?.trim() ||
    (item.parcel_ada ? formatParcelTitle(item) : "Parsel");

  return (
    <div
      className={cn(
        "flex items-start gap-3",
        compact ? "py-2" : "rounded-2xl border border-white/10 bg-black/20 p-4",
      )}
    >
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
          <p className={cn("font-medium break-words", compact && "text-sm")}>
            {activityDisplayTitle(item)}
          </p>
          {!compact && <ToneBadge tone={meta.tone}>{meta.label}</ToneBadge>}
          {category && !compact && (
            <ToneBadge tone="primary">{category}</ToneBadge>
          )}
        </div>
        <p className="mt-0.5 text-xs text-muted">{parcelName}</p>
        {item.subtitle && item.kind !== "expense" && (
          <p className="mt-1 text-xs text-muted line-clamp-2">{item.subtitle}</p>
        )}
        {item.kind === "expense" && item.amount != null && (
          <p className="mt-1 text-sm font-medium text-amber-200">
            {formatMoneyTry(item.amount)}
          </p>
        )}
        {compact && (
          <p className="mt-0.5 text-[11px] text-muted">
            {new Date(item.occurred_at).toLocaleTimeString("tr-TR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        )}
      </div>
    </div>
  );
}

export function FarmActivityTimeline({
  initialItems,
  compact = false,
  loadMore = false,
  parcelId,
}: {
  initialItems: FarmActivityItem[];
  compact?: boolean;
  loadMore?: boolean;
  parcelId?: string;
}) {
  const [items, setItems] = useSyncedState(initialItems);
  const [loading, setLoading] = useState(false);

  async function handleLoadMore() {
    if (items.length === 0) return;
    setLoading(true);
    try {
      const api = getApiClient();
      const before = items[items.length - 1]?.occurred_at;
      const more = parcelId
        ? await api.listParcelActivity(parcelId, { limit: 30, before })
        : await api.listFarmActivity({ limit: 30, before });
      setItems((prev) => [...prev, ...more]);
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={ClipboardList}
        title="Henüz kayıt yok"
        description="İş tamamlayın, olay veya masraf ekleyin — burada görünecek."
      />
    );
  }

  const groups = groupActivityByDay(items);

  return (
    <div className="space-y-5">
      {groups.map(([day, dayItems]) => (
        <div key={day} className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted px-1">
            {day}
          </h3>
          <div className={cn("space-y-2", !compact && "space-y-3")}>
            {dayItems.map((item) => (
              <ActivityRow key={`${item.kind}-${item.id}`} item={item} compact={compact} />
            ))}
          </div>
        </div>
      ))}
      {loadMore && items.length >= 5 && (
        <Button
          variant="secondary"
          className="w-full"
          disabled={loading}
          onClick={handleLoadMore}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Daha fazla yükle"}
        </Button>
      )}
    </div>
  );
}
