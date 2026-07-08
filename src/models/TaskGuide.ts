import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITaskGuide extends Document {
  title: string;
  slug: string;
  keywords?: string[];
  steps: {
    stepNumber: number;
    title: string;
    description: string;
    serviceId?: mongoose.Types.ObjectId;
    externalUrl?: string;
    linkLabel?: string;
  }[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TaskGuideSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    keywords: [{ type: String }],
    steps: [
      {
        stepNumber: { type: Number, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        serviceId: { type: Schema.Types.ObjectId, ref: "Service" },
        externalUrl: { type: String },
        linkLabel: { type: String },
      },
    ],
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const TaskGuide: Model<ITaskGuide> =
  mongoose.models.TaskGuide || mongoose.model<ITaskGuide>("TaskGuide", TaskGuideSchema);

export default TaskGuide;
