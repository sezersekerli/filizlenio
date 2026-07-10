"use client";

import { Button } from "@/components/ui/Button";

export function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="glass-card rounded-2xl p-6 space-y-4 max-w-lg mx-auto mt-8" role="alert">
      <h2 className="text-lg font-semibold text-red-300">Bir şeyler ters gitti</h2>
      <p className="text-sm text-muted">{error.message || "Sayfa yüklenemedi."}</p>
      <Button onClick={reset} className="w-full sm:w-auto">
        Tekrar dene
      </Button>
    </div>
  );
}
