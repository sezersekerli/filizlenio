"use client";

import { motion } from "framer-motion";

const lights = [
  { size: 120, left: "8%", delay: 0, duration: 14, opacity: 0.35 },
  { size: 80, left: "22%", delay: 2, duration: 11, opacity: 0.25 },
  { size: 160, left: "48%", delay: 1, duration: 16, opacity: 0.2 },
  { size: 100, left: "68%", delay: 3, duration: 13, opacity: 0.3 },
  { size: 70, left: "85%", delay: 0.5, duration: 10, opacity: 0.22 },
  { size: 140, left: "38%", delay: 4, duration: 18, opacity: 0.18 },
];

/** Yumuşak, yukarı süzülen ışık küreleri — sayfa atmosferi */
export function CelestialGlow() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {lights.map((light, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: light.size,
            height: light.size,
            left: light.left,
            bottom: "-10%",
            background:
              i % 2 === 0
                ? `radial-gradient(circle, rgba(34,197,94,${light.opacity}) 0%, rgba(74,222,128,0.08) 40%, transparent 70%)`
                : `radial-gradient(circle, rgba(186,230,253,${light.opacity * 0.9}) 0%, rgba(56,189,248,0.06) 45%, transparent 72%)`,
            filter: "blur(28px)",
          }}
          animate={{
            y: [0, -280, -560],
            x: [0, i % 2 === 0 ? 24 : -20, 0],
            opacity: [0, light.opacity, 0],
            scale: [0.85, 1.1, 0.9],
          }}
          transition={{
            duration: light.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: light.delay,
          }}
        />
      ))}
      <motion.div
        className="absolute left-1/2 top-[15%] h-px w-[min(90%,48rem)] -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/25 to-transparent"
        animate={{ opacity: [0.2, 0.55, 0.2], scaleX: [0.9, 1, 0.9] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
