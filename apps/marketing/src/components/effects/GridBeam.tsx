"use client";

import { motion } from "framer-motion";

export function GridBeam() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-40">
      <motion.div
        className="absolute -left-1/4 top-0 h-[2px] w-[150%] bg-gradient-to-r from-transparent via-primary to-transparent"
        animate={{ y: ["0vh", "100vh"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute left-0 top-0 h-full w-[2px] bg-gradient-to-b from-transparent via-accent/60 to-transparent"
        style={{ left: "30%" }}
        animate={{ opacity: [0.2, 0.8, 0.2] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
    </div>
  );
}
