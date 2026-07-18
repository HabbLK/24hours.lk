import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Service from "@/models/Service";
import TaskGuide from "@/models/TaskGuide";
import Fuse from "fuse.js";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");

    if (!q) {
      return NextResponse.json({ services: [], guides: [] });
    }

    await connectDB();

    const [services, guides] = await Promise.all([
      Service.find({ active: true }).lean(),
      TaskGuide.find({ active: true }).lean(),
    ]);

    const serviceFuse = new Fuse(services, {
      keys: ["name", "description", "tags"],
      threshold: 0.4,
    });

    const guideFuse = new Fuse(guides, {
      keys: ["title", "keywords"],
      threshold: 0.4,
    });

    const tierPriority: Record<string, number> = { featured: 0, verified: 1, basic: 2 };
    const matchedServices = serviceFuse.search(q).map((res) => res.item);
    matchedServices.sort((a: any, b: any) => {
      const tierA = tierPriority[a.tier] ?? 2;
      const tierB = tierPriority[b.tier] ?? 2;
      return tierA - tierB;
    });
    const matchedGuides = guideFuse.search(q).map((res) => res.item);

    return NextResponse.json({
      services: matchedServices,
      guides: matchedGuides,
    });
  } catch (error) {
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
