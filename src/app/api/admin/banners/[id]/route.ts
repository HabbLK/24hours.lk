import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { getAdminAuthOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import BannerAd from "@/models/BannerAd";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(getAdminAuthOptions());
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
  const session = await getServerSession(getAdminAuthOptions());
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

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(getAdminAuthOptions());
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
