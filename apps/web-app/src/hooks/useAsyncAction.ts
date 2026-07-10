"use client";

import { useCallback, useState } from "react";

export function useAsyncAction<TArgs extends unknown[]>(
  action: (...args: TArgs) => Promise<void>,
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(
    async (...args: TArgs) => {
      setLoading(true);
      setError(null);
      try {
        await action(...args);
      } catch (e) {
        setError(e instanceof Error ? e.message : "İşlem başarısız");
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [action],
  );

  const clearError = useCallback(() => setError(null), []);

  return { run, loading, error, clearError };
}
