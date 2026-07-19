import mongoose, { Schema, Document, Model } from "mongoose";

export interface IReferralClick extends Document {
  userId?: string;
  serviceId: string;
  serviceSlug: string;
  clickToken: string;
  confirmed: boolean;
  confirmedAt?: Date;
  confirmedBy?: string;
  createdAt: Date;
}

const ReferralClickSchema: Schema = new Schema(
  {
    userId: { type: String, default: null },
    serviceId: { type: String, required: true },
    serviceSlug: { type: String, required: true },
    clickToken: { type: String, required: true, unique: true },
    confirmed: { type: Boolean, default: false },
    confirmedAt: { type: Date, default: null },
    confirmedBy: { type: String, default: null },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

ReferralClickSchema.index({ userId: 1 });
ReferralClickSchema.index({ clickToken: 1 }, { unique: true });
ReferralClickSchema.index({ serviceSlug: 1 });

const ReferralClick: Model<IReferralClick> =
  mongoose.models.ReferralClick || mongoose.model<IReferralClick>("ReferralClick", ReferralClickSchema);

export default ReferralClick;
