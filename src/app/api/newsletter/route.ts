import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import NewsletterSubscriber from "@/models/Newsletter";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string" || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 });
    }

    await connectDB();

    const normalized = email.toLowerCase().trim();
    const existing = await NewsletterSubscriber.findOne({ email: normalized });

    if (existing) {
      if (!existing.active) {
        existing.active = true;
        await existing.save();
      }
      return NextResponse.json({ message: "Subscribed" });
    }

    await NewsletterSubscriber.create({ email: normalized });
    return NextResponse.json({ message: "Subscribed" }, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ message: "Subscribed" });
    }
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
