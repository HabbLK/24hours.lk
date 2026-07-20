import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { adminAuthOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import NewsletterSubscriber from "@/models/Newsletter";
import AuditLog from "@/models/AuditLog";
import { sendMail, renderNewsletterHtml } from "@/lib/mail";

export async function POST(request: Request) {
  const session = await getServerSession(adminAuthOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { subject, body } = await request.json();

    if (!subject?.trim() || !body?.trim()) {
      return NextResponse.json({ error: "Subject and message are required" }, { status: 400 });
    }

    await connectDB();

    const subscribers = await NewsletterSubscriber.find({ active: true }).lean();
    if (subscribers.length === 0) {
      return NextResponse.json({ error: "No active subscribers to send to" }, { status: 400 });
    }

    const html = renderNewsletterHtml(subject.trim(), body.trim());

    const results = await Promise.allSettled(
      subscribers.map((sub) => sendMail({ to: sub.email, subject: subject.trim(), html }))
    );
    const sent = results.filter((r) => r.status === "fulfilled" && r.value).length;
    const failed = subscribers.length - sent;

    await AuditLog.create({
      adminUserId: (session.user as any).id,
      adminEmail: session.user?.email || "unknown",
      action: "send_newsletter_campaign",
      targetType: "newsletter",
      targetId: "bulk",
      changes: { subject: { from: null, to: subject.trim() }, recipients: { from: null, to: subscribers.length } },
    });

    return NextResponse.json({ message: `Sent to ${sent} of ${subscribers.length} subscribers`, sent, failed });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to send campaign" }, { status: 500 });
  }
}
