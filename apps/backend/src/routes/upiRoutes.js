import { Router } from "express";
import { connectUpi, listUpiTransactions, parseUpi } from "../controllers/upiController.js";
import { requireAuth } from "../middleware/auth.js";
import { requireFields } from "../middleware/validate.js";

export const upiRoutes = Router();

upiRoutes.use(requireAuth);
upiRoutes.post("/connect", requireFields("upiId"), connectUpi);
upiRoutes.get("/transactions", listUpiTransactions);
upiRoutes.post("/parse", parseUpi);
