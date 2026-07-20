import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcrypt";
import { grantSignupBonusIfNeeded } from "@/lib/points";
import crypto from "crypto";
import { sendOtpEmail } from "@/lib/mail";

const OTP_EXPIRY_MINUTES = 10;

function generateOtp() {
  return crypto.randomInt(100000, 1000000).toString();
}

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    await connectDB();

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const otp = generateOtp();
    const otpExpires = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    const normalizedEmail = email.toLowerCase().trim();
    const trimmedName = name.trim();

    const user = await User.create({
      name: trimmedName,
      email: normalizedEmail,
      password: hashedPassword,
      provider: "email",
      role: "user",
      emailOtp: otp,
      emailOtpExpires: otpExpires,
    });

    await grantSignupBonusIfNeeded(user._id.toString());
    await sendOtpEmail(normalizedEmail, trimmedName, otp);

    return NextResponse.json(
      {
        message: "Account created. Check your email for a verification code.",
        requiresVerification: true,
        email: normalizedEmail,
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error?.code === 11000) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 }
    );
  }
}
