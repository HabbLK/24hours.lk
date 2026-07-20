import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and code are required" }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase().trim(), provider: "email" });

    if (!user || !user.emailOtp || !user.emailOtpExpires) {
      return NextResponse.json({ error: "Invalid or expired code" }, { status: 400 });
    }

    if (user.emailOtpExpires < new Date()) {
      return NextResponse.json({ error: "Code has expired. Please request a new one." }, { status: 400 });
    }

    if (user.emailOtp !== String(otp).trim()) {
      return NextResponse.json({ error: "Incorrect code" }, { status: 400 });
    }

    user.emailVerified = new Date();
    user.emailOtp = undefined;
    user.emailOtpExpires = undefined;
    await user.save();

    return NextResponse.json({ message: "Email verified successfully" });
  } catch {
    return NextResponse.json({ error: "Failed to verify code" }, { status: 500 });
  }
}
