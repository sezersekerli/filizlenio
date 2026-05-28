"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Smartphone, Zap } from "lucide-react";
import { FloatingOrbs } from "@/components/effects/FloatingOrbs";
import { GridBeam } from "@/components/effects/GridBeam";
import { FlyingDrone } from "@/components/cozum/FlyingDrone";
import { EcosystemHubLinks } from "@/components/cozum/EcosystemHubLinks";
import { CozumModuleDetails } from "@/components/cozum/CozumModuleDetails";
import { DataFlowPipeline } from "@/components/flow/DataFlowPipeline";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { ProductCard } from "@/components/ui/ProductCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import {
  blurIn,
  defaultTransition,
  staggerContainer,
} from "@/lib/motion";
import { dataFlowPipeline, products } from "@/lib/content";

/** Sense, Control, Cloud, Proje — köşe hücreleri */
const orbitCells = [
  "lg:col-start-1 lg:row-start-1 lg:justify-self-end lg:self-end",
  "lg:col-start-3 lg:row-start-1 lg:justify-self-start lg:self-end",
  "lg:col-start-1 lg:row-start-3 lg:justify-self-end lg:self-start",
  "lg:col-start-3 lg:row-start-3 lg:justify-self-start lg:self-start",
] as const;

const floatDelays = [0, 0.35, 0.7, 1.05];

export function CozumPageContent() {
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.25], [0, 60]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.4]);

  return (
    <>
      <section className="hero-gradient relative overflow-hidden border-b border-[rgba(34,197,94,0.1)] pt-28 pb-16 md:pt-36 md:pb-24 lg:pt-40 lg:pb-28">
        <FloatingOrbs />
        <GridBeam />
        <div className="grid-pattern pointer-events-none absolute inset-0 opacity-50" />
        <FlyingDrone />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative mx-auto max-w-6xl px-6 lg:px-8"
        >
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-w-2xl lg:max-w-3xl"
          >
            <motion.p
              variants={blurIn}
              transition={defaultTransition}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-[rgba(34,197,94,0.35)] bg-primary/10 px-3.5 py-1.5 text-sm font-medium text-primary shadow-[0_0_24px_rgba(34,197,94,0.2)]"
            >
              <motion.span
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Zap className="h-4 w-4 shrink-0" />
              </motion.span>
              Tarım 5.0 ekosistemi
            </motion.p>
            <motion.h1
              variants={blurIn}
              transition={{ ...defaultTransition, delay: 0.05 }}
              className="text-4xl font-bold leading-[1.1] tracking-tight text-foreground md:text-5xl lg:text-[3.25rem]"
            >
              Uçtan uca{" "}
              <span className="bg-gradient-to-r from-primary via-[#4ade80] to-accent bg-clip-text text-transparent">
                akıllı tarım
              </span>
            </motion.h1>
            <motion.p
              variants={blurIn}
              transition={{ ...defaultTransition, delay: 0.1 }}
              className="mt-4 max-w-xl text-base leading-relaxed text-muted md:mt-5 md:text-lg"
            >
              Tarlada ölç, bulutta birleştir, uygulamada izle, birlikte karar ver, vanalara
              komut gönder — tek platformda, kayıt altında.
            </motion.p>
            <motion.div
              variants={blurIn}
              transition={{ ...defaultTransition, delay: 0.15 }}
              className="mt-7 flex flex-wrap items-center gap-3 md:mt-8"
            >
              <Button href="#ekosistem">
                Modülleri keşfet
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button href="/nasil-calisir" variant="secondary">
                Nasıl çalışır?
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-10 flex max-w-4xl flex-wrap items-center justify-center gap-2 md:mt-12 md:gap-2"
          >
            {dataFlowPipeline.map((node, i) => (
              <div key={node.id} className="flex items-center gap-2">
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{
                    duration: 3.5 + i * 0.35,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.2,
                  }}
                  className={`glass-card rounded-lg px-3.5 py-2 text-xs font-medium md:text-sm ${
                    node.id === "app"
                      ? "flex items-center gap-1.5 text-accent"
                      : "text-primary"
                  }`}
                >
                  {node.id === "app" ? (
                    <Smartphone className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  ) : null}
                  {node.label}
                </motion.div>
                {i < dataFlowPipeline.length - 1 ? (
                  <span className="text-sm text-muted/70" aria-hidden>
                    →
                  </span>
                ) : null}
              </div>
            ))}
          </motion.div>
          <p className="mx-auto mt-4 max-w-xl text-center text-xs text-muted md:text-sm">
            Operasyon sırası: ölç → birleştir → izle → karar ver → komut gönder
          </p>
        </motion.div>
      </section>

      <AnimatedSection>
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <DataFlowPipeline showIntro showFootnote />
        </div>
      </AnimatedSection>

      <AnimatedSection id="ekosistem" className="bg-[var(--background-elevated)]">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <SectionHeading
            eyebrow="Ekosistem"
            title="Modüller havada, veri yerde"
            description="Sense’ten Cloud’a kadar her katman birbirine bağlı — canlı veri akışıyla çalışır."
          />

          <div className="relative mt-8 overflow-hidden rounded-3xl border border-[rgba(34,197,94,0.14)] bg-[rgba(7,13,10,0.8)] p-5 sm:p-6 md:mt-10 md:p-8 lg:mt-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(34,197,94,0.2),transparent_58%),radial-gradient(circle_at_18%_82%,rgba(56,189,248,0.12),transparent_42%)]" />

            {/* Yörünge halkaları — masaüstü */}
            <div className="pointer-events-none absolute inset-0 hidden items-center justify-center lg:flex">
              <motion.div
                className="h-[17.5rem] w-[17.5rem] rounded-full border border-dashed border-primary/25"
                animate={{ rotate: 360 }}
                transition={{ duration: 48, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute h-[26rem] w-[26rem] rounded-full border border-dashed border-accent/12"
                animate={{ rotate: -360 }}
                transition={{ duration: 64, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute h-2 w-2 rounded-full bg-primary shadow-[0_0_18px_rgba(34,197,94,0.95)]"
                animate={{
                  x: [0, 100, 200, 100, 0, -100, -200, -100, 0],
                  y: [0, -52, 0, 52, 0, 52, 0, -52, 0],
                }}
                transition={{ duration: 11, repeat: Infinity, ease: "linear" }}
              />
            </div>

            {/* Mobil / tablet: düzenli 2 sütun */}
            <div className="relative grid gap-4 sm:grid-cols-2 sm:gap-5 lg:hidden">
              {products.map((p, i) => (
                <motion.div
                  key={p.id}
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 4 + i * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: floatDelays[i],
                  }}
                  whileHover={{ y: -10 }}
                  className="h-full"
                >
                  <ProductCard
                    name={p.name}
                    description={p.description}
                    icon={p.icon}
                    index={i}
                    href={`/cozum/${p.id}`}
                  />
                </motion.div>
              ))}
            </div>

            {/* Masaüstü: 3×3 grid, merkez hub */}
            <div className="relative hidden min-h-[36rem] lg:grid lg:grid-cols-[1fr_auto_1fr] lg:grid-rows-[1fr_auto_1fr] lg:items-center lg:gap-x-10 lg:gap-y-8 xl:min-h-[38rem] xl:gap-x-14 xl:gap-y-10">
              <EcosystemHubLinks />

              <motion.div
                className="relative z-10 col-start-2 row-start-2 justify-self-center"
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="glass-card w-[12.5rem] rounded-2xl border border-primary/30 px-5 py-4 text-center shadow-[0_0_48px_rgba(34,197,94,0.22)] xl:w-[14rem]">
                  <p className="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-muted">
                    Merkez
                  </p>
                  <p className="mt-1.5 text-lg font-bold text-primary xl:text-xl">
                    filizlen.io
                  </p>
                  <p className="mt-1.5 text-[0.7rem] leading-snug text-muted xl:text-xs">
                    Canlı veri akışı kontrol ünitesi
                  </p>
                </div>
              </motion.div>

              {products.map((p, i) => (
                <motion.div
                  key={p.id}
                  className={`relative z-10 w-full max-w-[17.5rem] ${orbitCells[i]}`}
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 4.2 + i * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: floatDelays[i],
                  }}
                  whileHover={{ y: -12, scale: 1.015 }}
                >
                  <ProductCard
                    name={p.name}
                    description={p.description}
                    icon={p.icon}
                    index={i}
                    href={`/cozum/${p.id}`}
                  />
                </motion.div>
              ))}
            </div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-6 text-center text-sm text-muted md:mt-8"
          >
            <Smartphone className="mr-1.5 inline h-4 w-4 align-[-2px] text-primary" />
            <Link href="/uygulama" className="text-primary hover:underline">
              filizlen.io App
            </Link>{" "}
            ile tüm modülleri sahada yönetin.
          </motion.p>
        </div>
      </AnimatedSection>

      <AnimatedSection className="bg-[#080f0c]">
        <CozumModuleDetails />
      </AnimatedSection>

      <AnimatedSection className="!pb-24 md:!pb-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={defaultTransition}
          className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl border border-primary/20 px-6 py-12 text-center md:px-10 md:py-16 lg:px-12"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,197,94,0.18),transparent_55%)]" />
          <motion.div
            className="pointer-events-none absolute left-[18%] top-8 h-14 w-14 rounded-full bg-primary/20 blur-2xl"
            animate={{ y: [0, -16, 0], x: [0, 10, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="pointer-events-none absolute right-[16%] bottom-8 h-16 w-16 rounded-full bg-accent/15 blur-2xl"
            animate={{ y: [0, 14, 0], x: [0, -8, 0] }}
            transition={{ duration: 8.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="relative">
            <p className="mx-auto max-w-md text-base text-muted md:text-lg">
              Teklif, keşif ve kurulum planı için iletişime geçin.
            </p>
            <div className="mt-6 md:mt-7">
              <Button href="/iletisim">İletişim</Button>
            </div>
          </div>
        </motion.div>
      </AnimatedSection>
    </>
  );
}
