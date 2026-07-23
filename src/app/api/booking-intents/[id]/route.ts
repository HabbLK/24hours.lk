import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import BookingIntent from "@/models/BookingIntent";

export async function PATCH(req: NextRequest, context: { params: { id: string } | Promise<{ id: string }> }) {
  const { id } = await Promise.resolve(context.params);
  const body = await req.json(); // { awayDurationMs: number }
  await connectDB();

  const updated = await BookingIntent.findByIdAndUpdate(
    id,
    { awayDurationMs: body.awayDurationMs },
    { new: true }
  );

  if (!updated) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}