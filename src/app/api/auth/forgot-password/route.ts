import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import crypto from "crypto";
import { sendPasswordResetEmail, getAppUrl } from "@/lib/mail";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail, provider: "email" });
    if (!user) {
      return NextResponse.json(
        { message: "If an account exists with this email, a reset link has been sent" },
        { status: 200 }
      );
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000);

    user.passwordResetToken = resetToken;
    user.passwordResetExpires = resetExpires;
    await user.save();

    const resetUrl = `${getAppUrl()}/reset-password?token=${resetToken}`;
    await sendPasswordResetEmail(normalizedEmail, user.name, resetUrl);

    return NextResponse.json(
      { message: "If an account exists with this email, a reset link has been sent" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
