import PointsLedger from "@/models/PointsLedger";

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