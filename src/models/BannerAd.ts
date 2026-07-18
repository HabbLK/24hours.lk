import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBannerAd extends Document {
  title: string;
  imageUrl: string;
  destinationUrl: string;
  slotType: "homepage" | "category" | "search";
  categorySlug?: string;
  startDate: Date;
  endDate: Date;
  active: boolean;
  impressions: number;
  clicks: number;
  createdAt: Date;
  updatedAt: Date;
}

const BannerAdSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    imageUrl: { type: String, required: true },
    destinationUrl: { type: String, required: true },
    slotType: { type: String, enum: ["homepage", "category", "search"], required: true },
    categorySlug: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    active: { type: Boolean, default: true },
    impressions: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
  },
  { timestamps: true }
);

BannerAdSchema.index({ slotType: 1, active: 1, startDate: 1, endDate: 1 });

const BannerAd: Model<IBannerAd> =
  mongoose.models.BannerAd || mongoose.model<IBannerAd>("BannerAd", BannerAdSchema);

export default BannerAd;
