import PointsLedger from "@/models/PointsLedger";
import type { IPointsLedger } from "@/models/PointsLedger";
import BookingIntent from "@/models/BookingIntent";

export const POINTS_RULES = {
  SIGNUP_BONUS: 100,
} as const;

/** Sums the ledger to get a user's current points balance. */
export async function getPointsBalance(userId: string): Promise<number> {
  const result = await PointsLedger.aggregate([
    { $match: { userId } },
    { $group: { _id: null, total: { $sum: "$pointsAmount" } } },
  ]);
  return result[0]?.total ?? 0;
}

/**
 * Grants the signup bonus exactly once per user — checks the ledger first,
 * so it's safe to call from both the credentials register route and the
 * OAuth signIn callback without risking a double-award.
 */
export async function grantSignupBonusIfNeeded(userId: string): Promise<void> {
  const alreadyGranted = await PointsLedger.exists({
    userId,
    reason: "signup_bonus",
  });
  if (alreadyGranted) return;

  await PointsLedger.create({
    userId,
    pointsAmount: POINTS_RULES.SIGNUP_BONUS,
    reason: "signup_bonus",
  });
}

// ---------------------------------------------------------------------
// Booking / click points — added for the deep-link points system.
// Balance is always computed live via getPointsBalance() above; nothing
// here caches a balance anywhere, to keep one single source of truth.
// ---------------------------------------------------------------------

// Points awarded per CONFIRMED booking, by flowKey/category. Starting-point
// suggestions reflecting "hotel/flight > taxi" — tune freely once you see
// real redemption behavior.
export const CATEGORY_POINTS: Record<string, number> = {
  flight: 80,
  hotel: 50,
  doctor: 30,
  shop: 15,
  bus: 20,
  train: 20,
  taxi: 10,
  parcel: 10,
  drivingLicence: 10,
  revenueLicence: 10,
  job: 5,
  nic: 5,
};

// Flat point awarded immediately on click-through (Tier 1 — low trust,
// so kept small regardless of category).
export const CLICK_BONUS_POINTS = 5;

// Bonus for a user's first CONFIRMED booking in a category they haven't
// booked in before.
export const NEW_CATEGORY_BONUS_POINTS = 25;

// Every Nth confirmed booking in a rolling 30-day window earns a streak bonus.
export const STREAK_INTERVAL = 3;
export const STREAK_BONUS_POINTS = 20;

export function categoryPoints(flowKey: string): number {
  return CATEGORY_POINTS[flowKey] ?? 10; // sensible default for anything new
}

/** Writes a single ledger entry. Balance is derived later via getPointsBalance(). */
export async function awardPoints(params: {
  userId: string;
  pointsAmount: number;
  reason: IPointsLedger["reason"];
  serviceId?: string;
  bookingIntentId?: string;
  referralClickId?: string;
  expiryMonths?: number; // points expire after this many months of inactivity
}): Promise<void> {
  const { userId, pointsAmount, reason, serviceId, bookingIntentId, referralClickId, expiryMonths } = params;

  const expiryDate = expiryMonths
    ? new Date(Date.now() + expiryMonths * 30 * 24 * 60 * 60 * 1000)
    : undefined;

  await PointsLedger.create({
    userId,
    pointsAmount,
    reason,
    serviceId,
    bookingIntentId,
    referralClickId,
    expiryDate,
  });
}

/**
 * Checks whether this is the user's first CONFIRMED booking in a given
 * category (flowKey). Used to decide whether to award NEW_CATEGORY_BONUS_POINTS.
 */
export async function isFirstConfirmedInCategory(userId: string, flowKey: string, excludeIntentId: string): Promise<boolean> {
  const existing = await BookingIntent.exists({
    userId,
    flowKey,
    status: "confirmed",
    _id: { $ne: excludeIntentId },
  });
  return !existing;
}

/**
 * Counts confirmed bookings in the last 30 days (excluding nothing —
 * call this AFTER marking the current one confirmed, or add +1 yourself
 * if calling before, as done in the confirm route).
 */
export async function recentConfirmedCount(userId: string, sinceMs = 30 * 24 * 60 * 60 * 1000): Promise<number> {
  const since = new Date(Date.now() - sinceMs);
  return BookingIntent.countDocuments({
    userId,
    status: "confirmed",
    confirmedAt: { $gte: since },
  });
}