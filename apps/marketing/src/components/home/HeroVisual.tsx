"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Activity, Droplets, Thermometer, Wifi } from "lucide-react";
import { floatSlow } from "@/lib/motion";

export function HeroVisual() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-8, 8]);

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function onMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <div
      className="relative hidden h-[480px] lg:block"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ perspective: 1200 }}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative h-full w-full"
      >
        <motion.div
          {...floatSlow}
          className="absolute left-1/2 top-1/2 w-[340px] -translate-x-1/2 -translate-y-1/2"
        >
          <div className="glass-card overflow-hidden rounded-3xl border border-primary/30 shadow-[0_0_80px_rgba(34,197,94,0.25)]">
            <div className="border-b border-primary/20 bg-primary/10 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                <span className="text-xs font-medium text-primary">Canlı tarla verisi</span>
              </div>
            </div>
            <div className="space-y-4 p-5">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs text-muted">Toprak nemi</p>
                  <motion.p
                    className="text-4xl font-bold text-accent"
                    animate={{ opacity: [1, 0.7, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    %47
                  </motion.p>
                </div>
                <Droplets className="h-10 w-10 text-primary/40" />
              </div>
              <div className="h-24 rounded-xl bg-[rgba(34,197,94,0.08)] p-3">
                <svg viewBox="0 0 200 60" className="h-full w-full">
                  <motion.path
                    d="M0,45 Q25,20 50,35 T100,25 T150,40 T200,15"
                    fill="none"
                    stroke="url(#grad)"
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, ease: "easeOut" }}
                  />
                  <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#22c55e" />
                      <stop offset="100%" stopColor="#2dd4bf" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg bg-[rgba(15,23,20,0.8)] p-2">
                  <Thermometer className="mb-1 h-4 w-4 text-accent" />
                  <span className="text-muted">24°C</span>
                </div>
                <div className="rounded-lg bg-[rgba(15,23,20,0.8)] p-2">
                  <Activity className="mb-1 h-4 w-4 text-primary" />
                  <span className="text-muted">Aktif</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, -12, 0], x: [0, 8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="glass-card absolute -right-2 top-8 rounded-2xl px-4 py-3 shadow-lg"
          style={{ transform: "translateZ(40px)" }}
        >
          <Wifi className="h-5 w-5 text-primary" />
          <p className="mt-1 text-xs font-semibold text-foreground">Bağlı</p>
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0], x: [0, -6, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="glass-card absolute -left-4 bottom-16 rounded-2xl px-4 py-3"
          style={{ transform: "translateZ(60px)" }}
        >
          <p className="text-xs text-muted">Önerilen sulama</p>
          <p className="font-bold text-primary">18:30 · 42 dk</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
