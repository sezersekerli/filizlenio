"use client";

import { ApiErrorBanner } from "@/components/ui/ApiErrorBanner";
import { EmptyState } from "@/components/ui/EmptyState";
import { ParcelCard } from "@/components/ui/ParcelCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { PLAN_LABELS, PLAN_LIMITS } from "@filizlen/shared";
import type { Parcel } from "@filizlen/shared";
import { motion } from "framer-motion";
import { MapPin, Plus } from "lucide-react";
import { staggerContainer } from "@/lib/motion";

export function DashboardView({
  parcels,
  error,
  plan = "free",
}: {
  parcels: Parcel[];
  error: string | null;
  plan?: string;
}) {
  const limit = PLAN_LIMITS.free.maxParcels;
  const usedPct = Math.min(100, Math.round((parcels.length / limit) * 100));
  const planLabel = PLAN_LABELS[plan] ?? plan;

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Hoş geldin"
        title="Panel"
        description="Parsellerinizin özeti ve hızlı erişim."
        action={
          parcels.length < limit ? (
            <ButtonLink href="/parcels/new" size="lg">
              <Plus className="w-4 h-4" />
              Parsel ekle
            </ButtonLink>
          ) : undefined
        }
      />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="grid gap-4 sm:grid-cols-3"
      >
        <StatCardInline
          label="Kayıtlı parsel"
          value={String(parcels.length)}
          sub={`Limit: ${limit}`}
        />
        <StatCardInline
          label="Kullanım"
          value={`%${usedPct}`}
          sub={parcels.length >= limit ? "Limit doldu" : `${limit - parcels.length} hak kaldı`}
        />
        <StatCardInline label="Plan" value={planLabel} sub="Sense · Cloud · Control" />
      </motion.div>

      {error && <ApiErrorBanner message={error} />}

      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold">Parselleriniz</h2>
          <ButtonLink href="/parcels" variant="ghost" size="sm">
            Tümünü gör
          </ButtonLink>
        </div>

        {parcels.length === 0 ? (
          <EmptyState
            icon={MapPin}
            title="Henüz parsel yok"
            description="İl, ilçe, mahalle ve ada/parsel bilgisiyle tarlanızı haritaya ekleyin."
            action={
              <ButtonLink href="/parcels/new" size="lg">
                <Plus className="w-4 h-4" />
                İlk parseli ekle
              </ButtonLink>
            }
          />
        ) : (
          <motion.ul
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {parcels.slice(0, 6).map((p, i) => (
              <ParcelCard key={p.id} parcel={p} index={i} />
            ))}
          </motion.ul>
        )}
      </section>

      {parcels.length > 0 && (
        <div className="text-center">
          <ButtonLink href="/farm" variant="ghost">
            Tarla yönetimi paneline git →
          </ButtonLink>
        </div>
      )}
    </div>
  );
}

function StatCardInline({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="glass-card glow-border rounded-2xl p-5">
      <p className="text-xs text-muted uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
      <p className="text-xs text-muted mt-1">{sub}</p>
    </div>
  );
}
