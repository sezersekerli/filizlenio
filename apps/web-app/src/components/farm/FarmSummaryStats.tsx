"use client";

import { StatCard } from "@/components/ui/StatCard";
import type { FarmSummary } from "@filizlen/shared";
import { CalendarCheck, CloudSun, MapPin, Wallet } from "lucide-react";

export function FarmSummaryStats({ summary }: { summary: FarmSummary }) {
  const expenseFormatted = summary.seasonExpenseTotal.toLocaleString("tr-TR", {
    maximumFractionDigits: 0,
  });

  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-4 xl:grid-cols-4">
      <StatCard
        label="Aktif parsel"
        value={summary.parcelCount}
        sub={`Limit: ${summary.parcelLimit}`}
        icon={MapPin}
      />
      <StatCard
        label="Bugünkü iş"
        value={summary.todayTaskCount}
        sub={
          summary.overdueTaskCount > 0
            ? `${summary.overdueTaskCount} geciken`
            : summary.criticalTaskCount > 0
              ? `${summary.criticalTaskCount} kritik`
              : "Geciken yok"
        }
        icon={CalendarCheck}
      />
      <StatCard
        label="Risk uyarısı"
        value={summary.riskAlertCount}
        sub={summary.riskAlertCount > 0 ? "Hava / hastalık riski" : "Risk yok"}
        icon={CloudSun}
        accent="accent"
      />
      <StatCard
        label="Sezon masrafı"
        value={`${expenseFormatted} ${summary.currency}`}
        sub="Yıl başından itibaren"
        icon={Wallet}
      />
    </div>
  );
}
