import { Router } from "express";
import { listBudgets, upsertBudget } from "../controllers/budgetController.js";
import { requireAuth } from "../middleware/auth.js";
import { requireFields } from "../middleware/validate.js";

export const budgetRoutes = Router();

budgetRoutes.use(requireAuth);
budgetRoutes.get("/", listBudgets);
budgetRoutes.post("/", requireFields("category", "limit"), upsertBudget);
