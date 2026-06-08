"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card glow-border rounded-3xl p-12 md:p-16 text-center relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="relative"
      >
        <Icon className="w-14 h-14 text-primary mx-auto mb-5 opacity-80" />
      </motion.div>
      <h3 className="text-xl font-semibold relative">{title}</h3>
      <p className="text-muted text-sm mt-2 mb-8 max-w-sm mx-auto relative">{description}</p>
      {action && <div className="relative">{action}</div>}
    </motion.div>
  );
}
