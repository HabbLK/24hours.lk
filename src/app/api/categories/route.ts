import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Category from "@/models/Category";

export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find({ active: true }).sort({ sortOrder: 1 });
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}
