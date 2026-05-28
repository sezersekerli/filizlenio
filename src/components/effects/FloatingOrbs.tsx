"use client";

import { motion } from "framer-motion";

const orbs = [
  { size: 420, x: "10%", y: "15%", color: "rgba(34,197,94,0.18)", delay: 0 },
  { size: 320, x: "75%", y: "8%", color: "rgba(45,212,191,0.14)", delay: 1 },
  { size: 280, x: "60%", y: "55%", color: "rgba(34,197,94,0.12)", delay: 2 },
  { size: 200, x: "5%", y: "60%", color: "rgba(74,222,128,0.1)", delay: 0.5 },
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
            x: [0, 30, -20, 0],
            y: [0, -25, 15, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{
            duration: 12 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: orb.delay,
          }}
        />
      ))}
    </div>
  );
}
