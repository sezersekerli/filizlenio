"use client";

import { motion } from "framer-motion";

/** Dikey zaman çizgisi — adımlar arası akan veri ışığı */
export function FlowTimelineLinks() {
  return (
    <svg
      className="pointer-events-none absolute left-6 top-8 hidden h-[calc(100%-4rem)] w-4 md:left-1/2 md:block md:-translate-x-1/2"
      viewBox="0 0 16 800"
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="flow-line-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(34,197,94,0.15)" />
          <stop offset="50%" stopColor="rgba(74,222,128,0.5)" />
          <stop offset="100%" stopColor="rgba(56,189,248,0.2)" />
        </linearGradient>
        <filter id="flow-glow">
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <line
        x1="8"
        y1="0"
        x2="8"
        y2="800"
        stroke="rgba(34,197,94,0.2)"
        strokeWidth="2"
        strokeDasharray="6 10"
      />
      <motion.line
        x1="8"
        y1="0"
        x2="8"
        y2="800"
        stroke="url(#flow-line-grad)"
        strokeWidth="2.5"
        strokeDasharray="20 780"
        strokeLinecap="round"
        filter="url(#flow-glow)"
        animate={{ strokeDashoffset: [0, -800, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.circle
        r="5"
        cx="8"
        fill="#4ade80"
        filter="url(#flow-glow)"
        animate={{ cy: [40, 760, 40] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
}
