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

    const matchedServices = serviceFuse.search(q).map((res) => res.item);
    const matchedGuides = guideFuse.search(q).map((res) => res.item);

    return NextResponse.json({
      services: matchedServices,
      guides: matchedGuides,
    });
  } catch (error) {
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
