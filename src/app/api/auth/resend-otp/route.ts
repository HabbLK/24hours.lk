import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import crypto from "crypto";
import { sendOtpEmail } from "@/lib/mail";

const OTP_EXPIRY_MINUTES = 10;

function generateOtp() {
  return crypto.randomInt(100000, 1000000).toString();
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    await connectDB();

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail, provider: "email" });

    // Don't reveal whether the account exists
    if (!user || user.emailVerified) {
      return NextResponse.json({ message: "If an unverified account exists, a new code has been sent" });
    }

    const otp = generateOtp();
    user.emailOtp = otp;
    user.emailOtpExpires = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
    await user.save();

    await sendOtpEmail(normalizedEmail, user.name, otp);

    return NextResponse.json({ message: "If an unverified account exists, a new code has been sent" });
  } catch {
    return NextResponse.json({ error: "Failed to resend code" }, { status: 500 });
  }
}
