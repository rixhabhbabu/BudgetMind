import { AuditLog } from "../models/AuditLog.js";

export async function listAuditLogs(req, res, next) {
  try {
    const logs = await AuditLog.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(100);
    res.json({ logs });
  } catch (error) {
    next(error);
  }
}
