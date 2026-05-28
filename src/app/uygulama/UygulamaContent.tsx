"use client";

import { motion } from "framer-motion";
import { PageHero } from "@/components/layout/PageHero";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Button } from "@/components/ui/Button";
import { appFeatures } from "@/lib/content";
import { fadeInUp, staggerContainer, defaultTransition } from "@/lib/motion";
import { Check, Smartphone } from "lucide-react";

export function UygulamaContent() {
  return (
    <>
      <PageHero
        title="Tarlanız cebinizde"
        description="Filizlen App — iOS ve Android. Saha operatörünün günlük kontrol merkezi; Filizlen Cloud ile birlikte."
      />

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
                      <span className="font-semibold">Filizlen</span>
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
                      <div className="rounded-lg bg-[rgba(34,197,94,0.08)] p-3">
                        <p className="text-xs text-muted">Öneri</p>
                        <p className="text-sm">Sulama: 18:00 — 45 dk</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.ul
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-4"
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
      </AnimatedSection>

      <AnimatedSection className="bg-[#080f0c]">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <p className="text-muted">
            Uygulama sahada aktif kullanılıyor. Yeni işletmeler için kurulum ve
            onboarding süreci devam ediyor.
          </p>
          <div className="mt-6">
            <Button href="/iletisim">Uygulama demosu talep et</Button>
          </div>
        </div>
      </AnimatedSection>
    </>
  );
}
