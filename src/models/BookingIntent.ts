import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBookingIntent extends Document {
  flowKey: string;
  slots: Record<string, string>;
  serviceSlug: string;
  serviceName: string;
  redirectUrl: string;
  createdAt: Date;
}

const BookingIntentSchema: Schema = new Schema(
  {
    flowKey: { type: String, required: true },
    slots: { type: Schema.Types.Mixed, required: true },
    serviceSlug: { type: String, required: true },
    serviceName: { type: String, required: true },
    redirectUrl: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const BookingIntent: Model<IBookingIntent> =
  mongoose.models.BookingIntent || mongoose.model<IBookingIntent>("BookingIntent", BookingIntentSchema);

export default BookingIntent;