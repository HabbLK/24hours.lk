import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import TaskGuide from "@/models/TaskGuide";

export async function GET() {
  try {
    await connectDB();
    const guides = await TaskGuide.find({ active: true }).sort({ createdAt: -1 });
    return NextResponse.json(guides);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch task guides" }, { status: 500 });
  }
}
