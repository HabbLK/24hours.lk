import mongoose, { Schema, Document, Model } from "mongoose";

export interface IService extends Document {
  name: string;
  slug: string;
  icon?: string;
  category: string;
  description: string;
  externalUrl: string;
  secondaryUrls?: { label: string; url: string }[];
  badge?: string;
  featured: boolean;
  active: boolean;
  sortOrder: number;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    icon: { type: String },
    category: { type: String, required: true },
    description: { type: String, required: true, maxlength: 150 },
    externalUrl: { type: String, required: true },
    secondaryUrls: [
      {
        label: { type: String },
        url: { type: String },
      },
    ],
    badge: { type: String },
    featured: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

const Service: Model<IService> =
  mongoose.models.Service || mongoose.model<IService>("Service", ServiceSchema);

export default Service;
