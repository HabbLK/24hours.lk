import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { signAccessToken, signRefreshToken } from "@/lib/mobileJwt";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing email or password" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({
      email,
      provider: "email",
      active: true,
    }).exec();

    if (!user || !user.password) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    if (!user.emailVerified) {
      return NextResponse.json(
        { error: "Please verify your email before signing in" },
        { status: 401 }
      );
    }

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    return NextResponse.json({
      accessToken,
      refreshToken,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        image: user.avatar,
        role: user.role,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to sign in" },
      { status: 500 }
    );
  }
}
