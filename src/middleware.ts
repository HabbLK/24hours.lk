import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
  "Surrogate-Control": "no-store",
};

function withNoCache(response: NextResponse) {
  for (const [key, value] of Object.entries(NO_CACHE_HEADERS)) {
    response.headers.set(key, value);
  }
  return response;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/account")) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return withNoCache(NextResponse.redirect(loginUrl));
    }
    return withNoCache(NextResponse.next());
  }

  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      return withNoCache(NextResponse.next());
    }

    // Admin session lives in its own cookie (separate from the regular user session),
    // so it must be verified explicitly here rather than via the default token lookup.
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
      cookieName: "next-auth.admin-session-token",
    });

    if (!token || token.role !== "admin") {
      return withNoCache(NextResponse.redirect(new URL("/admin/login", req.url)));
    }
    return withNoCache(NextResponse.next());
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*", "/admin/:path*"],
};
