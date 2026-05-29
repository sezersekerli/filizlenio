import { getRuntimeSupabaseConfig } from "@/lib/supabase/public-config";

export function SupabasePublicConfigScript() {
  const config = getRuntimeSupabaseConfig();
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `window.__FILIZLEN_SUPABASE__=${JSON.stringify(config)};`,
      }}
    />
  );
}
