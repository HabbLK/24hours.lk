import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Signed out" });

  // Clear all admin auth cookies
  const cookies = [
    "next-auth.admin-session-token",
    "next-auth.admin-callback-url",
    "next-auth.admin-csrf-token",
  ];

  for (const name of cookies) {
    response.cookies.set(name, "", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 0,
    });
  }

  return response;
}
