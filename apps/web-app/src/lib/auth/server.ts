import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { ACCESS_COOKIE, type AuthUser } from "./constants";

const ISSUER = "filizlen-api";

export async function getSessionUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_COOKIE)?.value;
  if (!token) return null;

  const secret = process.env.AUTH_JWT_SECRET;
  if (!secret) return null;

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret), {
      issuer: ISSUER,
      algorithms: ["HS256"],
    });
    const sub = payload.sub;
    if (!sub) return null;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:3012";
    const res = await fetch(`${apiUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) {
      return {
        id: sub,
        email: (payload.email as string) ?? "",
      };
    }
    return res.json() as Promise<AuthUser>;
  } catch {
    return null;
  }
}

export function isAuthConfigured(): boolean {
  return Boolean(process.env.AUTH_JWT_SECRET);
}
