"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { getApiClient } from "@/lib/api";
import { formatParcelArea, formatParcelLocation } from "@/lib/tkgm-display";
import type { TkgmParselProperties } from "@filizlen/shared";
import { MapPin, MoreHorizontal, RefreshCw, Ruler, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function ParcelDetailHeader({
  parcelId,
  title,
  nitelik,
  areaM2,
  ada,
  parselNo,
  properties,
}: {
  parcelId: string;
  title: string;
  nitelik: string | null;
  areaM2: number | null;
  ada: string;
  parselNo: string;
  properties?: Record<string, unknown> | null;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const location = formatParcelLocation(properties);
  const tkgm = (properties ?? {}) as TkgmParselProperties;

  async function deleteParcel() {
    setDeleting(true);
    try {
      await getApiClient().deleteParcel(parcelId);
      router.push("/parcels");
      router.refresh();
    } finally {
      setDeleting(false);
      setConfirming(false);
      setMenuOpen(false);
    }
  }

  async function syncTkgm() {
    setSyncing(true);
    try {
      await getApiClient().syncParcelTkgm(parcelId);
      router.refresh();
    } finally {
      setSyncing(false);
      setMenuOpen(false);
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Parsel"
        title={title}
        action={
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="secondary"
              size="sm"
              onClick={syncTkgm}
              disabled={syncing}
              className="flex-1 sm:flex-none"
            >
              <RefreshCw className={`w-4 h-4 shrink-0 ${syncing ? "animate-spin" : ""}`} />
              <span className="sm:inline">Güncelle</span>
            </Button>
            <div className="relative sm:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMenuOpen((o) => !o)}
                aria-label="Diğer işlemler"
                className="min-w-[44px] px-3"
              >
                <MoreHorizontal className="w-5 h-5" />
              </Button>
              {menuOpen && (
                <>
                  <button
                    type="button"
                    className="fixed inset-0 z-30"
                    aria-label="Kapat"
                    onClick={() => {
                      setMenuOpen(false);
                      setConfirming(false);
                    }}
                  />
                  <div className="absolute right-0 top-full mt-1 z-40 min-w-[10rem] glass-card rounded-xl p-1 shadow-lg">
                    {!confirming ? (
                      <button
                        type="button"
                        onClick={() => setConfirming(true)}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-3 text-sm text-red-300 hover:bg-white/5 min-h-[44px]"
                      >
                        <Trash2 className="w-4 h-4" />
                        Parseli sil
                      </button>
                    ) : (
                      <div className="p-2 space-y-1">
                        <p className="text-xs text-muted px-2 py-1">Emin misiniz?</p>
                        <button
                          type="button"
                          onClick={deleteParcel}
                          disabled={deleting}
                          className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-3 text-sm bg-red-500/20 text-red-200 min-h-[44px]"
                        >
                          {deleting ? "Siliniyor…" : "Evet, sil"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirming(false)}
                          className="flex w-full items-center justify-center rounded-lg px-3 py-3 text-sm text-muted min-h-[44px]"
                        >
                          İptal
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
            <div className="hidden sm:flex gap-2">
              {confirming ? (
                <>
                  <Button variant="ghost" size="sm" onClick={() => setConfirming(false)} disabled={deleting}>
                    İptal
                  </Button>
                  <Button
                    size="sm"
                    onClick={deleteParcel}
                    disabled={deleting}
                    className="border-red-500/30 text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                    {deleting ? "Siliniyor…" : "Evet, sil"}
                  </Button>
                </>
              ) : (
                <Button variant="ghost" size="sm" onClick={() => setConfirming(true)}>
                  <Trash2 className="w-4 h-4" />
                  Sil
                </Button>
              )}
            </div>
          </div>
        }
      />
      <div className="flex flex-wrap gap-2 mt-4">
        {location && (
          <span className="inline-flex items-center gap-1.5 glass-card rounded-full px-3 py-2 text-xs text-muted max-w-full">
            <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="truncate">{location}</span>
          </span>
        )}
        <span className="inline-flex items-center gap-1.5 glass-card rounded-full px-3 py-2 text-xs text-muted">
          Ada {tkgm.adaNo ?? ada} / {tkgm.parselNo ?? parselNo}
        </span>
        {(nitelik || tkgm.nitelik) && (
          <span className="inline-flex items-center glass-card rounded-full px-3 py-2 text-xs text-muted">
            {nitelik ?? tkgm.nitelik}
          </span>
        )}
        {areaM2 != null && (
          <span className="inline-flex items-center gap-1.5 glass-card rounded-full px-3 py-2 text-xs text-muted">
            <Ruler className="w-3.5 h-3.5 text-accent shrink-0" />
            {formatParcelArea(Number(areaM2))}
          </span>
        )}
      </div>
    </div>
  );
}
