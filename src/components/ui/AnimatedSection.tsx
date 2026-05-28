"use client";

import { motion } from "framer-motion";
import { blurIn, defaultTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";

type AnimatedSectionProps = {
  children: React.ReactNode;
  className?: string;
  id?: string;
};

export function AnimatedSection({ children, className, id }: AnimatedSectionProps) {
  return (
    <motion.section
      id={id}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={blurIn}
      transition={defaultTransition}
      className={cn("py-20 md:py-28", className)}
    >
      {children}
    </motion.section>
  );
}
