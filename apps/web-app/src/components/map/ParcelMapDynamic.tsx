"use client";

import dynamic from "next/dynamic";

export const ParcelMap = dynamic(
  () => import("./ParcelMap").then((m) => m.ParcelMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 w-full rounded-xl bg-[var(--background-elevated)] animate-pulse" />
    ),
  },
);
