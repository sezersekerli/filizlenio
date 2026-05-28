"use client";

import { motion } from "framer-motion";
import { blurIn, defaultTransition } from "@/lib/motion";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: SectionHeadingProps) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={blurIn}
      transition={defaultTransition}
      className={`mb-12 max-w-2xl ${alignClass}`}
    >
      {eyebrow && (
        <motion.p
          initial={{ opacity: 0, letterSpacing: "0.5em" }}
          whileInView={{ opacity: 1, letterSpacing: "0.2em" }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary"
        >
          {eyebrow}
        </motion.p>
      )}
      <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-muted md:text-lg">{description}</p>
      )}
    </motion.div>
  );
}
