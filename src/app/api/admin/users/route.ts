import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getAdminAuthOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  try {
    const session = await getServerSession(getAdminAuthOptions());
    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectDB();

    const users = await User.find({})
      .select("-password -passwordResetToken -passwordResetExpires")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
