import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAdminUser extends Document {
  name: string;
  email: string;
  password?: string; // Hashed password
  createdAt: Date;
  updatedAt: Date;
}

const AdminUserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const AdminUser: Model<IAdminUser> =
  mongoose.models.AdminUser || mongoose.model<IAdminUser>("AdminUser", AdminUserSchema);

export default AdminUser;
