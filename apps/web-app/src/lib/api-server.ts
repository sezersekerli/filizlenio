import { cookies } from "next/headers";
import { FilizlenApiClient } from "@filizlen/api-client";
import { ACCESS_COOKIE } from "@/lib/auth/constants";

export async function getServerApiClient() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_COOKIE)?.value;

  return new FilizlenApiClient({
    baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:3012",
    credentials: "include",
    getAccessToken: async () => token ?? null,
  });
}
