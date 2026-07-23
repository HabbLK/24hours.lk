import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { verifyMobileToken } from "@/lib/mobileJwt";

export interface RequestUser {
  id: string;
  role: string;
  email?: string;
}

/**
 * Resolves the current user from either a NextAuth session cookie (web) or a
 * mobile bearer JWT (Authorization header). Never throws — returns null when
 * neither is present/valid so callers can uniformly respond 401.
 */
export async function getRequestUser(
  req: Request | NextRequest
): Promise<RequestUser | null> {
  const session = await getServerSession(authOptions);
  if (session?.user) {
    const user = session.user as any;
    return { id: user.id, role: user.role || "user", email: user.email };
  }

  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice("Bearer ".length);
    try {
      const payload = verifyMobileToken(token);
      if (payload.type === "access") {
        return { id: payload.sub, role: payload.role, email: payload.email };
      }
    } catch {
      return null;
    }
  }

  return null;
}
