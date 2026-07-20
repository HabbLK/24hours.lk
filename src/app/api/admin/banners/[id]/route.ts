import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { adminAuthOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import BannerAd from "@/models/BannerAd";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(adminAuthOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();
    const banner = await BannerAd.findById(id);
    if (!banner) return NextResponse.json({ error: "Banner not found" }, { status: 404 });
    return NextResponse.json(banner);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch banner" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(adminAuthOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    await connectDB();
    const banner = await BannerAd.findByIdAndUpdate(id, body, { new: true });
    if (!banner) return NextResponse.json({ error: "Banner not found" }, { status: 404 });
    return NextResponse.json(banner);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update banner" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(adminAuthOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { action } = await request.json();
    await connectDB();

    let update: any = {};

    if (action === "publish-now") {
      const now = new Date();
      const oneWeekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      update = { startDate: now, endDate: oneWeekLater, active: true };
    } else if (action === "toggle-active") {
      const banner = await BannerAd.findById(id);
      if (!banner) return NextResponse.json({ error: "Banner not found" }, { status: 404 });
      update = { active: !banner.active };
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const banner = await BannerAd.findByIdAndUpdate(id, update, { new: true });
    if (!banner) return NextResponse.json({ error: "Banner not found" }, { status: 404 });
    return NextResponse.json(banner);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update banner" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(adminAuthOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();
    const banner = await BannerAd.findByIdAndDelete(id);
    if (!banner) return NextResponse.json({ error: "Banner not found" }, { status: 404 });
    return NextResponse.json({ message: "Banner deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete banner" }, { status: 500 });
  }
}
