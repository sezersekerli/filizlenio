"use client";

import { FarmParcelPlans } from "@/components/farm/FarmParcelPlans";
import type { ParcelPlan } from "@/components/farm/FarmParcelPlans";
import { FarmQuickNav } from "@/components/farm/FarmQuickNav";
import { FarmSummaryStats } from "@/components/farm/FarmSummaryStats";
import { FarmActivityTimeline } from "@/components/farm/FarmActivityTimeline";
import { FarmPendingTasks } from "@/components/farm/FarmPendingTasks";
import { ApiErrorBanner } from "@/components/ui/ApiErrorBanner";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { PLAN_LIMITS } from "@filizlen/shared";
import type { FarmActivityItem, FarmSummary, FarmTask } from "@filizlen/shared";
import { AlertTriangle, Banknote, ClipboardList, MapPin, Plus } from "lucide-react";
import Link from "next/link";

export function FarmManagementView({
  summary,
  parcelCount,
  tasks,
  activity,
  plans,
  error,
}: {
  summary: FarmSummary | null;
  parcelCount: number;
  tasks: FarmTask[];
  activity: FarmActivityItem[];
  plans: ParcelPlan[];
  error: string | null;
}) {
  const taskBadge =
    (summary?.overdueTaskCount ?? 0) + (summary?.todayTaskCount ?? 0);
  const emptyParcels = parcelCount === 0;
  const atParcelLimit = parcelCount >= PLAN_LIMITS.free.maxParcels;

  return (
    <div className="space-y-5 md:space-y-8">
      <PageHeader
        eyebrow="Tarla yönetimi"
        title="Özet"
        description="Parselleriniz, bugünkü işler ve masraflar — sade ve hızlı."
        action={
          !atParcelLimit ? (
            <ButtonLink href="/parcels/new" size="lg">
              <Plus className="h-4 w-4" />
              Parsel ekle
            </ButtonLink>
          ) : undefined
        }
      />

      <FarmQuickNav taskBadge={taskBadge} />

      {error && <ApiErrorBanner message={error} />}

      {emptyParcels ? (
        <EmptyState
          icon={MapPin}
          title="Henüz parsel yok"
          description="TKGM ile ilk parselinizi ekleyin."
          action={
            <ButtonLink href="/parcels/new" size="lg">
              <Plus className="w-4 h-4" />
              İlk parseli ekle
            </ButtonLink>
          }
        />
      ) : (
        <>
          {summary && <FarmSummaryStats summary={summary} />}

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {!atParcelLimit && (
              <Link
                href="/parcels/new"
                className="glass-card rounded-2xl p-5 flex items-center gap-4 hover:border-primary/30 transition-colors min-h-[72px]"
              >
                <MapPin className="h-6 w-6 text-primary shrink-0" />
                <div>
                  <p className="font-semibold">Parsel ekle</p>
                  <p className="text-xs text-muted mt-0.5">TKGM ada / parsel</p>
                </div>
              </Link>
            )}
            <Link
              href="/farm/masraflar"
              className="glass-card rounded-2xl p-5 flex items-center gap-4 hover:border-primary/30 transition-colors min-h-[72px]"
            >
              <Banknote className="h-6 w-6 text-primary shrink-0" />
              <div>
                <p className="font-semibold">Masraf gir</p>
                <p className="text-xs text-muted mt-0.5">Gübre, mazot, ilaç</p>
              </div>
            </Link>
            <Link
              href="/farm/olaylar"
              className="glass-card rounded-2xl p-5 flex items-center gap-4 hover:border-primary/30 transition-colors min-h-[72px]"
            >
              <ClipboardList className="h-6 w-6 text-primary shrink-0" />
              <div>
                <p className="font-semibold">Olay ekle</p>
                <p className="text-xs text-muted mt-0.5">Sulama, hasat, not</p>
              </div>
            </Link>
          </div>

          {(summary?.overdueTaskCount ?? 0) > 0 && (
            <div className="flex items-center gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
              <AlertTriangle className="h-5 w-5 shrink-0 text-amber-300" />
              <p>
                <span className="font-semibold">{summary?.overdueTaskCount} geciken iş</span>{" "}
                var — önce bunlara bakın.
              </p>
              <Link href="/farm/isler" className="ml-auto shrink-0 text-xs text-amber-200 hover:underline">
                Gör →
              </Link>
            </div>
          )}

          <section className="glass-card rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-semibold">Yapılacak işler</h2>
              <Link href="/farm/isler" className="text-xs text-primary hover:underline">
                Tümü →
              </Link>
            </div>
            <FarmPendingTasks tasks={tasks} />
          </section>

          <section className="glass-card rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-semibold">Son aktiviteler</h2>
              <Link href="/farm/isler?tab=gecmis" className="text-xs text-primary hover:underline">
                Tüm geçmiş →
              </Link>
            </div>
            <FarmActivityTimeline initialItems={activity} compact />
          </section>

          <section className="space-y-4">
            <h2 className="font-semibold">Parseller</h2>
            <FarmParcelPlans plans={plans} />
          </section>
        </>
      )}
    </div>
  );
}
