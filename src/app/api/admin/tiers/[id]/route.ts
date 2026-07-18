import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { getAdminAuthOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Service from "@/models/Service";
import AuditLog from "@/models/AuditLog";

const GOVERNMENT_CATEGORIES = ["government"];

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(getAdminAuthOptions());
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { tier, tierStatus, billingCycle, nextBillingDate, badgeFlag } = await request.json();
    await connectDB();

    const service = await Service.findById(id);
    if (!service) return NextResponse.json({ error: "Service not found" }, { status: 404 });

    if (GOVERNMENT_CATEGORIES.includes(service.category) && tier !== "basic") {
      return NextResponse.json(
        { error: "Government services must remain on basic/free tier" },
        { status: 400 }
      );
    }

    const changes: Record<string, { from: any; to: any }> = {};
    if (tier !== undefined && tier !== service.tier) changes.tier = { from: service.tier, to: tier };
    if (tierStatus !== undefined && tierStatus !== service.tierStatus) changes.tierStatus = { from: service.tierStatus, to: tierStatus };
    if (billingCycle !== undefined && billingCycle !== service.billingCycle) changes.billingCycle = { from: service.billingCycle, to: billingCycle };
    if (nextBillingDate !== undefined && nextBillingDate !== service.nextBillingDate) changes.nextBillingDate = { from: service.nextBillingDate, to: nextBillingDate };
    if (badgeFlag !== undefined && badgeFlag !== service.badgeFlag) changes.badgeFlag = { from: service.badgeFlag, to: badgeFlag };

    if (tier === "featured") {
      service.featured = true;
    } else if (service.tier === "featured" && tier !== "featured") {
      service.featured = false;
    }

    if (tier !== undefined) service.tier = tier;
    if (tierStatus !== undefined) service.tierStatus = tierStatus;
    if (billingCycle !== undefined) service.billingCycle = billingCycle;
    if (nextBillingDate !== undefined) service.nextBillingDate = nextBillingDate;
    if (badgeFlag !== undefined) service.badgeFlag = badgeFlag;

    await service.save();

    if (Object.keys(changes).length > 0) {
      await AuditLog.create({
        adminUserId: (session.user as any).id,
        adminEmail: session.user.email || "unknown",
        action: "update_tier",
        targetType: "service",
        targetId: id,
        changes,
      });
    }

    return NextResponse.json(service);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update tier" }, { status: 500 });
  }
}
