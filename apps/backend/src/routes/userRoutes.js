import { Router } from "express";
import { getProfile } from "../controllers/userController.js";
import { requireAuth } from "../middleware/auth.js";

export const userRoutes = Router();

userRoutes.get("/me", requireAuth, getProfile);
