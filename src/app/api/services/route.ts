import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Service from "@/models/Service";

export async function GET(request: Request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");

    const query: any = { active: true };
    if (category) query.category = category;
    if (featured === "true") query.featured = true;

    const services = await Service.find(query).sort({ sortOrder: 1, name: 1 });
    return NextResponse.json(services);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}
