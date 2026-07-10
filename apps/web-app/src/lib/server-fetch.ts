/**
 * Sunucu bileşenlerinde tutarlı veri yükleme — hata yutma yerine yapılandırılmış sonuç.
 */
export type ServerFetchResult<T> =
  | { ok: true; data: T; error: null }
  | { ok: false; data: null; error: string };

export async function safeServerFetch<T>(
  fn: () => Promise<T>,
  fallbackMessage = "Veri yüklenemedi",
): Promise<ServerFetchResult<T>> {
  try {
    const data = await fn();
    return { ok: true, data, error: null };
  } catch (e) {
    return {
      ok: false,
      data: null,
      error: e instanceof Error ? e.message : fallbackMessage,
    };
  }
}

export async function safeServerFetchAll<T extends readonly unknown[]>(
  fns: { [K in keyof T]: () => Promise<T[K]> },
  fallbackMessage = "Veri yüklenemedi",
): Promise<ServerFetchResult<T>> {
  try {
    const results = await Promise.all(fns.map((fn) => fn()));
    return { ok: true, data: results as unknown as T, error: null };
  } catch (e) {
    return {
      ok: false,
      data: null,
      error: e instanceof Error ? e.message : fallbackMessage,
    };
  }
}
