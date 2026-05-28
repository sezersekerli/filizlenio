"use client";

import { motion } from "framer-motion";
import {
  ChartSpline,
  Cloud,
  Leaf,
  MonitorSmartphone,
  RadioTower,
  ToggleLeft,
  type LucideIcon,
} from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { howItWorksSteps } from "@/lib/content";
import { blurIn, fadeInUp, staggerContainer, defaultTransition } from "@/lib/motion";

const stepIcons: LucideIcon[] = [
  Leaf,
  RadioTower,
  Cloud,
  MonitorSmartphone,
  ChartSpline,
  ToggleLeft,
];

type HowItWorksProps = {
  showCta?: boolean;
  compact?: boolean;
};

export function HowItWorks({ showCta = true, compact = false }: HowItWorksProps) {
  return (
    <AnimatedSection className={compact ? "" : "bg-[var(--background-elevated)]"}>
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Nasıl çalışır"
          title="Tarladan buluta, buluttan kontrole"
          description="Teknik detay yerine net akış: ölç → birleştir → izle → karar ver → uygula."
        />

        <div className="relative mt-10 overflow-hidden rounded-3xl border border-primary/20 bg-[rgba(7,12,10,0.8)] p-5 md:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(34,197,94,0.16),transparent_50%),radial-gradient(circle_at_90%_80%,rgba(56,189,248,0.12),transparent_45%)]" />
          <motion.div
            className="pointer-events-none absolute left-4 top-1/2 hidden h-2 w-2 rounded-full bg-accent shadow-[0_0_14px_rgba(56,189,248,0.9)] md:block"
            animate={{ y: [-120, 120], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          />

          <motion.ol
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="relative grid gap-4 md:grid-cols-5"
          >
            {howItWorksSteps.map((item, i) => {
              const Icon = stepIcons[i] ?? Leaf;
              return (
                <motion.li
                  key={item.step}
                  variants={fadeInUp}
                  transition={{ ...defaultTransition, delay: i * 0.08 }}
                  className="relative list-none rounded-xl border border-[rgba(34,197,94,0.22)] bg-[rgba(10,18,14,0.72)] p-4 backdrop-blur-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold tracking-wider text-primary/85">
                      {item.step}
                    </span>
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mt-3 text-sm font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted">{item.description}</p>
                </motion.li>
              );
            })}
          </motion.ol>

          <motion.p
            variants={blurIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative mt-6 text-center text-sm text-muted"
          >
            Veri sizde kalır; komutlar filizlen.io üzerinden sahaya gider.
          </motion.p>
        </div>

        {showCta ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 flex flex-wrap justify-center gap-4"
          >
            <Button href="/nasil-calisir" variant="secondary">
              Tüm süreci gör
            </Button>
            <Button href="/iletisim">Demo ve teklif alın</Button>
          </motion.div>
        ) : null}
      </div>
    </AnimatedSection>
  );
}
