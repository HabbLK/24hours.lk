import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { adminAuthOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import ReferralClick from "@/models/ReferralClick";
import PointsLedger from "@/models/PointsLedger";
import AuditLog from "@/models/AuditLog";
import User from "@/models/User";
import { sendPointsEarnedEmail } from "@/lib/mail";

const POINTS_PER_BOOKING = 100;
const POINTS_EXPIRY_DAYS = 90;

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(adminAuthOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();

    const referral = await ReferralClick.findById(id);
    if (!referral) return NextResponse.json({ error: "Referral not found" }, { status: 404 });
    if (referral.confirmed) return NextResponse.json({ error: "Already confirmed" }, { status: 400 });

    referral.confirmed = true;
    referral.confirmedAt = new Date();
    referral.confirmedBy = (session.user as any).id;
    await referral.save();

    if (referral.userId) {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + POINTS_EXPIRY_DAYS);

      await PointsLedger.create({
        userId: referral.userId,
        serviceId: referral.serviceId,
        referralClickId: referral._id.toString(),
        pointsAmount: POINTS_PER_BOOKING,
        reason: "booking_confirmed",
        expiryDate,
      });

      const user = await User.findById(referral.userId).lean();
      if (user?.email) {
        const now = new Date();
        const transactions = await PointsLedger.find({
          userId: referral.userId,
          $or: [{ expiryDate: null }, { expiryDate: { $gt: now } }],
        }).lean();
        const balance = transactions.reduce((sum, t) => sum + t.pointsAmount, 0);
        await sendPointsEarnedEmail(user.email, user.name, POINTS_PER_BOOKING, balance);
      }
    }

    await AuditLog.create({
      adminUserId: (session.user as any).id,
      adminEmail: session.user?.email || "unknown",
      action: "confirm_referral",
      targetType: "referral_click",
      targetId: id,
      changes: { confirmed: { from: false, to: true } },
    });

    return NextResponse.json({ message: "Referral confirmed, points awarded" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to confirm referral" }, { status: 500 });
  }
}
