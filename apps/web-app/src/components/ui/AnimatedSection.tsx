"use client";

import { defaultTransition, fadeInUp } from "@/lib/motion";
import { motion } from "framer-motion";

export function AnimatedSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={fadeInUp}
      transition={{ ...defaultTransition, delay }}
      className={className}
    >
      {children}
    </motion.section>
  );
}
