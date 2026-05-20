import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  action: { type: String, required: true },
  entity: { type: String, required: true },
  metadata: { type: Map, of: String }
}, { timestamps: true });

export const AuditLog = mongoose.models.AuditLog ?? mongoose.model("AuditLog", auditLogSchema);
