import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { adminAuthOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Service from "@/models/Service";
import Category from "@/models/Category";
import TaskGuide from "@/models/TaskGuide";
import User from "@/models/User";
import NewsletterSubscriber from "@/models/Newsletter";

export async function GET() {
  const session = await getServerSession(adminAuthOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();

    const [services, categories, guides, users, subscribers] = await Promise.all([
      Service.countDocuments({}),
      Category.countDocuments({}),
      TaskGuide.countDocuments({}),
      User.countDocuments({}),
      NewsletterSubscriber.countDocuments({ active: true }),
    ]);

    return NextResponse.json({ services, categories, guides, users, subscribers });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
