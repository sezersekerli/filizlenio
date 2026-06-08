"use client";

import { ToneBadge } from "@/components/ui/ToneBadge";
import type { NotificationMessage } from "@filizlen/shared";
import { MessageCircle, Send } from "lucide-react";
import { useState } from "react";

function statusLabel(status: string, scheduledAt: string | null) {
  if (status === "scheduled" && scheduledAt) {
    return new Date(scheduledAt).toLocaleString("tr-TR");
  }
  if (status === "draft") return "Taslak";
  if (status === "sent") return "Gönderildi";
  return status;
}

export function FarmNotificationCenter({
  notifications,
}: {
  notifications: NotificationMessage[];
}) {
  const [preview, setPreview] = useState<NotificationMessage | null>(null);

  if (notifications.length === 0) {
    return (
      <p className="text-sm text-muted text-center py-8">
        Henüz WhatsApp taslağı yok. Görev veya risk oluşturduğunuzda burada görünür.
      </p>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {notifications.map((message) => (
          <div
            key={message.id}
            className="rounded-2xl border border-primary/15 bg-primary/5 p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-primary">{message.label}</p>
              <span className="text-[11px] text-muted">
                {statusLabel(message.status, message.scheduled_at)}
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-foreground/90">{message.body}</p>
            <button
              type="button"
              onClick={() => setPreview(message)}
              className="mt-3 inline-flex items-center gap-2 rounded-xl border border-primary/25 px-3 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary/10"
            >
              <Send className="h-3.5 w-3.5" />
              Mesajı önizle
            </button>
          </div>
        ))}
      </div>

      {preview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setPreview(null)}
        >
          <div
            className="w-full max-w-md rounded-[2rem] border border-primary/20 bg-[#07110c] p-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="rounded-[1.5rem] border border-white/10 bg-gradient-to-b from-[#0d1f15] to-[#07110c] p-4">
              <div className="mb-4 flex items-center gap-2 border-b border-white/10 pb-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <MessageCircle className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold">Filizlen Asistan</p>
                  <ToneBadge tone="accent">{preview.label}</ToneBadge>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-muted">{preview.body}</p>
            </div>
            <button
              type="button"
              onClick={() => setPreview(null)}
              className="mt-4 w-full rounded-xl border border-white/10 py-2 text-sm text-muted hover:text-foreground"
            >
              Kapat
            </button>
          </div>
        </div>
      )}
    </>
  );
}
