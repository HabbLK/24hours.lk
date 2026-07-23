import { NextRequest, NextResponse } from "next/server";
import { getRequestUser } from "@/lib/getRequestUser";
import connectDB from "@/lib/db";
import PromoCode from "@/models/PromoCode";

export async function GET(request: NextRequest) {
  try {
    const requestUser = await getRequestUser(request);
    if (!requestUser) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectDB();

    const codes = await PromoCode.find({ userId: requestUser.id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(codes);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch promo codes" }, { status: 500 });
  }
}
