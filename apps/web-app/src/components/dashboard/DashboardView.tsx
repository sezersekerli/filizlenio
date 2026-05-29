"use client";

import { ParcelCard } from "@/components/ui/ParcelCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { ButtonLink } from "@/components/ui/Button";
import { PLAN_LIMITS } from "@filizlen/shared";
import { motion } from "framer-motion";
import { MapPin, Plus, Sprout, TrendingUp } from "lucide-react";
import { staggerContainer } from "@/lib/motion";

type Parcel = {
  id: string;
  label: string | null;
  ada: string;
  parsel_no: string;
  nitelik: string | null;
  area_m2: number | null;
};

export function DashboardView({
  parcels,
  error,
}: {
  parcels: Parcel[];
  error: string | null;
}) {
  const limit = PLAN_LIMITS.free.maxParcels;
  const usedPct = Math.min(100, Math.round((parcels.length / limit) * 100));

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
        <StatCard
          label="Kayıtlı parsel"
          value={parcels.length}
          sub={`Ücretsiz limit: ${limit}`}
          icon={MapPin}
        />
        <StatCard
          label="Kullanım"
          value={`%${usedPct}`}
          sub={parcels.length >= limit ? "Limit doldu" : `${limit - parcels.length} hak kaldı`}
          icon={TrendingUp}
          accent="accent"
        />
        <StatCard
          label="Plan"
          value="Ücretsiz"
          sub="Sense · Cloud · Control"
          icon={Sprout}
        />
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card glow-border rounded-2xl p-5 text-sm border-amber-500/30"
        >
          <p className="text-amber-300 font-medium">API bağlantısı kurulamadı</p>
          <p className="text-muted mt-1 text-xs">{error}</p>
        </motion.div>
      )}

      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold">Parselleriniz</h2>
          <ButtonLink href="/parcels" variant="ghost" size="sm">
            Tümünü gör
          </ButtonLink>
        </div>

        {parcels.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card glow-border rounded-3xl p-12 md:p-16 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="relative"
            >
              <MapPin className="w-14 h-14 text-primary mx-auto mb-5 opacity-80" />
            </motion.div>
            <h3 className="text-xl font-semibold relative">Henüz parsel yok</h3>
            <p className="text-muted text-sm mt-2 mb-8 max-w-sm mx-auto relative">
              İl, ilçe, mahalle ve ada/parsel bilgisiyle tarlanızı haritaya ekleyin.
            </p>
            <ButtonLink href="/parcels/new" size="lg">
              <Plus className="w-4 h-4" />
              İlk parseli ekle
            </ButtonLink>
          </motion.div>
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
    </div>
  );
}
