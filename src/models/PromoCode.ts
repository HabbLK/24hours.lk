import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPromoCode extends Document {
  code: string;
  userId: string;
  pointsTransactionId: string;
  value: number;
  status: "active" | "redeemed" | "expired";
  redeemedAt?: Date;
  redeemedBy?: string;
  expiresAt: Date;
  createdAt: Date;
}

const PromoCodeSchema: Schema = new Schema(
  {
    code: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    pointsTransactionId: { type: String, required: true },
    value: { type: Number, required: true },
    status: { type: String, enum: ["active", "redeemed", "expired"], default: "active" },
    redeemedAt: { type: Date, default: null },
    redeemedBy: { type: String, default: null },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

PromoCodeSchema.index({ userId: 1 });
PromoCodeSchema.index({ code: 1 }, { unique: true });
PromoCodeSchema.index({ status: 1, expiresAt: 1 });

const PromoCode: Model<IPromoCode> =
  mongoose.models.PromoCode || mongoose.model<IPromoCode>("PromoCode", PromoCodeSchema);

export default PromoCode;
