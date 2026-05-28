"use client";

import { motion } from "framer-motion";
import { PageHero } from "@/components/layout/PageHero";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Button } from "@/components/ui/Button";
import { steps } from "@/lib/content";
import { fadeInUp, staggerContainer, defaultTransition } from "@/lib/motion";

export default function NasilCalisirPage() {
  return (
    <>
      <PageHero
        title="Dört adımda devreye alma"
        description="Keşiften optimizasyona kadar şeffaf ve ölçülebilir bir süreç."
      />

      <AnimatedSection>
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative space-y-0"
          >
            {steps.map((item, i) => (
              <motion.div
                key={item.step}
                variants={fadeInUp}
                transition={{ ...defaultTransition, delay: i * 0.1 }}
                className="relative grid gap-4 border-l-2 border-primary/30 py-10 pl-10 md:grid-cols-[120px_1fr] md:gap-8"
              >
                <span className="absolute -left-[9px] top-10 h-4 w-4 rounded-full bg-primary shadow-[0_0_12px_rgba(34,197,94,0.6)]" />
                <span className="text-3xl font-bold text-primary/80">{item.step}</span>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">{item.title}</h2>
                  <p className="mt-2 text-muted">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="bg-[#080f0c]">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <Button href="/iletisim">Süreci konuşalım</Button>
        </div>
      </AnimatedSection>
    </>
  );
}
