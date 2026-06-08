"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { getApiClient } from "@/lib/api";
import { formatParcelArea, formatParcelLocation } from "@/lib/tkgm-display";
import type { TkgmParselProperties } from "@filizlen/shared";
import { motion } from "framer-motion";
import { MapPin, RefreshCw, Ruler, Trash2 } from "lucide-react";
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
    }
  }

  async function syncTkgm() {
    setSyncing(true);
    try {
      await getApiClient().syncParcelTkgm(parcelId);
      router.refresh();
    } finally {
      setSyncing(false);
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Parsel detay"
        title={title}
        action={
          <div className="flex flex-wrap gap-2">
            <Button variant="ghost" size="sm" onClick={syncTkgm} disabled={syncing}>
              <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} />
              TKGM güncelle
            </Button>
            {confirming ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setConfirming(false)}
                  disabled={deleting}
                >
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
                Parseli sil
              </Button>
            )}
          </div>
        }
      />
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap gap-3 mt-6"
      >
        {location && (
          <span className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-2 text-xs text-muted">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            {location}
          </span>
        )}
        <span className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-2 text-xs text-muted">
          Ada {tkgm.adaNo ?? ada} / {tkgm.parselNo ?? parselNo}
        </span>
        {(nitelik || tkgm.nitelik) && (
          <span className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-2 text-xs text-muted">
            {nitelik ?? tkgm.nitelik}
          </span>
        )}
        {areaM2 != null && (
          <span className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-2 text-xs text-muted">
            <Ruler className="w-3.5 h-3.5 text-accent" />
            {formatParcelArea(Number(areaM2))}
          </span>
        )}
      </motion.div>
    </div>
  );
}
