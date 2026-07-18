import NextAuth from "next-auth";
import { getAdminAuthOptions } from "@/lib/auth";

const handler = NextAuth(getAdminAuthOptions());

export { handler as GET, handler as POST };
