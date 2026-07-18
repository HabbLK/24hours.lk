import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { getAdminAuthOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import NewsletterSubscriber from "@/models/Newsletter";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(getAdminAuthOptions());
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();
    const deleted = await NewsletterSubscriber.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ error: "Subscriber not found" }, { status: 404 });
    return NextResponse.json({ message: "Subscriber removed" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to remove subscriber" }, { status: 500 });
  }
}
