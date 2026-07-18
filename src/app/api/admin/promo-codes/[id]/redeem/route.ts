import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { getAdminAuthOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import PromoCode from "@/models/PromoCode";
import AuditLog from "@/models/AuditLog";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(getAdminAuthOptions());
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();

    const code = await PromoCode.findById(id);
    if (!code) return NextResponse.json({ error: "Promo code not found" }, { status: 404 });
    if (code.status === "redeemed") return NextResponse.json({ error: "Already redeemed" }, { status: 400 });

    code.status = "redeemed";
    code.redeemedAt = new Date();
    code.redeemedBy = (session.user as any).id;
    await code.save();

    await AuditLog.create({
      adminUserId: (session.user as any).id,
      adminEmail: session.user?.email || "unknown",
      action: "redeem_promo_code",
      targetType: "promo_code",
      targetId: id,
      changes: { status: { from: "active", to: "redeemed" } },
    });

    return NextResponse.json(code);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to redeem promo code" }, { status: 500 });
  }
}
