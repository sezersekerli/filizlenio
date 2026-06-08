"use client";

import { StatCard } from "@/components/ui/StatCard";
import type { FarmSummary } from "@filizlen/shared";
import { motion } from "framer-motion";
import { CalendarCheck, CloudSun, MapPin, Wallet } from "lucide-react";
import { staggerContainer } from "@/lib/motion";

export function FarmSummaryStats({ summary }: { summary: FarmSummary }) {
  const expenseFormatted = summary.seasonExpenseTotal.toLocaleString("tr-TR", {
    maximumFractionDigits: 0,
  });

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
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
          summary.criticalTaskCount > 0
            ? `${summary.criticalTaskCount} kritik`
            : "Kritik iş yok"
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
    </motion.div>
  );
}
