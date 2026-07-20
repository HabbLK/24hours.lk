import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { adminAuthOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Service from "@/models/Service";
import AuditLog from "@/models/AuditLog";

const GOVERNMENT_CATEGORIES = ["government"];

export async function GET() {
  const session = await getServerSession(adminAuthOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();
    const services = await Service.find({}).sort({ createdAt: -1 });
    return NextResponse.json(services);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(adminAuthOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();

    if (GOVERNMENT_CATEGORIES.includes(body.category)) {
      body.tier = "basic";
      body.tierStatus = "active";
      body.billingCycle = null;
      body.nextBillingDate = null;
      body.badgeFlag = null;
    }

    await connectDB();
    const newService = await Service.create(body);
    return NextResponse.json(newService, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create service" }, { status: 500 });
  }
}
