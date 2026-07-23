import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { signAccessToken, signRefreshToken, verifyMobileToken } from "@/lib/mobileJwt";

export async function POST(req: NextRequest) {
  try {
    const { refreshToken } = await req.json();

    if (!refreshToken) {
      return NextResponse.json(
        { error: "Missing refresh token" },
        { status: 400 }
      );
    }

    let payload;
    try {
      payload = verifyMobileToken(refreshToken);
    } catch {
      return NextResponse.json(
        { error: "Invalid or expired refresh token" },
        { status: 401 }
      );
    }

    if (payload.type !== "refresh") {
      return NextResponse.json(
        { error: "Invalid or expired refresh token" },
        { status: 401 }
      );
    }

    await connectDB();

    const user = await User.findOne({ _id: payload.sub, active: true }).exec();
    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired refresh token" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      accessToken: signAccessToken(user),
      refreshToken: signRefreshToken(user),
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to refresh session" },
      { status: 500 }
    );
  }
}
