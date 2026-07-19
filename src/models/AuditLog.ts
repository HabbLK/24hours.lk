import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAuditLog extends Document {
  adminUserId: string;
  adminEmail: string;
  action: string;
  targetType: string;
  targetId: string;
  changes: Record<string, { from: any; to: any }>;
  timestamp: Date;
}

const AuditLogSchema: Schema = new Schema(
  {
    adminUserId: { type: String, required: true },
    adminEmail: { type: String, required: true },
    action: { type: String, required: true },
    targetType: { type: String, required: true },
    targetId: { type: String, required: true },
    changes: { type: Schema.Types.Mixed, default: {} },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

AuditLogSchema.index({ targetType: 1, targetId: 1 });
AuditLogSchema.index({ timestamp: -1 });

const AuditLog: Model<IAuditLog> =
  mongoose.models.AuditLog || mongoose.model<IAuditLog>("AuditLog", AuditLogSchema);

export default AuditLog;
