import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { adminAuthOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import TaskGuide from "@/models/TaskGuide";

export async function GET() {
  const session = await getServerSession(adminAuthOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();
    const guides = await TaskGuide.find({}).sort({ createdAt: -1 });
    return NextResponse.json(guides);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch guides" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(adminAuthOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    await connectDB();
    const guide = await TaskGuide.create(body);
    return NextResponse.json(guide, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ error: "A guide with this slug already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: error.message || "Failed to create guide" }, { status: 500 });
  }
}
