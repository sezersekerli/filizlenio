"use client";

import { motion } from "framer-motion";

/** Köşe modüller → merkez hub (viewBox koordinatları) */
const links = [
  {
    id: "sense",
    d: "M 248 128 L 500 280",
    delay: 0,
    duration: 2.8,
  },
  {
    id: "control",
    d: "M 752 128 L 500 280",
    delay: 0.45,
    duration: 2.8,
  },
  {
    id: "cloud",
    d: "M 248 432 L 500 280",
    delay: 0.9,
    duration: 2.8,
  },
  {
    id: "proje",
    d: "M 752 432 L 500 280",
    delay: 1.35,
    duration: 2.8,
  },
] as const;

export function EcosystemHubLinks() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 z-0 hidden h-full w-full lg:block"
      viewBox="0 0 1000 560"
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <filter id="hub-line-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="hub-pulse-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(34,197,94,0)" />
          <stop offset="45%" stopColor="rgba(74,222,128,0.95)" />
          <stop offset="55%" stopColor="rgba(56,189,248,0.9)" />
          <stop offset="100%" stopColor="rgba(34,197,94,0)" />
        </linearGradient>
      </defs>

      {links.map((link) => (
        <g key={link.id}>
          {/* Sabit noktalı hat */}
          <path
            d={link.d}
            fill="none"
            stroke="rgba(34,197,94,0.22)"
            strokeWidth="1.5"
            strokeDasharray="5 11"
            strokeLinecap="round"
          />

          {/* Işıklı veri paketi — merkeze */}
          <motion.path
            d={link.d}
            fill="none"
            stroke="url(#hub-pulse-grad)"
            strokeWidth="2.5"
            strokeDasharray="14 186"
            strokeLinecap="round"
            filter="url(#hub-line-glow)"
            initial={{ strokeDashoffset: 0 }}
            animate={{ strokeDashoffset: [0, -200, 0] }}
            transition={{
              duration: link.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: link.delay,
            }}
          />

          {/* Işıklı veri paketi — merkezden geri */}
          <motion.path
            d={link.d}
            fill="none"
            stroke="rgba(74,222,128,0.85)"
            strokeWidth="2"
            strokeDasharray="10 190"
            strokeLinecap="round"
            filter="url(#hub-line-glow)"
            initial={{ strokeDashoffset: -200 }}
            animate={{ strokeDashoffset: [-200, 0, -200] }}
            transition={{
              duration: link.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: link.delay + link.duration * 0.45,
            }}
          />

          {/* Uç noktada parlayan veri noktası */}
          <motion.circle
            r="4"
            fill="#4ade80"
            filter="url(#hub-line-glow)"
            style={{ offsetPath: `path('${link.d}')` }}
            animate={{ offsetDistance: ["0%", "100%", "0%"] }}
            transition={{
              duration: link.duration * 1.15,
              repeat: Infinity,
              ease: "easeInOut",
              delay: link.delay,
            }}
          />
        </g>
      ))}

      {/* Merkez nabız */}
      <motion.circle
        cx="500"
        cy="280"
        r="5"
        fill="#22c55e"
        filter="url(#hub-line-glow)"
        animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.35, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
}
