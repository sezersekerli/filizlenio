"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Workflow, Zap } from "lucide-react";
import { FloatingOrbs } from "@/components/effects/FloatingOrbs";
import { GridBeam } from "@/components/effects/GridBeam";
import { CelestialGlow } from "@/components/effects/CelestialGlow";
import { FlyingFlowTimeline } from "@/components/nasil-calisir/FlyingFlowTimeline";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Button } from "@/components/ui/Button";
import { dataFlowPipeline } from "@/lib/content";
import { blurIn, defaultTransition, staggerContainer } from "@/lib/motion";

export function NasilCalisirContent() {
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 70]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0.45]);

  return (
    <>
      <section className="hero-gradient relative min-h-[70vh] overflow-hidden border-b border-[rgba(34,197,94,0.1)] pt-28 pb-20 md:pt-36 md:pb-28">
        <FloatingOrbs />
        <GridBeam />
        <CelestialGlow />
        <div className="grid-pattern pointer-events-none absolute inset-0 opacity-45" />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative mx-auto max-w-6xl px-6 text-center lg:px-8"
        >
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="mx-auto max-w-3xl"
          >
            <motion.p
              variants={blurIn}
              transition={defaultTransition}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-[rgba(34,197,94,0.35)] bg-primary/10 px-4 py-2 text-sm font-medium text-primary shadow-[0_0_28px_rgba(34,197,94,0.25)]"
            >
              <motion.span
                animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <Workflow className="h-4 w-4" />
              </motion.span>
              Operasyon akışı
            </motion.p>

            <motion.h1
              variants={blurIn}
              transition={{ ...defaultTransition, delay: 0.05 }}
              className="text-4xl font-bold leading-[1.08] tracking-tight text-foreground md:text-5xl lg:text-6xl"
            >
              Sistem{" "}
              <span className="bg-gradient-to-r from-primary via-[#86efac] to-accent bg-clip-text text-transparent">
                nasıl çalışır?
              </span>
            </motion.h1>

            <motion.p
              variants={blurIn}
              transition={{ ...defaultTransition, delay: 0.1 }}
              className="mt-5 text-base leading-relaxed text-muted md:text-lg"
            >
              Tarlada ölçüyoruz, bulutta birleştiriyoruz, birlikte karar veriyoruz, onaylanan
              komut vanalara gidiyor — hepsini web ve mobilde izliyorsunuz.
            </motion.p>

            <motion.div
              variants={blurIn}
              transition={{ ...defaultTransition, delay: 0.15 }}
              className="mt-8 flex flex-wrap justify-center gap-3"
            >
              <Button href="#adimlar">Adımları gör</Button>
              <Button href="/cozum" variant="secondary">
                Modülleri gör
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.9 }}
            className="mx-auto mt-12 flex max-w-4xl flex-wrap items-center justify-center gap-2"
          >
            {dataFlowPipeline.map((node, i) => (
              <div key={node.id} className="flex items-center gap-2">
                <motion.span
                  animate={{ y: [0, -7, 0] }}
                  transition={{
                    duration: 3 + i * 0.35,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.2,
                  }}
                  className={`glass-card rounded-lg px-3 py-2 text-xs font-semibold md:text-sm ${
                    node.id === "app" ? "text-accent" : "text-primary"
                  }`}
                >
                  {node.label}
                </motion.span>
                {i < dataFlowPipeline.length - 1 ? (
                  <ArrowRight className="h-3.5 w-3.5 text-primary/40" aria-hidden />
                ) : null}
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[var(--background)] to-transparent"
          aria-hidden
        />
      </section>

      <AnimatedSection id="adimlar" className="relative overflow-hidden bg-[var(--background-elevated)]">
        <div className="pointer-events-none absolute inset-0">
          <motion.div
            className="absolute left-[10%] top-[20%] h-64 w-64 rounded-full bg-primary/8 blur-3xl"
            animate={{ y: [0, -40, 0], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        <FlyingFlowTimeline />
      </AnimatedSection>

      <AnimatedSection className="bg-[#080f0c]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={defaultTransition}
          className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl border border-primary/20 px-6 py-12 text-center md:px-10 md:py-14"
        >
          <CelestialGlow />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,197,94,0.2),transparent_60%)]" />
          <div className="relative">
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-primary/30 bg-primary/10"
            >
              <Zap className="h-6 w-6 text-primary" />
            </motion.div>
            <h2 className="text-2xl font-semibold text-foreground md:text-3xl">
              Kurulum tarafı
            </h2>
            <p className="mt-4 leading-relaxed text-muted">
              İlk keşif ve saha kurulumu tamamlandıktan sonra yukarıdaki 5 adımlık akış günlük
              operasyonunuz olur. filizlen.io Proje ekibi keşif, kurulum ve eğitimi tek muhatap
              olarak yönetir.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button href="/cozum/proje" variant="secondary">
                Kurulum süreci
              </Button>
              <Button href="/iletisim">Demo ve teklif alın</Button>
            </div>
            <p className="mt-8 text-sm text-muted">
              <Link href="/uygulama" className="text-primary hover:underline">
                filizlen.io App
              </Link>{" "}
              ile akışı sahada takip edin.
            </p>
          </div>
        </motion.div>
      </AnimatedSection>
    </>
  );
}
