import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { ACCESS_COOKIE, REFRESH_COOKIE, getApiBaseUrl } from "@/lib/auth/constants";

const ISSUER = "filizlen-api";

function isProtected(pathname: string) {
  return (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/farm") ||
    pathname.startsWith("/parcels") ||
    pathname.startsWith("/packages")
  );
}

async function verifyToken(token: string, secret: string) {
  const { payload } = await jwtVerify(token, new TextEncoder().encode(secret), {
    issuer: ISSUER,
    algorithms: ["HS256"],
  });
  return payload.sub ?? null;
}

async function tryRefresh(request: NextRequest) {
  const refresh = request.cookies.get(REFRESH_COOKIE)?.value;
  if (!refresh) return null;

  const res = await fetch(`${getApiBaseUrl()}/auth/refresh`, {
    method: "POST",
    headers: { cookie: `${REFRESH_COOKIE}=${refresh}` },
    credentials: "include",
  });

  if (!res.ok) return null;

  const setCookies = res.headers.getSetCookie?.() ?? [];
  const response = NextResponse.next({ request });
  for (const c of setCookies) {
    response.headers.append("set-cookie", c);
  }
  return response;
}

export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(ACCESS_COOKIE)?.value;
  const secret = process.env.AUTH_JWT_SECRET;

  let userId: string | null = null;

  if (token && secret) {
    try {
      userId = await verifyToken(token, secret);
    } catch {
      userId = null;
    }
  }

  if (!userId && token && secret && isProtected(pathname)) {
    const refreshed = await tryRefresh(request);
    if (refreshed) return refreshed;
  }

  if (!userId && isProtected(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  if (userId && pathname === "/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  if (userId && pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next({ request });
}
