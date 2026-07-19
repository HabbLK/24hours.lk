import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { getAdminAuthOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import ReferralClick from "@/models/ReferralClick";
import PointsLedger from "@/models/PointsLedger";
import AuditLog from "@/models/AuditLog";

const POINTS_PER_BOOKING = 100;
const POINTS_EXPIRY_DAYS = 90;

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(getAdminAuthOptions());
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
