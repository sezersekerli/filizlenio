import { FarmActivityTimeline } from "@/components/farm/FarmActivityTimeline";
import { getServerApiClient } from "@/lib/api-server";
import { safeServerFetchAll } from "@/lib/server-fetch";
import type { FarmActivityItem, FarmTask } from "@filizlen/shared";
import { CalendarCheck, History } from "lucide-react";
import Link from "next/link";

export async function ParcelOverviewStrip({ parcelId }: { parcelId: string }) {
  const api = await getServerApiClient();
  const result = await safeServerFetchAll<[FarmTask[], FarmActivityItem[]]>(
    [
      () => api.listParcelTasks(parcelId, "pending"),
      () => api.listParcelActivity(parcelId, { limit: 3 }),
    ],
    "Parsel özeti yüklenemedi",
  );

  if (!result.ok) {
    return (
      <p className="text-sm text-muted glass-card rounded-2xl p-4">{result.error}</p>
    );
  }

  const [pendingTasks, activity] = result.data;

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Link
          href="/farm/isler"
          className="glass-card rounded-2xl p-4 flex items-center gap-4 hover:border-primary/30 transition-colors min-h-[72px]"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <CalendarCheck className="h-5 w-5" />
          </span>
          <div>
            <p className="font-semibold">Bekleyen işler</p>
            <p className="text-2xl font-bold mt-0.5">{pendingTasks.length}</p>
          </div>
        </Link>
        <div className="glass-card rounded-2xl p-4 flex items-center gap-4 min-h-[72px]">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
            <History className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="font-semibold">Son aktivite</p>
            <p className="text-xs text-muted mt-0.5 truncate">
              {activity[0]
                ? new Date(activity[0].occurred_at).toLocaleDateString("tr-TR", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Henüz kayıt yok"}
            </p>
          </div>
        </div>
      </div>

      {activity.length > 0 && (
        <section className="glass-card rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-sm">Son kayıtlar</h2>
            <Link
              href="/farm/isler?tab=gecmis"
              className="text-xs text-primary hover:underline"
            >
              Tüm geçmiş →
            </Link>
          </div>
          <FarmActivityTimeline initialItems={activity} compact />
        </section>
      )}
    </div>
  );
}
