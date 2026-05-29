"use client";

import { ParcelCard } from "@/components/ui/ParcelCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { PLAN_LIMITS } from "@filizlen/shared";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { staggerContainer } from "@/lib/motion";

type Parcel = {
  id: string;
  label: string | null;
  ada: string;
  parsel_no: string;
  nitelik: string | null;
  area_m2: number | null;
};

export function ParcelsListView({ parcels }: { parcels: Parcel[] }) {
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
        <div className="glass-card glow-border rounded-2xl p-10 text-center text-muted text-sm">
          Henüz parsel eklenmedi.
        </div>
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
