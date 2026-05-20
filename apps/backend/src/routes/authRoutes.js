import { Router } from "express";
import { forgotPassword, googleOAuth, login, register, resetPassword } from "../controllers/authController.js";

export const authRoutes = Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.post("/forgot-password", forgotPassword);
authRoutes.post("/reset-password", resetPassword);
authRoutes.post("/google", googleOAuth);
