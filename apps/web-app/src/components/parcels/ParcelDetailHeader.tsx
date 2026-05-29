"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { motion } from "framer-motion";
import { MapPin, Ruler } from "lucide-react";

export function ParcelDetailHeader({
  title,
  nitelik,
  areaM2,
  ada,
  parselNo,
}: {
  title: string;
  nitelik: string | null;
  areaM2: number | null;
  ada: string;
  parselNo: string;
}) {
  return (
    <div>
      <PageHeader eyebrow="Parsel detay" title={title} />
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap gap-3 mt-6"
      >
        <span className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-2 text-xs text-muted">
          <MapPin className="w-3.5 h-3.5 text-primary" />
          Ada {ada} / {parselNo}
        </span>
        {nitelik && (
          <span className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-2 text-xs text-muted">
            {nitelik}
          </span>
        )}
        {areaM2 != null && (
          <span className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-2 text-xs text-muted">
            <Ruler className="w-3.5 h-3.5 text-accent" />
            {areaM2.toLocaleString("tr-TR")} m²
          </span>
        )}
      </motion.div>
    </div>
  );
}
