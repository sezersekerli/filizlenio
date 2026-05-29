"use client";

import { motion } from "framer-motion";

const orbs = [
  { size: 480, x: "5%", y: "10%", color: "rgba(34,197,94,0.22)", delay: 0 },
  { size: 360, x: "70%", y: "5%", color: "rgba(56,189,248,0.16)", delay: 1.2 },
  { size: 300, x: "55%", y: "50%", color: "rgba(34,197,94,0.14)", delay: 2 },
  { size: 220, x: "8%", y: "65%", color: "rgba(74,222,128,0.12)", delay: 0.6 },
];

export function FloatingOrbs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
          }}
          animate={{
            x: [0, 40, -25, 0],
            y: [0, -30, 20, 0],
            scale: [1, 1.12, 0.94, 1],
          }}
          transition={{
            duration: 14 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: orb.delay,
          }}
        />
      ))}
    </div>
  );
}
