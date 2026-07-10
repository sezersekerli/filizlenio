"use client";

import { useEffect, useState } from "react";
import { FloatingOrbs } from "./FloatingOrbs";
import { GridBeam } from "./GridBeam";

export function AppBackground({ subtle }: { subtle?: boolean }) {
  const [effects, setEffects] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.innerWidth < 768;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    setEffects(!reduced && !mobile && !coarse);
  }, []);

  return (
    <div
      className={`pointer-events-none fixed inset-0 -z-10 ${subtle ? "opacity-70" : ""}`}
      aria-hidden
    >
      <div className="absolute inset-0 hero-gradient" />
      {effects && (
        <>
          <div className="absolute inset-0 grid-pattern" />
          <FloatingOrbs />
          {!subtle && <GridBeam />}
        </>
      )}
    </div>
  );
}
