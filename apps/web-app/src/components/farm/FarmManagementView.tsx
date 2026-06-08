"use client";

import { FarmNotificationCenter } from "@/components/farm/FarmNotificationCenter";
import { FarmParcelPlans } from "@/components/farm/FarmParcelPlans";
import type { ParcelPlan } from "@/components/farm/FarmParcelPlans";
import { FarmSummaryStats } from "@/components/farm/FarmSummaryStats";
import { FarmTaskList } from "@/components/farm/FarmTaskList";
import { ApiErrorBanner } from "@/components/ui/ApiErrorBanner";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { defaultTransition, fadeInUp } from "@/lib/motion";
import type { FarmSummary, FarmTask, NotificationMessage } from "@filizlen/shared";
import { motion } from "framer-motion";
import {
  Bell,
  CheckCircle2,
  MapPin,
  MessageCircle,
  Plus,
} from "lucide-react";

export function FarmManagementView({
  summary,
  tasks,
  notifications,
  plans,
  error,
}: {
  summary: FarmSummary | null;
  tasks: FarmTask[];
  notifications: NotificationMessage[];
  plans: ParcelPlan[];
  error: string | null;
}) {
  const emptyParcels = (summary?.parcelCount ?? 0) === 0;

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Tarla yönetimi"
        title="Sezon komuta merkezi"
        description="Parseller, günlük işler, riskler, masraflar ve WhatsApp hatırlatmaları tek mobil uyumlu panelde."
        action={
          <ButtonLink href="/parcels/new" size="lg">
            <Plus className="h-4 w-4" />
            Parsel ekle
          </ButtonLink>
        }
      />

      {error && <ApiErrorBanner message={error} />}

      {emptyParcels ? (
        <EmptyState
          icon={MapPin}
          title="Henüz parsel yok"
          description="TKGM ile ilk parselinizi ekleyin; günlük işler ve sezon takibi burada görünür."
          action={
            <ButtonLink href="/parcels/new" size="lg">
              <Plus className="w-4 h-4" />
              İlk parseli ekle
            </ButtonLink>
          }
        />
      ) : (
        <>
          <motion.section
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={defaultTransition}
            className="glass-card glow-border relative overflow-hidden rounded-3xl p-5 sm:p-7 lg:p-8"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(34,197,94,0.18),transparent_34%),radial-gradient(circle_at_95%_10%,rgba(56,189,248,0.14),transparent_28%)]" />
            <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <ToneBadge tone="accent">WhatsApp destekli saha akışı</ToneBadge>
                <h2 className="mt-5 max-w-2xl text-2xl font-bold tracking-tight text-gradient sm:text-3xl">
                  Çiftçi uygulama indirmese bile iş emrini WhatsApp&apos;tan görür.
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
                  Sistem parselin ürününe, hava durumuna ve sezon aşamasına göre sulama, gübreleme,
                  ilaçlama, hastalık kontrolü ve masraf girişi için sade mesajlar hazırlar.
                </p>
                <div className="mt-7 grid gap-3 sm:grid-cols-3">
                  {["Parsel bazlı plan", "Günlük hatırlatma", "Masraf ve kâr takibi"].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-foreground"
                    >
                      <CheckCircle2 className="mb-2 h-4 w-4 text-primary" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-primary/20 bg-[#07110c] p-3 shadow-2xl shadow-primary/10">
                <div className="rounded-[1.5rem] border border-white/10 bg-gradient-to-b from-[#0d1f15] to-[#07110c] p-4">
                  <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-primary">
                        <MessageCircle className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold">Filizlen Asistan</p>
                        <p className="text-[11px] text-primary">çevrimiçi</p>
                      </div>
                    </div>
                    <Bell className="h-4 w-4 text-muted" />
                  </div>
                  <div className="space-y-3">
                    <div className="max-w-[88%] rounded-2xl rounded-tl-sm bg-white/8 p-3 text-xs leading-relaxed text-muted">
                      {notifications[0]?.body ??
                        "Günaydın. Bugünkü saha planınız hazırlanıyor."}
                    </div>
                    {tasks[0] && (
                      <div className="ml-auto max-w-[90%] rounded-2xl rounded-tr-sm bg-primary px-3 py-2.5 text-xs font-medium leading-relaxed text-[#052e16]">
                        Sıradaki iş: {tasks[0].title}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {summary && <FarmSummaryStats summary={summary} />}

          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <section className="glass-card glow-border rounded-3xl p-5 sm:p-6">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">Bugünün saha işleri</h2>
                  <p className="mt-1 text-xs text-muted">Çiftçinin sabah bakacağı sade iş listesi.</p>
                </div>
                <ToneBadge>Canlı plan</ToneBadge>
              </div>
              <FarmTaskList tasks={tasks} />
            </section>

            <section className="glass-card glow-border rounded-3xl p-5 sm:p-6">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">WhatsApp bildirim merkezi</h2>
                  <p className="mt-1 text-xs text-muted">
                    İlk fazda mesaj taslakları hazırlanır; sağlayıcı bağlanınca otomatik gönderilir.
                  </p>
                </div>
                <MessageCircle className="h-5 w-5 text-primary" />
              </div>
              <FarmNotificationCenter notifications={notifications} />
            </section>
          </div>

          <section className="space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                Parsel üretim planı
              </p>
              <h2 className="mt-2 text-2xl font-semibold">Çiftçinin takip edeceği ana ekran</h2>
            </div>
            <FarmParcelPlans plans={plans} />
          </section>
        </>
      )}
    </div>
  );
}
