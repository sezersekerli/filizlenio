"use client";

import { motion } from "framer-motion";
import {
  ChartSpline,
  Cloud,
  Leaf,
  MonitorSmartphone,
  ToggleLeft,
  type LucideIcon,
} from "lucide-react";
import { howItWorksSteps } from "@/lib/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { blurIn, defaultTransition, staggerContainer } from "@/lib/motion";
import { FlowTimelineLinks } from "@/components/nasil-calisir/FlowTimelineLinks";

const stepIcons: LucideIcon[] = [Leaf, Cloud, MonitorSmartphone, ChartSpline, ToggleLeft];

export function FlyingFlowTimeline() {
  return (
    <div className="mx-auto max-w-4xl px-6 lg:px-8">
      <SectionHeading
        eyebrow="Adım adım"
        title="Beş adımda tam döngü"
        description="Her kart bir operasyon aşaması; veri yukarıdan aşağıya akar, karar ve komutla kapanır."
      />

      <div className="relative mt-12 overflow-hidden rounded-3xl border border-[rgba(34,197,94,0.14)] bg-[rgba(6,11,9,0.88)] p-6 md:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(34,197,94,0.18),transparent_55%),radial-gradient(ellipse_at_80%_90%,rgba(56,189,248,0.1),transparent_45%)]" />
        <motion.div
          className="pointer-events-none absolute -left-16 top-1/4 h-48 w-48 rounded-full bg-primary/10 blur-3xl"
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="pointer-events-none absolute -right-12 bottom-1/4 h-56 w-56 rounded-full bg-accent/10 blur-3xl"
          animate={{ x: [0, -35, 0], y: [0, 25, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />

        <FlowTimelineLinks />

        <motion.ol
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="relative space-y-8 md:space-y-12"
        >
          {howItWorksSteps.map((item, i) => {
            const Icon = stepIcons[i] ?? Leaf;
            const alignRight = i % 2 === 1;

            return (
              <motion.li
                key={item.step}
                variants={blurIn}
                transition={{ ...defaultTransition, delay: i * 0.1 }}
                className={`relative list-none md:flex ${alignRight ? "md:justify-end" : "md:justify-start"}`}
              >
                <motion.div
                  whileHover={{ y: -8, scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  className={`relative w-full md:w-[min(100%,22rem)] ${alignRight ? "md:ml-[52%]" : "md:mr-[52%]"}`}
                >
                  <motion.div
                    className="pointer-events-none absolute -right-4 -top-4 h-20 w-20 rounded-full bg-primary/15 blur-2xl"
                    animate={{ opacity: [0.4, 0.9, 0.4], scale: [1, 1.15, 1] }}
                    transition={{ duration: 4 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
                  />

                  <div className="absolute -left-1 top-8 hidden h-3 w-3 rounded-full border-2 border-primary bg-[#0a120e] shadow-[0_0_16px_rgba(34,197,94,0.9)] md:left-auto md:right-auto md:top-1/2 md:-translate-y-1/2 md:translate-x-0 md:opacity-0" />

                  <article className="glass-card relative overflow-hidden rounded-2xl border border-[rgba(34,197,94,0.25)] p-5 shadow-[0_0_40px_rgba(34,197,94,0.08)] md:p-6">
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

                    <div className="flex items-start justify-between gap-3">
                      <span className="font-mono text-xs font-semibold tracking-widest text-primary/70">
                        {item.step}
                      </span>
                      <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                        {item.module}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center gap-3">
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{
                          duration: 3.2 + i * 0.4,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="brand-icon-box h-12 w-12 shrink-0 shadow-[0_0_24px_rgba(34,197,94,0.2)]"
                      >
                        <Icon className="h-6 w-6" />
                      </motion.div>
                      <h3 className="text-lg font-bold text-foreground md:text-xl">
                        {item.title}
                      </h3>
                    </div>

                    <p className="mt-3 text-sm leading-relaxed text-muted">
                      {item.description}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-muted/85 border-t border-[rgba(34,197,94,0.1)] pt-3">
                      {item.detail}
                    </p>
                  </article>
                </motion.div>

                <div
                  className={`absolute top-10 z-10 hidden h-4 w-4 rounded-full border-2 border-primary bg-[#0a120e] shadow-[0_0_20px_rgba(34,197,94,1)] md:block md:top-1/2 md:-translate-y-1/2 ${
                    alignRight ? "left-1/2 -translate-x-1/2" : "left-1/2 -translate-x-1/2"
                  }`}
                >
                  <motion.span
                    className="absolute inset-0 rounded-full bg-primary/40"
                    animate={{ scale: [1, 2.2, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3 }}
                  />
                </div>
              </motion.li>
            );
          })}
        </motion.ol>
      </div>
    </div>
  );
}
