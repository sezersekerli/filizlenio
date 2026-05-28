"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  BarChart3,
  LineChart,
  Smartphone,
  Target,
} from "lucide-react";
import { Hero } from "@/components/home/Hero";
import { VideoShowcase } from "@/components/home/VideoShowcase";
import { Marquee } from "@/components/effects/Marquee";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductCard } from "@/components/ui/ProductCard";
import { TiltCard } from "@/components/ui/TiltCard";
import { Button } from "@/components/ui/Button";
import { staggerContainer, blurIn, slideInLeft, slideInRight, defaultTransition } from "@/lib/motion";
import { products, segments, problems } from "@/lib/content";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />

      <AnimatedSection className="border-t border-[rgba(34,197,94,0.08)]">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading
            eyebrow="Problem"
            title="Tarımda su ve verim baskısı artıyor"
            description="Manuel sulama ve dağınık veri, maliyetleri yükseltiyor; ölçeklenebilir dijital operasyon zorunlu hale geliyor."
          />
          <motion.ul
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mx-auto max-w-2xl space-y-5"
          >
            {problems.map((problem, i) => (
              <motion.li
                key={problem}
                variants={slideInLeft}
                transition={{ ...defaultTransition, delay: i * 0.1 }}
                whileHover={{ x: 8 }}
                className="glass-card flex gap-4 rounded-xl p-4 text-muted"
              >
                <motion.span
                  className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-sm font-bold text-primary"
                  whileHover={{ scale: 1.2, rotate: 90 }}
                >
                  {i + 1}
                </motion.span>
                {problem}
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </AnimatedSection>

      <VideoShowcase />

      <AnimatedSection className="bg-[var(--background-elevated)]">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading
            eyebrow="Ekosistem"
            title="Sahadan panele, tek platform"
            description="Donanım, yazılım ve mobil uygulama — hepsi Filizlen ile."
          />
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {products.map((product, i) => (
              <ProductCard
                key={product.id}
                name={product.name}
                description={product.description}
                icon={product.icon}
                index={i}
              />
            ))}
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="mt-10 text-center text-sm text-muted"
          >
            <Smartphone className="mr-1 inline h-4 w-4 text-primary" />
            <Link href="/uygulama" className="text-primary hover:underline">
              Filizlen App
            </Link>{" "}
            ile tüm modülleri yönetin.
          </motion.p>
        </div>
      </AnimatedSection>

      <AnimatedSection>
        <div className="mx-auto max-w-6xl px-6">
          <div className="relative overflow-hidden rounded-3xl border border-primary/20 p-1">
            <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20 opacity-50" />
            <div className="glass-card relative grid items-center gap-10 rounded-[1.4rem] p-8 md:grid-cols-2 md:p-12">
              <motion.div
                variants={slideInLeft}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={defaultTransition}
              >
                <SectionHeading
                  align="left"
                  eyebrow="Farkımız"
                  title="Optimizasyon önce gelir"
                  description="Donanımı sahaya kuruyoruz; asıl değeri veri analitiği ile sulama programınızı sürekli iyileştirmekte görüyoruz."
                />
              </motion.div>
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid gap-4"
              >
                {[
                  { icon: BarChart3, title: "Analitik", text: "Toprak, hava ve hat verisini birleştirin." },
                  { icon: LineChart, title: "Optimizasyon", text: "Ne zaman, ne kadar sulama — veriye dayalı." },
                  { icon: Target, title: "Otomasyon", text: "Uzaktan kontrol ve akıllı kurallar." },
                ].map(({ icon: Icon, title, text }, i) => (
                  <motion.div key={title} variants={slideInRight} transition={{ delay: i * 0.12 }}>
                    <TiltCard>
                      <div className="flex gap-4 rounded-xl border border-[rgba(34,197,94,0.15)] bg-[rgba(15,23,20,0.6)] p-5">
                        <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}>
                          <Icon className="h-8 w-8 shrink-0 text-primary" />
                        </motion.div>
                        <div>
                          <p className="font-semibold text-foreground">{title}</p>
                          <p className="text-sm text-muted">{text}</p>
                        </div>
                      </div>
                    </TiltCard>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="bg-[var(--background-elevated)]">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading eyebrow="Kimler için" title="Tarla, sera ve kooperatifler" />
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-6 md:grid-cols-3"
          >
            {segments.map((seg, i) => (
              <motion.div key={seg.title} variants={blurIn} transition={{ delay: i * 0.12 }}>
                <TiltCard className="h-full">
                  <article className="glass-card h-full rounded-2xl p-8 transition-shadow hover:shadow-[0_0_40px_rgba(34,197,94,0.15)]">
                    <motion.div
                      className="mb-4 h-1 w-12 rounded-full bg-gradient-to-r from-primary to-accent"
                      layoutId={`seg-line-${i}`}
                    />
                    <h3 className="text-xl font-semibold text-foreground">{seg.title}</h3>
                    <p className="mt-3 text-muted">{seg.description}</p>
                  </article>
                </TiltCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>

      <AnimatedSection>
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 80 }}
            className="relative overflow-hidden rounded-3xl border border-primary/40 px-8 py-12 text-center md:px-16"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/10"
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <div className="relative">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">
                Durum
              </p>
              <h2 className="mt-3 text-3xl font-bold text-foreground md:text-4xl">
                Sistem sahada aktif
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-muted">
                Filizlen, tarla ve seralarda canlı veri, uzaktan kontrol ve
                optimizasyon akışlarıyla aktif olarak kullanılıyor.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.97 }}>
                  <Button href="/iletisim">Demo ve teklif alın</Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.97 }}>
                  <Button href="/yatirimcilar" variant="secondary">
                    Yatırımcılar
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </AnimatedSection>
    </>
  );
}
