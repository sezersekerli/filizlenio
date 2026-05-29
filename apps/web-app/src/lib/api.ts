import { FilizlenApiClient } from "@filizlen/api-client";

let client: FilizlenApiClient | null = null;

export function getApiClient() {
  if (!client) {
    client = new FilizlenApiClient({
      baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3012",
      credentials: "include",
    });
  }
  return client;
}
