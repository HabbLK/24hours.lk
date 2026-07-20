import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { adminAuthOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import BannerAd from "@/models/BannerAd";

export async function GET() {
  const session = await getServerSession(adminAuthOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();
    const banners = await BannerAd.find({}).sort({ createdAt: -1 });
    return NextResponse.json(banners);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch banners" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(adminAuthOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    await connectDB();
    const banner = await BannerAd.create(body);
    return NextResponse.json(banner, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create banner" }, { status: 500 });
  }
}
