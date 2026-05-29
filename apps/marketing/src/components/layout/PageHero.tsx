"use client";

import { motion } from "framer-motion";
import { fadeInUp, defaultTransition } from "@/lib/motion";

type PageHeroProps = {
  title: string;
  description: string;
};

export function PageHero({ title, description }: PageHeroProps) {
  return (
    <section className="hero-gradient border-b border-[rgba(34,197,94,0.1)] pt-32 pb-16 md:pt-40 md:pb-20">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={defaultTransition}
          className="max-w-2xl"
        >
          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            {title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">{description}</p>
        </motion.div>
      </div>
    </section>
  );
}
