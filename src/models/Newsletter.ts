import mongoose, { Schema, Document, Model } from "mongoose";

export interface INewsletterSubscriber extends Document {
  email: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NewsletterSubscriberSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const NewsletterSubscriber: Model<INewsletterSubscriber> =
  mongoose.models.NewsletterSubscriber ||
  mongoose.model<INewsletterSubscriber>("NewsletterSubscriber", NewsletterSubscriberSchema);

export default NewsletterSubscriber;
