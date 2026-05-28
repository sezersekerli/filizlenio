"use client";

import { motion } from "framer-motion";

/** Hero sağ yarısında, metinle çakışmayan yörünge */
export function FlyingDrone() {
  return (
    <motion.div
      className="pointer-events-none absolute z-20 hidden xl:block"
      style={{ width: "42%", height: "70%", right: 0, top: "12%" }}
      animate={{
        x: ["0%", "85%", "85%", "0%", "0%"],
        y: ["0%", "8%", "55%", "48%", "0%"],
        rotate: [-4, 8, -6, 10, -4],
      }}
      transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      aria-hidden
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
      >
        <div className="glass-card rounded-xl border border-primary/40 p-2.5 shadow-[0_0_40px_rgba(34,197,94,0.3)]">
          <svg
            viewBox="0 0 64 64"
            className="h-10 w-10 text-primary"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="32" cy="32" r="6" fill="currentColor" fillOpacity="0.25" />
            <line x1="32" y1="32" x2="14" y2="14" />
            <line x1="32" y1="32" x2="50" y2="14" />
            <line x1="32" y1="32" x2="14" y2="50" />
            <line x1="32" y1="32" x2="50" y2="50" />
            <circle cx="14" cy="14" r="7" strokeDasharray="4 6" className="origin-[14px_14px] animate-spin" style={{ animationDuration: "0.35s" }} />
            <circle cx="50" cy="14" r="7" strokeDasharray="4 6" className="origin-[50px_14px] animate-spin" style={{ animationDuration: "0.35s" }} />
            <circle cx="14" cy="50" r="7" strokeDasharray="4 6" className="origin-[14px_50px] animate-spin" style={{ animationDuration: "0.35s" }} />
            <circle cx="50" cy="50" r="7" strokeDasharray="4 6" className="origin-[50px_50px] animate-spin" style={{ animationDuration: "0.35s" }} />
          </svg>
        </div>
        <motion.div
          className="absolute -bottom-5 left-1/2 h-8 w-px -translate-x-1/2 bg-gradient-to-b from-primary/70 to-transparent"
          animate={{ scaleY: [0.45, 1, 0.45], opacity: [0.4, 0.85, 0.4] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </motion.div>
  );
}
