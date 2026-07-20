import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { adminAuthOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import TaskGuide from "@/models/TaskGuide";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(adminAuthOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    await connectDB();
    const updated = await TaskGuide.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!updated) return NextResponse.json({ error: "Guide not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ error: "A guide with this slug already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: error.message || "Failed to update guide" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(adminAuthOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();
    const deleted = await TaskGuide.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ error: "Guide not found" }, { status: 404 });
    return NextResponse.json({ message: "Guide deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete guide" }, { status: 500 });
  }
}
