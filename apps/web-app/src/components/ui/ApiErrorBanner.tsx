"use client";

import { motion } from "framer-motion";

export function ApiErrorBanner({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card glow-border rounded-2xl p-5 text-sm border-amber-500/30"
    >
      <p className="text-amber-300 font-medium">API bağlantısı kurulamadı</p>
      <p className="text-muted mt-1 text-xs">{message}</p>
    </motion.div>
  );
}
