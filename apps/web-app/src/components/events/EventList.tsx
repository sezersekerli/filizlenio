import { PARCEL_EVENT_TYPE_LABELS } from "@filizlen/shared";
import type { ParcelEvent, ParcelEventWithParcel } from "@filizlen/shared";

export function EventList({
  events,
  variant = "farm",
}: {
  events: (ParcelEvent | ParcelEventWithParcel)[];
  variant?: "farm" | "parcel";
}) {
  if (events.length === 0) {
    return <p className="text-sm text-muted">Henüz olay yok.</p>;
  }

  return (
    <ul className="space-y-2">
      {events.map((ev) => (
        <li key={ev.id} className="glass-card rounded-xl px-4 py-3">
          <div className="flex justify-between gap-2 text-sm">
            <span className="text-xs font-medium text-primary">
              {PARCEL_EVENT_TYPE_LABELS[ev.type as keyof typeof PARCEL_EVENT_TYPE_LABELS] ??
                ev.type}
            </span>
            <span className="text-xs text-muted shrink-0">
              {new Date(ev.occurred_at).toLocaleDateString("tr-TR")}
            </span>
          </div>
          {ev.body && <p className="text-sm mt-1 break-words">{ev.body}</p>}
          {variant === "farm" && "parcel_ada" in ev && (
            <p className="text-xs text-muted mt-1">
              {ev.parcel_label ??
                (ev.parcel_ada
                  ? `Ada ${ev.parcel_ada} / ${ev.parcel_parsel_no}`
                  : "")}
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}
