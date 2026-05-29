"use client";

import { blurIn, defaultTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.header
      initial="hidden"
      animate="visible"
      variants={blurIn}
      transition={defaultTransition}
      className={cn("flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", className)}
    >
      <div>
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-2">
            {eyebrow}
          </p>
        )}
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gradient">
          {title}
        </h1>
        {description && (
          <p className="text-muted mt-2 text-sm md:text-base max-w-xl">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </motion.header>
  );
}
