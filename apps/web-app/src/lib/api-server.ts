import { cookies } from "next/headers";
import { cache } from "react";
import { FilizlenApiClient } from "@filizlen/api-client";
import { ACCESS_COOKIE, getApiBaseUrl } from "@/lib/auth/constants";

export const getServerApiClient = cache(async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_COOKIE)?.value;

  return new FilizlenApiClient({
    baseUrl: getApiBaseUrl(),
    credentials: "include",
    getAccessToken: async () => token ?? null,
  });
});
