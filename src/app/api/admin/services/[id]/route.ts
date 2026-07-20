import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { adminAuthOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Service from "@/models/Service";
import AuditLog from "@/models/AuditLog";

const GOVERNMENT_CATEGORIES = ["government"];

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(adminAuthOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    await connectDB();

    const existingService = await Service.findById(id);
    if (!existingService) return NextResponse.json({ error: "Service not found" }, { status: 404 });

    if (GOVERNMENT_CATEGORIES.includes(existingService.category)) {
      const tierFields = ["tier", "tierStatus", "billingCycle", "nextBillingDate", "badgeFlag"];
      for (const field of tierFields) {
        if (body[field] && body[field] !== "basic") {
          return NextResponse.json(
            { error: "Government services cannot be assigned a paid tier" },
            { status: 400 }
          );
        }
      }
    }

    const changes: Record<string, { from: any; to: any }> = {};
    for (const key of Object.keys(body)) {
      if (JSON.stringify(existingService.get(key)) !== JSON.stringify(body[key])) {
        changes[key] = { from: existingService.get(key), to: body[key] };
      }
    }

    if (Object.keys(changes).length > 0) {
      await AuditLog.create({
        adminUserId: (session.user as any).id,
        adminEmail: session.user?.email || "unknown",
        action: "update_service",
        targetType: "service",
        targetId: id,
        changes,
      });
    }

    const updatedService = await Service.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json(updatedService);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update service" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(adminAuthOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();

    await AuditLog.create({
      adminUserId: (session.user as any).id,
      adminEmail: session.user?.email || "unknown",
      action: "delete_service",
      targetType: "service",
      targetId: id,
      changes: {},
    });

    const deletedService = await Service.findByIdAndDelete(id);
    if (!deletedService) return NextResponse.json({ error: "Service not found" }, { status: 404 });

    return NextResponse.json({ message: "Service deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete service" }, { status: 500 });
  }
}
