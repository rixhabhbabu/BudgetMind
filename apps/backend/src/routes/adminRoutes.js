import { Router } from "express";
import { getAdminOverview } from "../controllers/adminController.js";
import { requireAdmin } from "../middleware/admin.js";
import { requireAuth } from "../middleware/auth.js";

export const adminRoutes = Router();

adminRoutes.use(requireAuth, requireAdmin);
adminRoutes.get("/overview", getAdminOverview);
