"use client";

import { NdviLineChart } from "@/components/charts/NdviLineChart";
import { Button } from "@/components/ui/Button";
import { LoadingState } from "@/components/ui/LoadingState";
import { getApiClient } from "@/lib/api";
import { hasCloudRecommendations } from "@filizlen/shared";
import type { Entitlement, SpectralTimeline, SpectralTimelineBucket } from "@filizlen/shared";
import { RefreshCw } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

export function ParcelSpectralChart({
  parcelId,
  entitlements,
}: {
  parcelId: string;
  entitlements: Pick<Entitlement, "feature" | "active">[];
}) {
  const api = getApiClient();
  const entitled = hasCloudRecommendations(entitlements);
  const [bucket, setBucket] = useState<SpectralTimelineBucket>("week");
  const [timeline, setTimeline] = useState<SpectralTimeline | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!entitled) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await api.getParcelSpectralTimeline(parcelId, bucket);
      setTimeline(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Grafik yüklenemedi");
      setTimeline(null);
    } finally {
      setLoading(false);
    }
  }, [api, bucket, entitled, parcelId]);

  useEffect(() => {
    load();
  }, [load]);

  async function syncSatellite() {
    setSyncing(true);
    try {
      await api.syncParcelSatellite(parcelId, true);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Senkron başarısız");
    } finally {
      setSyncing(false);
    }
  }

  if (!entitled) {
    return (
      <div className="glass-card rounded-2xl p-6 text-center space-y-3">
        <p className="text-sm text-muted">
          NDVI grafiği ve stres uyarıları Spektral Analiz paketinde.
        </p>
        <Link href="/packages" className="text-sm text-primary font-medium hover:underline">
          Paketlere bak →
        </Link>
      </div>
    );
  }

  return (
    <section className="glass-card rounded-2xl p-4 sm:p-5 space-y-4 sm:space-y-5">
      <div className="space-y-3">
        <div>
          <h2 className="text-base sm:text-lg font-semibold">Bitki sağlığı grafiği</h2>
          <p className="text-xs text-muted mt-1">
            Hesaplama arka planda — siz sadece trendi izleyin.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setBucket("week")}
            className={`flex-1 sm:flex-none min-h-[44px] px-4 py-2.5 rounded-xl text-sm font-medium ${
              bucket === "week" ? "bg-primary/20 text-primary" : "text-muted glass-card"
            }`}
          >
            Haftalık
          </button>
          <button
            type="button"
            onClick={() => setBucket("month")}
            className={`flex-1 sm:flex-none min-h-[44px] px-4 py-2.5 rounded-xl text-sm font-medium ${
              bucket === "month" ? "bg-primary/20 text-primary" : "text-muted glass-card"
            }`}
          >
            Aylık
          </button>
          <Button
            size="sm"
            variant="secondary"
            onClick={syncSatellite}
            disabled={syncing}
            className="w-full sm:w-auto"
          >
            <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
            Yenile
          </Button>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-400 rounded-lg bg-red-500/10 px-3 py-2">{error}</p>
      )}

      {loading ? (
        <LoadingState label="Grafik hazırlanıyor…" />
      ) : timeline ? (
        <>
          {timeline.crop && (
            <p className="text-xs text-muted">
              {timeline.crop} · ekim: {timeline.planted_at}
            </p>
          )}
          <NdviLineChart points={timeline.points} />
          {timeline.alerts.length > 0 && (
            <ul className="space-y-2 pt-2 border-t border-[var(--card-border)]">
              {timeline.alerts.map((a) => (
                <li
                  key={`${a.code}-${a.occurred_at}`}
                  className={`text-sm rounded-xl px-3 py-2 ${
                    a.severity === "critical"
                      ? "bg-red-500/10 text-red-300"
                      : a.severity === "warning"
                        ? "bg-amber-500/10 text-amber-200"
                        : "bg-white/5 text-muted"
                  }`}
                >
                  <span className="font-medium">{a.title}</span>
                  <span className="block text-xs mt-0.5 opacity-90">{a.message}</span>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : null}
    </section>
  );
}
