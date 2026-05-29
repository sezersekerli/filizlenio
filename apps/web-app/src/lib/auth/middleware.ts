import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { ACCESS_COOKIE } from "@/lib/auth/constants";

const ISSUER = "filizlen-api";

function isProtected(pathname: string) {
  return (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/parcels") ||
    pathname.startsWith("/packages")
  );
}

export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(ACCESS_COOKIE)?.value;
  const secret = process.env.AUTH_JWT_SECRET;

  let userId: string | null = null;

  if (token && secret) {
    try {
      const { payload } = await jwtVerify(token, new TextEncoder().encode(secret), {
        issuer: ISSUER,
        algorithms: ["HS256"],
      });
      userId = payload.sub ?? null;
    } catch {
      userId = null;
    }
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
