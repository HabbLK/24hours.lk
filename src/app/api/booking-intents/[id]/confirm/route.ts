import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import BookingIntent from "@/models/BookingIntent";
import {
  awardPoints,
  categoryPoints,
  isFirstConfirmedInCategory,
  recentConfirmedCount,
  NEW_CATEGORY_BONUS_POINTS,
  STREAK_INTERVAL,
  STREAK_BONUS_POINTS,
} from "@/lib/points";

export async function POST(req: NextRequest, context: { params: { id: string } | Promise<{ id: string }> }) {
  // Next.js 15 made route `params` a Promise; 14 and earlier pass a plain
  // object. Promise.resolve() handles both safely without needing to know
  // which version is running.
  const { id } = await Promise.resolve(context.params);

  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "not authenticated" }, { status: 401 });

  const { confirmed } = await req.json(); // { confirmed: boolean }
  await connectDB();

  const intent = await BookingIntent.findOne({ _id: id, userId });
  if (!intent) return NextResponse.json({ error: "not found" }, { status: 404 });
  if (intent.status !== "clicked") {
    return NextResponse.json({ error: "already resolved" }, { status: 409 });
  }

  if (!confirmed) {
    intent.status = "declined";
    await intent.save();
    return NextResponse.json({ ok: true, status: "declined" });
  }

  // Confirmed — award category-weighted points.
  const basePoints = categoryPoints(intent.flowKey);
  let totalPoints = basePoints;

  await awardPoints({
    userId,
    pointsAmount: basePoints,
    reason: "booking_confirmed",
    serviceId: intent.serviceSlug,
    bookingIntentId: intent._id.toString(),
    expiryMonths: 12,
  });

  // New-category bonus: first-ever confirmed booking in this flowKey.
  const isFirstInCategory = await isFirstConfirmedInCategory(userId, intent.flowKey, intent._id.toString());
  if (isFirstInCategory) {
    await awardPoints({
      userId,
      pointsAmount: NEW_CATEGORY_BONUS_POINTS,
      reason: "new_category_bonus",
      serviceId: intent.serviceSlug,
      bookingIntentId: intent._id.toString(),
      expiryMonths: 12,
    });
    totalPoints += NEW_CATEGORY_BONUS_POINTS;
  }

  // Streak bonus: every Nth confirmed booking in the last 30 days.
  // +1 to include the one we're confirming right now (it isn't saved as
  // "confirmed" yet at this point in the function).
  const recentCount = await recentConfirmedCount(userId);
  if ((recentCount + 1) % STREAK_INTERVAL === 0) {
    await awardPoints({
      userId,
      pointsAmount: STREAK_BONUS_POINTS,
      reason: "streak_bonus",
      bookingIntentId: intent._id.toString(),
      expiryMonths: 12,
    });
    totalPoints += STREAK_BONUS_POINTS;
  }

  intent.status = "confirmed";
  intent.confirmedAt = new Date();
  intent.confirmedPointsAwarded = totalPoints;
  await intent.save();

  return NextResponse.json({ ok: true, status: "confirmed", pointsAwarded: totalPoints });
}