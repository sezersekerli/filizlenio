"use client";

import { ApiErrorBanner } from "@/components/ui/ApiErrorBanner";
import { EmptyState } from "@/components/ui/EmptyState";
import { ParcelCard } from "@/components/ui/ParcelCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { PLAN_LIMITS } from "@filizlen/shared";
import type { Parcel } from "@filizlen/shared";
import { motion } from "framer-motion";
import { MapPin, Plus } from "lucide-react";
import { staggerContainer } from "@/lib/motion";

export function ParcelsListView({
  parcels,
  error,
}: {
  parcels: Parcel[];
  error?: string | null;
}) {
  const atLimit = parcels.length >= PLAN_LIMITS.free.maxParcels;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Harita"
        title="Parseller"
        description={`${parcels.length} / ${PLAN_LIMITS.free.maxParcels} parsel — ücretsiz planda`}
        action={
          !atLimit ? (
            <ButtonLink href="/parcels/new" size="lg">
              <Plus className="w-4 h-4" />
              Ekle
            </ButtonLink>
          ) : undefined
        }
      />

      {error && <ApiErrorBanner message={error} />}

      {atLimit && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-amber-300 glass-card glow-border rounded-xl px-4 py-3"
        >
          Ücretsiz planda {PLAN_LIMITS.free.maxParcels} parsel limitine ulaştınız. Premium paketler
          yakında.
        </motion.p>
      )}

      {parcels.length === 0 ? (
        <EmptyState
          icon={MapPin}
          title="Henüz parsel eklenmedi"
          description="TKGM ada/parsel bilgisiyle ilk tarlanızı kaydedin."
          action={
            !atLimit ? (
              <ButtonLink href="/parcels/new" size="lg">
                <Plus className="w-4 h-4" />
                Parsel ekle
              </ButtonLink>
            ) : undefined
          }
        />
      ) : (
        <motion.ul
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid gap-3 sm:grid-cols-2"
        >
          {parcels.map((p, i) => (
            <ParcelCard key={p.id} parcel={p} index={i} variant="list" />
          ))}
        </motion.ul>
      )}
    </div>
  );
}
