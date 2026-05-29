import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseConfig, isSupabaseConfigured } from "./config";

export function createClient() {
  const { url, anonKey } = getSupabaseConfig();

  if (!isSupabaseConfigured()) {
    throw new Error(
      "Supabase yapılandırılmamış. apps/web-app/.env.local dosyasına NEXT_PUBLIC_SUPABASE_URL ve NEXT_PUBLIC_SUPABASE_ANON_KEY ekleyin, ardından uygulamayı yeniden build edin.",
    );
  }

  return createBrowserClient(url, anonKey);
}
