export function getApiBaseUrl() {
  return process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3012";
}

export type AuthUser = {
  id: string;
  email: string;
  displayName?: string | null;
  plan?: string;
};
