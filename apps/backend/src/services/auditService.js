import { AuditLog } from "../models/AuditLog.js";

export async function recordAudit(userId, action, entity, metadata = {}) {
  try {
    await AuditLog.create({ userId, action, entity, metadata });
  } catch (error) {
    console.warn(`Audit log skipped: ${error.message}`);
  }
}
