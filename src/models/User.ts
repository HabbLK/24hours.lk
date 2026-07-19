import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email?: string;
  phone?: string;
  password?: string;
  avatar?: string;
  provider: "email" | "phone" | "google" | "facebook";
  providerId?: string;
  emailVerified?: Date;
  phoneVerified?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  role: "user" | "admin";
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, sparse: true },
    phone: { type: String, sparse: true },
    password: { type: String },
    avatar: { type: String },
    provider: {
      type: String,
      enum: ["email", "phone", "google", "facebook"],
      required: true,
      default: "email",
    },
    providerId: { type: String },
    emailVerified: { type: Date },
    phoneVerified: { type: Date },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

UserSchema.index({ email: 1 }, { unique: true, sparse: true });
UserSchema.index({ phone: 1 }, { unique: true, sparse: true });
UserSchema.index({ provider: 1, providerId: 1 }, { sparse: true });

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
