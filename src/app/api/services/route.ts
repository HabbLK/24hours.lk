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

    const tierPriority: Record<string, number> = { featured: 0, verified: 1, basic: 2 };
    const services = await Service.find(query).lean();
    services.sort((a: any, b: any) => {
      const tierA = tierPriority[a.tier] ?? 2;
      const tierB = tierPriority[b.tier] ?? 2;
      if (tierA !== tierB) return tierA - tierB;
      return (a.sortOrder || 0) - (b.sortOrder || 0) || a.name.localeCompare(b.name);
    });
    return NextResponse.json(services);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}
