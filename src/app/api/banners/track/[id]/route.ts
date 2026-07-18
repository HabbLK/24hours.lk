import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import BannerAd from "@/models/BannerAd";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    await connectDB();

    const banner = await BannerAd.findById(id);
    if (!banner) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    await BannerAd.findByIdAndUpdate(id, { $inc: { clicks: 1 } });

    return NextResponse.redirect(banner.destinationUrl);
  } catch (error) {
    return NextResponse.redirect(new URL("/", request.url));
  }
}
