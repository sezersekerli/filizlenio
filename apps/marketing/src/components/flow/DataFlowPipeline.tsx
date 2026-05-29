"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { dataFlowIntro, dataFlowPipeline } from "@/lib/content";
import { blurIn, defaultTransition } from "@/lib/motion";

type DataFlowPipelineProps = {
  showIntro?: boolean;
  showFootnote?: boolean;
  premium?: boolean;
};

export function DataFlowPipeline({
  showIntro = true,
  showFootnote = false,
  premium = false,
}: DataFlowPipelineProps) {
  return (
    <div className="relative">
      {showIntro ? (
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={blurIn}
          transition={defaultTransition}
          className="mx-auto mb-8 max-w-3xl text-center md:mb-10"
        >
          <p className="text-lg font-medium leading-relaxed text-foreground md:text-xl">
            {dataFlowIntro.summary}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted md:text-base">
            {dataFlowIntro.paragraph}
          </p>
        </motion.div>
      ) : null}

      <div
        className={`relative overflow-hidden rounded-3xl border bg-[rgba(7,12,10,0.85)] p-4 md:p-6 ${
          premium
            ? "border-[rgba(34,197,94,0.28)] shadow-[0_0_80px_rgba(34,197,94,0.12)]"
            : "border-[rgba(34,197,94,0.16)]"
        }`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,197,94,0.14),transparent_55%)]" />
        {premium ? (
          <>
            <motion.div
              className="pointer-events-none absolute -left-8 top-1/3 h-32 w-32 rounded-full bg-primary/15 blur-3xl"
              animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="pointer-events-none absolute -right-6 bottom-1/4 h-36 w-36 rounded-full bg-accent/12 blur-3xl"
              animate={{ x: [0, -25, 0], y: [0, 15, 0] }}
              transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
            />
          </>
        ) : null}

        {/* Masaüstü: yatay akış */}
        <div className="relative hidden items-stretch gap-1 lg:flex">
          {dataFlowPipeline.map((node, i) => (
            <div key={node.id} className="flex min-w-0 flex-1 items-center">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...defaultTransition, delay: i * 0.08 }}
                whileHover={premium ? { y: -6, scale: 1.02 } : undefined}
                className={`flex-1 rounded-xl border bg-[rgba(10,18,14,0.9)] px-3 py-4 text-center transition-shadow ${
                  premium
                    ? "border-[rgba(34,197,94,0.3)] hover:shadow-[0_0_32px_rgba(34,197,94,0.15)]"
                    : "border-[rgba(34,197,94,0.22)]"
                }`}
              >
                <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-primary">
                  {node.label}
                </p>
                <p className="mt-1.5 text-xs font-medium text-foreground md:text-sm">
                  {node.tag}
                </p>
              </motion.div>
              {i < dataFlowPipeline.length - 1 ? (
                <div className="relative flex w-8 shrink-0 items-center justify-center">
                  <ArrowRight className="h-4 w-4 text-primary/50" />
                  <motion.div
                    className="absolute h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_10px_rgba(56,189,248,0.9)]"
                    animate={{ x: [-10, 10], opacity: [0.3, 1, 0.3] }}
                    transition={{
                      duration: 1.6,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.25,
                    }}
                  />
                </div>
              ) : null}
            </div>
          ))}
        </div>

        {/* Mobil: dikey akış */}
        <ol className="relative space-y-3 lg:hidden">
          {dataFlowPipeline.map((node, i) => (
            <motion.li
              key={node.id}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ ...defaultTransition, delay: i * 0.06 }}
              className="relative list-none rounded-xl border border-[rgba(34,197,94,0.2)] bg-[rgba(10,18,14,0.9)] px-4 py-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-primary">{node.label}</span>
                <span className="text-xs text-muted">{node.tag}</span>
              </div>
              {i < dataFlowPipeline.length - 1 ? (
                <div className="absolute -bottom-3 left-1/2 h-3 w-px -translate-x-1/2 bg-primary/40" />
              ) : null}
            </motion.li>
          ))}
        </ol>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="relative mt-5 text-center text-xs text-muted"
        >
          Döngü devam eder: yeni ölçüm yine tarladan gelir, sistem her turda daha iyi önerir.
        </motion.p>
      </div>

      {showFootnote ? (
        <p className="mx-auto mt-6 max-w-2xl text-center text-xs leading-relaxed text-muted/90">
          {dataFlowIntro.footnote}
        </p>
      ) : null}
    </div>
  );
}
