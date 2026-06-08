import { FilizlenApiClient } from "@filizlen/api-client";
import { getApiBaseUrl } from "@/lib/auth/constants";

let client: FilizlenApiClient | null = null;

export function getApiClient() {
  if (!client) {
    client = new FilizlenApiClient({
      baseUrl: getApiBaseUrl(),
      credentials: "include",
    });
  }
  return client;
}
