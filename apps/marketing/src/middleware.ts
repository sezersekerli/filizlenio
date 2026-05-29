import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PRIMARY_HOST = "filizlen.io";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0] ?? "";
  const proto = request.headers.get("x-forwarded-proto");
  const url = request.nextUrl.clone();

  if (host === `www.${PRIMARY_HOST}`) {
    url.host = PRIMARY_HOST;
    url.protocol = "https:";
    return NextResponse.redirect(url, 301);
  }

  if (proto === "http" && process.env.NODE_ENV === "production") {
    url.protocol = "https:";
    url.host = PRIMARY_HOST;
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
