import { Router } from "express";
import { analyzeSpending, chatWithAssistant, getRecommendations, predictSpending } from "../controllers/aiController.js";
import { requireAuth } from "../middleware/auth.js";

export const aiRoutes = Router();

aiRoutes.get("/recommendations", requireAuth, getRecommendations);
aiRoutes.get("/analyze", requireAuth, analyzeSpending);
aiRoutes.get("/predict", requireAuth, predictSpending);
aiRoutes.post("/chat", requireAuth, chatWithAssistant);
