import { Router } from "express";
import { getRecommendations } from "../controllers/aiController.js";
import { requireAuth } from "../middleware/auth.js";

export const aiRoutes = Router();

aiRoutes.get("/recommendations", requireAuth, getRecommendations);
