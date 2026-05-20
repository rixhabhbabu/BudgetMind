import { Router } from "express";
import {
  forgotPassword,
  googleOAuth,
  login,
  register,
  resendSignupOtp,
  resetPassword,
  verifySignupOtp
} from "../controllers/authController.js";

export const authRoutes = Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.post("/verify-signup-otp", verifySignupOtp);
authRoutes.post("/resend-signup-otp", resendSignupOtp);
authRoutes.post("/forgot-password", forgotPassword);
authRoutes.post("/reset-password", resetPassword);
authRoutes.post("/google", googleOAuth);
