import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISiteSettings extends Document {
  key: string;
  value: any;
  updatedAt: Date;
}

const SiteSettingsSchema: Schema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    value: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: { createdAt: false, updatedAt: true } }
);

const SiteSettings: Model<ISiteSettings> =
  mongoose.models.SiteSettings || mongoose.model<ISiteSettings>("SiteSettings", SiteSettingsSchema);

export default SiteSettings;
