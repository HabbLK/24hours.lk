import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { adminAuthOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";

export async function GET() {
  try {
    const session = await getServerSession(adminAuthOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectDB();
    const settings = await SiteSettings.find({}).lean();
    const settingsObject = settings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, any>);

    return NextResponse.json(settingsObject);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(adminAuthOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    await connectDB();

    const updates = Object.entries(body).map(([key, value]) =>
      SiteSettings.findOneAndUpdate(
        { key },
        { key, value },
        { upsert: true, new: true }
      )
    );

    await Promise.all(updates);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
