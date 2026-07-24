import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import BookingIntent from "@/models/BookingIntent";
import { awardPoints, CLICK_BONUS_POINTS } from "@/lib/points";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  // NOTE: this assumes your NextAuth callbacks populate session.user.id.
  // If that's not wired up yet, see the callback snippet flagged
  // separately — everything below silently no-ops on points if userId
  // is missing, so nothing breaks, but points won't be tracked.
  const userId = (session?.user as { id?: string } | undefined)?.id;

  const body = await req.json();
  await connectDB();

  const intent = await BookingIntent.create({
    ...body,
    userId: userId ?? "anonymous",
    status: "clicked",
    clickPointsAwarded: userId ? CLICK_BONUS_POINTS : 0,
  });

  if (userId) {
    await awardPoints({
      userId,
      pointsAmount: CLICK_BONUS_POINTS,
      reason: "click_bonus",
      serviceId: body.serviceSlug,
      bookingIntentId: intent._id.toString(),
    });
  }

  return NextResponse.json({ ok: true, id: intent._id.toString() });
}