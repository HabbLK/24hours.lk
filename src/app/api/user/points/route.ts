import { NextRequest, NextResponse } from "next/server";
import { getRequestUser } from "@/lib/getRequestUser";
import connectDB from "@/lib/db";
import PointsLedger from "@/models/PointsLedger";

export async function GET(request: NextRequest) {
  try {
    const requestUser = await getRequestUser(request);
    if (!requestUser) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectDB();

    const userId = requestUser.id;
    const now = new Date();

    const transactions = await PointsLedger.find({
      userId,
      $or: [
        { expiryDate: null },
        { expiryDate: { $gt: now } },
      ],
    }).sort({ timestamp: -1 }).lean();

    const balance = transactions.reduce((sum, t) => sum + t.pointsAmount, 0);

    return NextResponse.json({ balance, transactions });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch points" }, { status: 500 });
  }
}
