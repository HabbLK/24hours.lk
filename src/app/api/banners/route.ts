import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import BannerAd from "@/models/BannerAd";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slot = searchParams.get("slot");
    const category = searchParams.get("category");

    if (!slot) {
      return NextResponse.json({ error: "slot parameter is required" }, { status: 400 });
    }

    await connectDB();

    const now = new Date();
    const query: any = {
      active: true,
      slotType: slot,
      startDate: { $lte: now },
      endDate: { $gte: now },
    };

    if (slot === "category" && category) {
      query.categorySlug = category;
    }

    const banner = await BannerAd.findOne(query).lean();

    if (!banner) {
      return NextResponse.json(null);
    }

    await BannerAd.findByIdAndUpdate(banner._id, { $inc: { impressions: 1 } });

    return NextResponse.json(banner);
  } catch (error) {
    return NextResponse.json(null);
  }
}
