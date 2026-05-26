import { Router } from "express";
import {
  analyzeSpending,
  chatWithAssistant,
  getRecommendations,
  predictSpending,
  getHealthScore,
  getPersonalizedRecommendations,
  getSpendingInsights,
} from "../controllers/aiController.js";
import { requireAuth } from "../middleware/auth.js";

export const aiRoutes = Router();

aiRoutes.get("/recommendations", requireAuth, getRecommendations);
aiRoutes.get("/analyze", requireAuth, analyzeSpending);
aiRoutes.get("/predict", requireAuth, predictSpending);
aiRoutes.get("/score", requireAuth, getHealthScore);
aiRoutes.get("/personalized-recommendations", requireAuth, getPersonalizedRecommendations);
aiRoutes.get("/insights", requireAuth, getSpendingInsights);
aiRoutes.post("/chat", requireAuth, chatWithAssistant);
