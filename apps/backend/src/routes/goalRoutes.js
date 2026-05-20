import { Router } from "express";
import { createGoal, listGoals } from "../controllers/goalController.js";
import { requireAuth } from "../middleware/auth.js";
import { requireFields } from "../middleware/validate.js";

export const goalRoutes = Router();

goalRoutes.use(requireAuth);
goalRoutes.get("/", listGoals);
goalRoutes.post("/", requireFields("name", "target"), createGoal);
