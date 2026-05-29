"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Cloud,
  LucideIcon,
  Radio,
  SlidersHorizontal,
  Wrench,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { blurIn, defaultTransition, staggerFast } from "@/lib/motion";

type ModuleDetail = {
  id: string;
  title: string;
  shortName: string;
  tag: string;
  body: string;
  href: string;
  icon: LucideIcon;
  index: string;
  accent: string;
  border: string;
  glow: string;
  highlights: string[];
};

const modules: ModuleDetail[] = [
  {
    id: "sense",
    title: "filizlen.io Sense",
    shortName: "Sense",
    tag: "Saha verisi",
    body: "Toprak nemi, hava koşulları ve hidrolik hat verilerini toplayın. Sensör kitleri ile tarlanızı gerçek zamanlı izleyin; filizlen.io Cloud ve App üzerinden erişin.",
    href: "/cozum/sense",
    icon: Radio,
    index: "01",
    accent: "from-primary/25 via-primary/5 to-transparent",
    border: "group-hover:border-primary/45",
    glow: "group-hover:shadow-[0_0_40px_rgba(34,197,94,0.18)]",
    highlights: ["Toprak & hava", "Gerçek zamanlı izleme", "Cloud + App"],
  },
  {
    id: "control",
    title: "filizlen.io Control",
    shortName: "Control",
    tag: "Otomasyon",
    body: "Kontrolör ve otomasyon ile sulama ve gübreleme hatlarını uzaktan yönetin. Vana, pompa ve programlama tek merkezden; iş gücünü minimuma indirin.",
    href: "/cozum/control",
    icon: SlidersHorizontal,
    index: "02",
    accent: "from-[#4ade80]/20 via-primary/5 to-transparent",
    border: "group-hover:border-[#4ade80]/40",
    glow: "group-hover:shadow-[0_0_40px_rgba(74,222,128,0.15)]",
    highlights: ["Uzaktan yönetim", "Vana & pompa", "Tek merkez"],
  },
  {
    id: "cloud",
    title: "filizlen.io Cloud",
    shortName: "Cloud",
    tag: "Analitik & öneri",
    body: "Abonelik tabanlı bulut platformu: analitik, alarm, raporlama ve optimizasyon önerileri. Geçmiş veriyi kullanarak sulama stratejinizi sürekli iyileştirin.",
    href: "/cozum/cloud",
    icon: Cloud,
    index: "03",
    accent: "from-accent/20 via-primary/5 to-transparent",
    border: "group-hover:border-accent/40",
    glow: "group-hover:shadow-[0_0_40px_rgba(56,189,248,0.14)]",
    highlights: ["Analitik & alarm", "Sulama önerisi", "Geçmiş veri"],
  },
  {
    id: "proje",
    title: "filizlen.io Proje",
    shortName: "Proje",
    tag: "Anahtar teslim",
    body: "Keşif, tasarım, kurulum, devreye alma ve eğitim — anahtar teslim. Büyük tarla, sera ve kooperatifler için tek muhatap çözüm.",
    href: "/cozum/proje",
    icon: Wrench,
    index: "04",
    accent: "from-primary/15 via-[#14532d]/40 to-transparent",
    border: "group-hover:border-primary/35",
    glow: "group-hover:shadow-[0_0_36px_rgba(34,197,94,0.12)]",
    highlights: ["Keşif & kurulum", "Eğitim & destek", "Tek muhatap"],
  },
];

export function CozumModuleDetails() {
  return (
    <div className="mx-auto max-w-6xl px-6 lg:px-8">
      <SectionHeading
        eyebrow="Detay"
        title="Her modül ne sunar?"
        description="Donanımdan buluta, kurulumdan desteğe — ihtiyacınıza göre seçin."
        align="left"
      />

      <motion.div
        variants={staggerFast}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="mt-10 grid gap-5 md:mt-12 md:grid-cols-2 md:gap-6"
      >
        {modules.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.id}
              variants={blurIn}
              transition={{ ...defaultTransition, delay: i * 0.07 }}
            >
              <Link
                href={item.href}
                className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[rgba(34,197,94,0.14)] bg-[rgba(10,18,14,0.92)] p-6 transition-all duration-300 md:p-7 ${item.border} ${item.glow}`}
              >
                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${item.accent} opacity-80 transition-opacity duration-300 group-hover:opacity-100`}
                />
                <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-primary/8 blur-3xl transition-all duration-500 group-hover:bg-primary/14" />

                <div className="relative flex items-start justify-between gap-4">
                  <div className="brand-icon-box h-14 w-14 shrink-0 transition-colors duration-300 group-hover:bg-primary/25">
                    <Icon className="h-7 w-7" />
                  </div>
                  <span className="font-mono text-xs font-medium tracking-widest text-primary/50">
                    {item.index}
                  </span>
                </div>

                <div className="relative mt-5 flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-primary">
                    {item.tag}
                  </span>
                  <span className="text-xs text-muted/80">filizlen.io</span>
                  <span className="text-sm font-bold text-foreground">{item.shortName}</span>
                </div>

                <h2 className="relative mt-3 text-xl font-bold leading-snug text-foreground md:text-[1.35rem]">
                  {item.title}
                </h2>

                <p className="relative mt-3 flex-1 text-sm leading-relaxed text-muted md:text-[0.95rem]">
                  {item.body}
                </p>

                <ul className="relative mt-4 flex flex-wrap gap-2">
                  {item.highlights.map((h) => (
                    <li
                      key={h}
                      className="rounded-lg border border-[rgba(34,197,94,0.15)] bg-[rgba(15,23,20,0.65)] px-2.5 py-1 text-[0.7rem] font-medium text-muted transition-colors group-hover:border-primary/25 group-hover:text-foreground/90"
                    >
                      {h}
                    </li>
                  ))}
                </ul>

                <div className="relative mt-6 flex items-center justify-between border-t border-[rgba(34,197,94,0.1)] pt-5">
                  <span className="text-sm font-semibold text-primary transition-transform duration-300 group-hover:translate-x-0.5">
                    Detayı gör
                  </span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary transition-all duration-300 group-hover:scale-105 group-hover:bg-primary group-hover:text-[#14532D]">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
