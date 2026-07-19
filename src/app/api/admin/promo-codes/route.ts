import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { getAdminAuthOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import PromoCode from "@/models/PromoCode";
import AuditLog from "@/models/AuditLog";

export async function GET() {
  const session = await getServerSession(getAdminAuthOptions());
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();
    const codes = await PromoCode.find({}).sort({ createdAt: -1 }).limit(500).lean();
    return NextResponse.json(codes);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch promo codes" }, { status: 500 });
  }
}
