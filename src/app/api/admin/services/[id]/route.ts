import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import Service from "@/models/Service";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    await connectDB();
    const updatedService = await Service.findByIdAndUpdate(id, body, { new: true });
    if (!updatedService) return NextResponse.json({ error: "Service not found" }, { status: 404 });
    
    return NextResponse.json(updatedService);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update service" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();
    const deletedService = await Service.findByIdAndDelete(id);
    if (!deletedService) return NextResponse.json({ error: "Service not found" }, { status: 404 });
    
    return NextResponse.json({ message: "Service deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete service" }, { status: 500 });
  }
}
