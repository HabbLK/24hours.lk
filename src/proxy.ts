import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const path = req.nextUrl.pathname;

        if (path.startsWith("/admin") && !path.startsWith("/admin/login")) {
          return token !== null && token?.role === "admin";
        }

        if (path.startsWith("/api/admin") && !path.startsWith("/api/admin/auth")) {
          return token !== null && token?.role === "admin";
        }

        return true;
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
