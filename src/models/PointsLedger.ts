import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPointsLedger extends Document {
  userId: string;
  serviceId?: string;
  referralClickId?: string;
  pointsAmount: number;
  reason: "booking_confirmed" | "referral" | "promo_conversion" | "expiry" | "admin_adjustment";
  timestamp: Date;
  expiryDate?: Date;
}

const PointsLedgerSchema: Schema = new Schema(
  {
    userId: { type: String, required: true },
    serviceId: { type: String, default: null },
    referralClickId: { type: String, default: null },
    pointsAmount: { type: Number, required: true },
    reason: {
      type: String,
      enum: ["booking_confirmed", "referral", "promo_conversion", "expiry", "admin_adjustment"],
      required: true,
    },
    timestamp: { type: Date, default: Date.now },
    expiryDate: { type: Date, default: null },
  },
  { timestamps: false }
);

PointsLedgerSchema.index({ userId: 1, timestamp: -1 });
PointsLedgerSchema.index({ expiryDate: 1 });

const PointsLedger: Model<IPointsLedger> =
  mongoose.models.PointsLedger || mongoose.model<IPointsLedger>("PointsLedger", PointsLedgerSchema);

export default PointsLedger;
