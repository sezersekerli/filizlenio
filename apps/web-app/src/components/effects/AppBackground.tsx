"use client";

import { FloatingOrbs } from "./FloatingOrbs";
import { GridBeam } from "./GridBeam";

export function AppBackground({ subtle }: { subtle?: boolean }) {
  return (
    <div
      className={`pointer-events-none fixed inset-0 -z-10 ${subtle ? "opacity-70" : ""}`}
      aria-hidden
    >
      <div className="absolute inset-0 hero-gradient" />
      <div className="absolute inset-0 grid-pattern" />
      <FloatingOrbs />
      {!subtle && <GridBeam />}
    </div>
  );
}
