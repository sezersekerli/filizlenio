import { FilizlenApiClient } from "@filizlen/api-client";
import { supabase } from "./supabase";

export const api = new FilizlenApiClient({
  baseUrl: process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3012",
  getAccessToken: async () => {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? null;
  },
});
