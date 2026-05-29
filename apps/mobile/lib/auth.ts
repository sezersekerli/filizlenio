import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri } from "expo-auth-session";
import { supabase } from "./supabase";

WebBrowser.maybeCompleteAuthSession();

export async function signInWithGoogle() {
  const redirectTo = makeRedirectUri({ scheme: "filizlen", path: "auth/callback" });

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
      skipBrowserRedirect: true,
    },
  });

  if (error) throw error;
  if (!data.url) throw new Error("No OAuth URL");

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
  if (result.type === "success" && result.url) {
    const url = new URL(result.url);
    const code = url.searchParams.get("code");
    if (code) {
      await supabase.auth.exchangeCodeForSession(code);
    }
  }
}

export async function signOut() {
  await supabase.auth.signOut();
}
