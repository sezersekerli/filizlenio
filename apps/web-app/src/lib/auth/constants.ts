export const ACCESS_COOKIE = "filizlen_access";
export const REFRESH_COOKIE = "filizlen_refresh";

export function getApiBaseUrl() {
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_API_URL ?? "/api";
  }
  return process.env.NEXT_PUBLIC_API_URL ?? process.env.API_INTERNAL_URL ?? "http://127.0.0.1:3012";
}

export type AuthUser = {
  id: string;
  email: string;
  displayName?: string | null;
  plan?: string;
};
