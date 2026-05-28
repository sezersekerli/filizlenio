"use client";

import { motion } from "framer-motion";
import {
  staggerContainer,
  blurIn,
  defaultTransition,
  springTransition,
} from "@/lib/motion";
import { Button } from "@/components/ui/Button";
import { FloatingOrbs } from "@/components/effects/FloatingOrbs";
import { GridBeam } from "@/components/effects/GridBeam";
import { HeroVisual } from "@/components/home/HeroVisual";
import { ArrowRight, Droplets } from "lucide-react";
import { site } from "@/lib/content";

const HERO_VIDEO =
  "https://assets.mixkit.co/videos/preview/mixkit-irrigation-system-in-a-field-of-alfalfa-4260-large.mp4";

export function Hero() {
  return (
    <section className="hero-gradient relative min-h-[100svh] overflow-hidden pt-28 pb-16 md:pt-32 md:pb-24">
      <video
        className="absolute inset-0 h-full w-full object-cover opacity-[0.22]"
        autoPlay
        muted
        loop
        playsInline
        src={HERO_VIDEO}
        poster="https://images.unsplash.com/photo-1500382017468-9049fed747aa?w=1920&q=80"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--background)]/95 via-[var(--background)]/80 to-[var(--background)]" />
      <FloatingOrbs />
      <GridBeam />
      <div className="grid-pattern pointer-events-none absolute inset-0 opacity-60" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-2 lg:gap-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-2xl lg:max-w-none"
        >
          <motion.p
            variants={blurIn}
            transition={defaultTransition}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-[rgba(34,197,94,0.35)] bg-primary/10 px-4 py-2 text-sm font-medium text-primary shadow-[0_0_24px_rgba(34,197,94,0.2)]"
          >
            <motion.span
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Droplets className="h-4 w-4" />
            </motion.span>
            {site.slogan}
          </motion.p>

          <h1 className="text-balance text-4xl font-bold leading-[1.12] tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1] xl:text-6xl">
            <motion.span
              variants={blurIn}
              transition={{ ...springTransition, delay: 0.05 }}
              className="block"
            >
              Veriyi toprağa,
            </motion.span>
            <motion.span
              variants={blurIn}
              transition={{ ...springTransition, delay: 0.14 }}
              className="mt-1 block"
            >
              değeri{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                hasada
              </span>{" "}
              dönüştürün.
            </motion.span>
          </h1>

          <motion.p
            variants={blurIn}
            transition={{ ...defaultTransition, delay: 0.4 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-muted"
          >
            {site.domain} ile sensörden buluta, buluttan web ve mobil panele, panelden
            vana kontrolüne — tek akışta.
          </motion.p>

          <motion.div
            variants={blurIn}
            transition={{ ...defaultTransition, delay: 0.5 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button href="/iletisim">Demo ve teklif alın</Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button href="/cozum" variant="secondary">
                Çözümü keşfedin
                <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            transition={{ delayChildren: 0.65 }}
            className="mt-14 grid grid-cols-3 gap-3"
          >
            {[
              { label: "Su tasarrufu", value: "Optimize" },
              { label: "Kontrol", value: "Uzaktan" },
              { label: "Karar", value: "Veri" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                variants={blurIn}
                transition={{ delay: 0.7 + i * 0.08 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="glass-card rounded-2xl px-4 py-4 text-center backdrop-blur-xl"
              >
                <p className="text-lg font-bold text-primary md:text-xl">{stat.value}</p>
                <p className="mt-0.5 text-[10px] uppercase tracking-wider text-muted md:text-xs">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <HeroVisual />
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-primary/40 p-1">
          <motion.div
            className="h-2 w-1 rounded-full bg-primary"
            animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
}
