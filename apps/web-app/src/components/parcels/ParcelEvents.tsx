"use client";

import { getApiClient } from "@/lib/api";
import { defaultTransition, fadeInUp, staggerContainer } from "@/lib/motion";
import type { ParcelEvent } from "@filizlen/shared";
import { PARCEL_EVENT_TYPES } from "@filizlen/shared";
import { motion } from "framer-motion";
import { Calendar, Droplets, MessageSquare, Sprout, Wheat } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

const TYPE_META: Record<
  string,
  { label: string; icon: typeof MessageSquare; color: string }
> = {
  note: { label: "Not", icon: MessageSquare, color: "text-sky-400" },
  irrigation_manual: { label: "Sulama", icon: Droplets, color: "text-blue-400" },
  planting: { label: "Ekim", icon: Sprout, color: "text-primary" },
  harvest: { label: "Hasat", icon: Wheat, color: "text-amber-400" },
};

export function ParcelEvents({ parcelId }: { parcelId: string }) {
  const api = getApiClient();
  const [events, setEvents] = useState<ParcelEvent[]>([]);
  const [type, setType] = useState<string>("note");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await api.listParcelEvents(parcelId);
      setEvents(data);
    } catch {
      setEvents([]);
    }
  }, [api, parcelId]);

  useEffect(() => {
    load();
  }, [load]);

  async function addEvent(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.createParcelEvent(parcelId, {
        type: type as (typeof PARCEL_EVENT_TYPES)[number],
        body: body || null,
      });
      setBody("");
      await load();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Calendar className="w-5 h-5 text-primary" />
        Olaylar & takip
      </h2>

      <form onSubmit={addEvent} className="glass-card glow-border rounded-2xl p-5 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="input-field"
          >
            {PARCEL_EVENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {TYPE_META[t]?.label ?? t}
              </option>
            ))}
          </select>
        </div>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Not veya açıklama yazın..."
          className="input-field min-h-[100px] resize-y"
        />
        <Button type="submit" disabled={loading} size="sm">
          Olay ekle
        </Button>
      </form>

      {events.length === 0 ? (
        <p className="text-muted text-sm text-center py-8 glass-card rounded-xl">
          Henüz olay kaydı yok. İlk notunuzu ekleyin.
        </p>
      ) : (
        <motion.ul
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative space-y-0 pl-6 border-l-2 timeline-line ml-3"
        >
          {events.map((ev, i) => {
            const meta = TYPE_META[ev.type] ?? TYPE_META.note;
            const Icon = meta.icon;
            return (
              <motion.li
                key={ev.id}
                variants={fadeInUp}
                transition={{ ...defaultTransition, delay: i * 0.05 }}
                className="relative pb-6 last:pb-0"
              >
                <span className="absolute -left-[1.65rem] top-1 w-3 h-3 rounded-full bg-primary ring-4 ring-[var(--background)]" />
                <div className="glass-card glow-border rounded-xl p-4 ml-2">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${meta.color}`} />
                    <span className={`text-xs font-semibold uppercase tracking-wide ${meta.color}`}>
                      {meta.label}
                    </span>
                    <span className="text-xs text-muted ml-auto">
                      {new Date(ev.occurred_at).toLocaleString("tr-TR")}
                    </span>
                  </div>
                  {ev.body && <p className="mt-3 text-sm leading-relaxed">{ev.body}</p>}
                </div>
              </motion.li>
            );
          })}
        </motion.ul>
      )}
    </div>
  );
}
