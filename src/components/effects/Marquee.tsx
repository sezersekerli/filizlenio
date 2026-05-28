"use client";

import { motion } from "framer-motion";

const items = [
  "Akıllı tarım",
  "Güçlü yarınlar",
  "Akıllı Sensörler",
  "Veri Analizi",
  "Kaynak Verimliliği",
  "Her Yerden Erişim",
  "filizlen.io",
  "Tarım 5.0",
];

export function Marquee() {
  const doubled = [...items, ...items];

  return (
    <div className="relative overflow-hidden border-y border-[rgba(34,197,94,0.12)] bg-[#080f0c]/80 py-4">
      <motion.div
        className="flex w-max gap-12 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      >
        {doubled.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="flex items-center gap-12 text-sm font-medium uppercase tracking-[0.2em] text-muted"
          >
            <span className="text-primary">◆</span>
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
