import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { adminAuthOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import PointsLedger from "@/models/PointsLedger";

export async function GET() {
  const session = await getServerSession(adminAuthOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();
    const transactions = await PointsLedger.find({}).sort({ timestamp: -1 }).limit(500).lean();
    return NextResponse.json(transactions);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch points ledger" }, { status: 500 });
  }
}
