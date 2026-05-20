import { Router } from "express";
import { parseUpi } from "../controllers/paymentController.js";
import { requireAuth } from "../middleware/auth.js";

export const paymentRoutes = Router();

paymentRoutes.post("/upi/parse", requireAuth, parseUpi);
