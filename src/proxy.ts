import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Account routes — redirect unauthenticated users to login with callbackUrl
    if (pathname.startsWith("/account") && !token) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const path = req.nextUrl.pathname;

        // Admin routes require admin role
        if (path.startsWith("/admin") && !path.startsWith("/admin/login")) {
          return token !== null && token?.role === "admin";
        }

        // Admin API routes require admin role
        if (path.startsWith("/api/admin") && !path.startsWith("/api/admin/auth")) {
          return token !== null && token?.role === "admin";
        }

        // Account routes require any authenticated user
        if (path.startsWith("/account")) {
          return token !== null;
        }

        // Everything else is public
        return true;
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/account/:path*"],
};
