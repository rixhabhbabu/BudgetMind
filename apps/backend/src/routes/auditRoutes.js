import { Router } from "express";
import { listAuditLogs } from "../controllers/auditController.js";
import { requireAuth } from "../middleware/auth.js";

export const auditRoutes = Router();

auditRoutes.get("/", requireAuth, listAuditLogs);
