import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { adminAuthOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import NewsletterSubscriber from "@/models/Newsletter";

export async function GET() {
  const session = await getServerSession(adminAuthOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();
    const subscribers = await NewsletterSubscriber.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json(subscribers);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch subscribers" }, { status: 500 });
  }
}
