import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Service from "@/models/Service";

export async function GET(req: NextRequest) {
  const tagsParam = req.nextUrl.searchParams.get("tags");
  if (!tagsParam) {
    return NextResponse.json({ error: "tags required" }, { status: 400 });
  }
  const tags = tagsParam.split(",");

  await connectDB();
  const services = await Service.find({
    active: true,
    tags: { $in: tags },
  })
    .sort({ featured: -1, sortOrder: 1 })
    .lean();

  return NextResponse.json({ services });
}