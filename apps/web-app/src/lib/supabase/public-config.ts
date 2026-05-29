export type SupabasePublicConfig = {
  url: string;
  anonKey: string;
};

declare global {
  interface Window {
    __FILIZLEN_SUPABASE__?: SupabasePublicConfig;
  }
}

export function getRuntimeSupabaseConfig(): SupabasePublicConfig {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  };
}

export function readSupabasePublicConfig(): SupabasePublicConfig {
  if (typeof window !== "undefined" && window.__FILIZLEN_SUPABASE__) {
    return window.__FILIZLEN_SUPABASE__;
  }
  return getRuntimeSupabaseConfig();
}
