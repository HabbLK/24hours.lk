import mongoose, { Schema, Document, Model } from "mongoose";

export type BookingStatus = "clicked" | "confirmed" | "declined";

export interface IBookingIntent extends Document {
  userId: string;
  flowKey: string; // doubles as "category" for points weighting
  slots: Record<string, string>;
  serviceSlug: string;
  serviceName: string;
  redirectUrl: string;
  deepLinkFallbackReason?: string | null;
  // Tier 1: set the moment the user clicks a provider. Tier 2: updated
  // later when the user self-confirms whether they actually booked.
  status: BookingStatus;
  // Rough proxy for "did they actually engage with the provider site" —
  // gap between redirect and the browser tab regaining focus. Not
  // precise (can't see anything cross-origin), just a weak signal.
  awayDurationMs?: number | null;
  clickPointsAwarded: number;
  confirmedPointsAwarded: number;
  confirmedAt?: Date | null;
  createdAt: Date;
}

const BookingIntentSchema: Schema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    flowKey: { type: String, required: true },
    slots: { type: Schema.Types.Mixed, required: true },
    serviceSlug: { type: String, required: true },
    serviceName: { type: String, required: true },
    redirectUrl: { type: String, required: true },
    deepLinkFallbackReason: { type: String, default: null },
    status: { type: String, enum: ["clicked", "confirmed", "declined"], default: "clicked" },
    awayDurationMs: { type: Number, default: null },
    clickPointsAwarded: { type: Number, default: 0 },
    confirmedPointsAwarded: { type: Number, default: 0 },
    confirmedAt: { type: Date, default: null },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

BookingIntentSchema.index({ userId: 1, status: 1, createdAt: -1 });

const BookingIntent: Model<IBookingIntent> =
  mongoose.models.BookingIntent || mongoose.model<IBookingIntent>("BookingIntent", BookingIntentSchema);

export default BookingIntent;