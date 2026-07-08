import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICategory extends Document {
  name: string;
  slug: string;
  icon?: string;
  color?: string;
  description?: string;
  sortOrder: number;
  active: boolean;
}

const CategorySchema: Schema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  icon: { type: String },
  color: { type: String },
  description: { type: String },
  sortOrder: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
});

const Category: Model<ICategory> =
  mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema);

export default Category;
