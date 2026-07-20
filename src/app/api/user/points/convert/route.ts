import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import PointsLedger from "@/models/PointsLedger";
import PromoCode from "@/models/PromoCode";
import User from "@/models/User";
import crypto from "crypto";
import { sendPromoCodeEmail } from "@/lib/mail";

const REDEMPTION_THRESHOLD = 500;
const CODE_EXPIRY_DAYS = 30;

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectDB();

    const userId = (session.user as any).id;
    const now = new Date();

    const transactions = await PointsLedger.find({
      userId,
      $or: [
        { expiryDate: null },
        { expiryDate: { $gt: now } },
      ],
    }).lean();

    const balance = transactions.reduce((sum, t) => sum + t.pointsAmount, 0);

    if (balance < REDEMPTION_THRESHOLD) {
      return NextResponse.json(
        { error: `You need at least ${REDEMPTION_THRESHOLD} points to generate a promo code. Current balance: ${balance}` },
        { status: 400 }
      );
    }

    const code = `24H-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;

    const promoCode = await PromoCode.create({
      code,
      userId,
      pointsTransactionId: "pending",
      value: REDEMPTION_THRESHOLD,
      expiresAt: new Date(now.getTime() + CODE_EXPIRY_DAYS * 24 * 60 * 60 * 1000),
    });

    await PointsLedger.create({
      userId,
      pointsAmount: -REDEMPTION_THRESHOLD,
      reason: "promo_conversion",
      expiryDate: undefined,
    });

    await PromoCode.findByIdAndUpdate(promoCode._id, {
      pointsTransactionId: promoCode._id.toString(),
    });

    const user = await User.findById(userId).lean();
    if (user?.email) {
      await sendPromoCodeEmail(user.email, user.name, promoCode.code, REDEMPTION_THRESHOLD, promoCode.expiresAt);
    }

    return NextResponse.json({ code: promoCode.code, expiresAt: promoCode.expiresAt });
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate promo code" }, { status: 500 });
  }
}
