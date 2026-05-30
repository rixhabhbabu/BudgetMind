import { Router } from "express";
import {
  forgotPassword,
  firebaseAuth,
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
authRoutes.post("/firebase-login", firebaseAuth);
authRoutes.post("/firebase-register", firebaseAuth);
authRoutes.post("/google", firebaseAuth);
