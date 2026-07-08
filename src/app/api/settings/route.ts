import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";

export async function GET() {
  try {
    await connectDB();
    const settings = await SiteSettings.find({});
    // Convert array of key/value to an object for easier frontend consumption
    const settingsObject = settings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, any>);
    
    return NextResponse.json(settingsObject);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch site settings" }, { status: 500 });
  }
}
