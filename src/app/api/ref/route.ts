import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import ReferralClick from "@/models/ReferralClick";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { serviceId, serviceSlug } = await request.json();
    const session = await getServerSession(authOptions);

    await connectDB();

    const clickToken = crypto.randomBytes(16).toString("hex");

    const referral = await ReferralClick.create({
      userId: (session?.user as any)?.id || null,
      serviceId,
      serviceSlug,
      clickToken,
    });

    return NextResponse.json({ clickToken, referralId: referral._id });
  } catch (error) {
    return NextResponse.json({ error: "Failed to track referral" }, { status: 500 });
  }
}
