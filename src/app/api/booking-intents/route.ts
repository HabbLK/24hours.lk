import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import BookingIntent from "@/models/BookingIntent";

export async function POST(req: NextRequest) {
  const body = await req.json();
  await connectDB();
  await BookingIntent.create(body);
  return NextResponse.json({ ok: true });
}