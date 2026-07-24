import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email?: string;
  phone?: string;
  password?: string;
  avatar?: string;
  provider: "email" | "phone" | "google";
  providerId?: string;
  emailVerified?: Date;
  phoneVerified?: Date;
  emailOtp?: string;
  emailOtpExpires?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  role: "user" | "admin";
  active: boolean;
  // Referral system (groundwork for the referral feature — not yet wired
  // into signup flow). Points balance is NOT cached here — always
  // computed live via getPointsBalance() in lib/points.ts.
  referralCode: string;  // this user's own shareable code
  referredBy?: string;   // another user's referralCode, captured at signup
  referralBonusPaid: boolean; // prevents double-paying the referral bonus
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
      enum: ["email", "phone", "google"],
      required: true,
      default: "email",
    },
    providerId: { type: String },
    emailVerified: { type: Date },
    phoneVerified: { type: Date },
    emailOtp: { type: String },
    emailOtpExpires: { type: Date },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    active: { type: Boolean, default: true },
    referralCode: { type: String, unique: true, sparse: true },
    referredBy: { type: String, default: null },
    referralBonusPaid: { type: Boolean, default: false },
  },
  { timestamps: true }
);

UserSchema.index({ email: 1 }, { unique: true, sparse: true });
UserSchema.index({ phone: 1 }, { unique: true, sparse: true });
UserSchema.index({ provider: 1, providerId: 1 }, { sparse: true });

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;