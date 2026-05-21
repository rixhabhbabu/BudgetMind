import { Router } from "express";
import { changePassword, getProfile, updateProfile } from "../controllers/userController.js";
import { requireAuth } from "../middleware/auth.js";

export const userRoutes = Router();

userRoutes.get("/me", requireAuth, getProfile);
userRoutes.patch("/me", requireAuth, updateProfile);
userRoutes.patch("/me/password", requireAuth, changePassword);
