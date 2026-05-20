import { Router } from "express";
import { exportReport } from "../controllers/reportController.js";
import { requireAuth } from "../middleware/auth.js";

export const reportRoutes = Router();

reportRoutes.get("/monthly.pdf", requireAuth, exportReport);
