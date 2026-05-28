"use client";

import { motion } from "framer-motion";
import { PageHero } from "@/components/layout/PageHero";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Button } from "@/components/ui/Button";
import { DataFlowPipeline } from "@/components/flow/DataFlowPipeline";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { appFeatures } from "@/lib/content";
import { fadeInUp, staggerContainer, defaultTransition } from "@/lib/motion";
import { Check, Smartphone } from "lucide-react";

export function UygulamaContent() {
  return (
    <>
      <PageHero
        title="Tarlanız cebinizde"
        description="filizlen.io App, veri akışının kontrol panelidir: tarladan gelen ölçümü görür, öneriyi onaylar, komutun sahaya gittiğini takip edersiniz."
      />

      <AnimatedSection className="bg-[var(--background-elevated)]">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <SectionHeading
            eyebrow="Veri akışı"
            title="App bu zincirin görünür yüzü"
            description="Sense veriyi toplar, Cloud birleştirir, siz App'te izler ve onaylarsınız, Control komutu iletir."
          />
          <div className="mt-8">
            <DataFlowPipeline showIntro={false} />
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection>
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={defaultTransition}
            >
              <div className="relative mx-auto max-w-sm">
                <div className="glass-card aspect-[9/19] max-h-[520px] rounded-[2.5rem] border-2 border-[rgba(34,197,94,0.2)] p-4 shadow-[0_0_60px_rgba(34,197,94,0.15)]">
                  <div className="flex h-full flex-col rounded-[2rem] bg-[#0a120e] p-4">
                    <div className="mb-4 flex items-center gap-2 border-b border-[rgba(34,197,94,0.15)] pb-3">
                      <Smartphone className="h-5 w-5 text-primary" />
                      <span className="font-semibold">filizlen.io</span>
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="rounded-lg bg-primary/15 p-3">
                        <p className="text-xs text-muted">Aktif parsel</p>
                        <p className="font-semibold text-primary">Kuzey Tarla A</p>
                      </div>
                      <div className="rounded-lg bg-[rgba(34,197,94,0.08)] p-3">
                        <p className="text-xs text-muted">Toprak nemi</p>
                        <p className="text-2xl font-bold">%42</p>
                      </div>
                      <div className="rounded-lg border border-accent/30 bg-accent/10 p-3">
                        <p className="text-xs text-muted">Öneri — onay bekliyor</p>
                        <p className="text-sm font-medium">Sulama: 18:00 · 45 dk</p>
                        <p className="mt-2 text-xs text-primary">Onayla → Control</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <div>
              <h2 className="text-xl font-semibold text-foreground md:text-2xl">
                Uygulamada neler yaparsınız?
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">
                Veri tarlada toplanır, Cloud&apos;da işlenir; siz App ile aradaki
                boşluğu kapatırsınız: görürsünüz, anlarsınız, onaylarsınız.
              </p>
              <motion.ul
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="mt-6 space-y-4"
              >
                {appFeatures.map((feature, i) => (
                  <motion.li
                    key={feature}
                    variants={fadeInUp}
                    transition={{ ...defaultTransition, delay: i * 0.06 }}
                    className="flex items-start gap-3"
                  >
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                      <Check className="h-4 w-4" />
                    </span>
                    <span className="text-muted">{feature}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="bg-[#080f0c]">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <p className="mx-auto max-w-2xl text-muted">
            Uygulama sahada aktif kullanılıyor. Yeni işletmeler için kurulum ve
            onboarding süreci devam ediyor.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Button href="/nasil-calisir" variant="secondary">
              Tüm akışı gör
            </Button>
            <Button href="/iletisim">Uygulama demosu talep et</Button>
          </div>
        </div>
      </AnimatedSection>
    </>
  );
}
