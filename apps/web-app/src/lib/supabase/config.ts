import { readSupabasePublicConfig, type SupabasePublicConfig } from "./public-config";

export function getSupabaseConfig(): SupabasePublicConfig {
  return readSupabasePublicConfig();
}

export function isGoogleAuthEnabled(): boolean {
  return process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === "true";
}

export function isSupabaseConfigured(): boolean {
  const { url, anonKey } = getSupabaseConfig();
  if (!url || !anonKey) return false;
  if (url.includes("placeholder.supabase.co")) return false;
  if (url.includes("your-project.supabase.co")) return false;
  if (url.includes("YOUR_PROJECT_REF")) return false;
  if (anonKey === "placeholder-anon-key" || anonKey === "your-anon-key") return false;
  return true;
}
