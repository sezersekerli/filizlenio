"use client";

import { motion } from "framer-motion";

export function GridBeam() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-50">
      <motion.div
        className="absolute -left-1/4 top-0 h-[2px] w-[150%] bg-gradient-to-r from-transparent via-primary to-transparent"
        animate={{ y: ["0vh", "100vh"] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute left-0 top-0 h-full w-[2px] bg-gradient-to-b from-transparent via-accent/70 to-transparent"
        style={{ left: "28%" }}
        animate={{ opacity: [0.15, 0.75, 0.15] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div
        className="absolute left-0 top-0 h-full w-[2px] bg-gradient-to-b from-transparent via-primary/50 to-transparent"
        style={{ left: "72%" }}
        animate={{ opacity: [0.75, 0.2, 0.75] }}
        transition={{ duration: 5, repeat: Infinity, delay: 1 }}
      />
    </div>
  );
}
